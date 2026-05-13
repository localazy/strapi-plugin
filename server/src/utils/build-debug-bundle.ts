import path from 'path';
import { promises as fs } from 'fs';
import JSZip from 'jszip';

import type { ActivityLogSession } from '../db/model/activity-logs';
import type { PluginSettings } from '../db/model/plugin-settings';
import type { Identity } from '../db/model/localazy-user';
import type { ContentTransferSetup } from '../models/plugin/content-transfer-setup';
import {
  DEBUG_BUNDLE_ENV_ALLOWLIST,
  DocumentTuple,
  EnvSnapshotEntry,
  extractUidsAndDocumentsFromSession,
  pickEnvAllowlist,
  redactIdentity,
  RedactedIdentity,
  scrubUrlSecrets,
  serializeContentTypeSchema,
  stripDocumentInternals,
  SerializedContentTypeSchema,
} from './sanitize-debug-bundle';

export const DEBUG_BUNDLE_SCHEMA_VERSION = 1;

// Caps from § Caps in the plan.
export const CAPS = {
  perEntryBytes: 1 * 1024 * 1024, // 1 MB
  totalEntries: 100,
  errorLogBytes: 2 * 1024 * 1024, // 2 MB
  consoleErrorsLines: 200,
  browserPayloadBytes: 64 * 1024, // 64 KB
};

export type TruncationMarker =
  | { kind: 'entries-skipped'; tuples: Array<{ uid: string; documentId: string; locale: string }> }
  | { kind: 'entry-too-large'; uid: string; documentId: string; locale: string; originalSizeBytes: number }
  | { kind: 'error-log-truncated'; originalSizeBytes: number }
  | { kind: 'browser-payload-truncated'; originalSizeBytes: number }
  | { kind: 'console-errors-truncated'; originalCount: number };

export type BrowserPayload = {
  userAgent?: string;
  language?: string;
  viewport?: { width: number; height: number };
  consoleErrors?: string[];
};

export type BuildDebugBundleParams = {
  strapi: any;
  sessionId: string;
  browserPayloadEncoded?: string | null;
};

export type BuildDebugBundleResult = {
  zipBuffer: Buffer;
  filename: string;
};

// Format used in the zip filename — keep filesystem-safe.
const formatTimestampForFilename = (ms: number): string => new Date(ms).toISOString().replace(/[:.]/g, '-');

// Make a Strapi UID safe to use as a zip path segment, but keep it round-trippable: `::` (the
// api/plugin/admin separator) becomes `--`, and `.` (the namespace/name separator) becomes `-`.
const safeUidForPath = (uid: string): string => uid.replace(/::/g, '--').replace(/\./g, '-');

const decodeBrowserPayload = (
  encoded: string | null | undefined
): { payload: BrowserPayload | null; truncationMarkers: TruncationMarker[] } => {
  const markers: TruncationMarker[] = [];
  if (!encoded) return { payload: null, truncationMarkers: markers };
  try {
    const raw = Buffer.from(encoded, 'base64').toString('utf8');
    if (Buffer.byteLength(raw, 'utf8') > CAPS.browserPayloadBytes) {
      markers.push({ kind: 'browser-payload-truncated', originalSizeBytes: Buffer.byteLength(raw, 'utf8') });
    }
    const parsed = JSON.parse(raw) as BrowserPayload;
    if (parsed && Array.isArray(parsed.consoleErrors) && parsed.consoleErrors.length > CAPS.consoleErrorsLines) {
      markers.push({ kind: 'console-errors-truncated', originalCount: parsed.consoleErrors.length });
      parsed.consoleErrors = parsed.consoleErrors.slice(0, CAPS.consoleErrorsLines);
    }
    return { payload: parsed, truncationMarkers: markers };
  } catch {
    return { payload: null, truncationMarkers: markers };
  }
};

// Walk arbitrary plain JSON and run `scrubUrlSecrets` on every string. Mutates a fresh clone.
const deepScrubUrls = <T>(value: T): T => {
  if (value == null) return value;
  if (typeof value === 'string') return scrubUrlSecrets(value) as T;
  if (Array.isArray(value)) return value.map(deepScrubUrls) as unknown as T;
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = deepScrubUrls(v);
    }
    return out as T;
  }
  return value;
};

const sanitizePluginSettings = (settings: PluginSettings): PluginSettings => {
  const cloned: PluginSettings = JSON.parse(JSON.stringify(settings ?? {}));
  if (cloned.webhookConfig?.url) {
    cloned.webhookConfig.url = scrubUrlSecrets(cloned.webhookConfig.url) as string;
  }
  return cloned;
};

const sanitizeSession = (session: ActivityLogSession): ActivityLogSession => {
  const cloned = JSON.parse(JSON.stringify(session)) as ActivityLogSession;
  for (const entry of cloned.entries ?? []) {
    if (entry.data !== undefined) {
      entry.data = deepScrubUrls(entry.data);
    }
  }
  return cloned;
};

const buildErrorLog = (session: ActivityLogSession): { text: string; markers: TruncationMarker[] } => {
  const lines: string[] = [];
  for (const entry of session.entries ?? []) {
    const ts = Number.isFinite(entry.timestamp) ? new Date(entry.timestamp).toISOString() : 'unknown';
    lines.push(`${ts}  ${entry.message}`);
  }
  if (session.status === 'failed' && session.summary) {
    lines.push(`ERROR: ${session.summary}`);
  }
  const full = lines.join('\n');
  const fullBytes = Buffer.byteLength(full, 'utf8');
  if (fullBytes <= CAPS.errorLogBytes) {
    return { text: full, markers: [] };
  }
  // Truncate from the start so the most recent (likely failing) entries are kept.
  const truncated = Buffer.from(full, 'utf8')
    .subarray(fullBytes - CAPS.errorLogBytes)
    .toString('utf8');
  return {
    text: `...[truncated, kept last ${CAPS.errorLogBytes} bytes]\n${truncated}`,
    markers: [{ kind: 'error-log-truncated', originalSizeBytes: fullBytes }],
  };
};

const readHostPackages = async (strapi: any): Promise<{ data: Record<string, unknown> | null; reason?: string }> => {
  const appRoot: string | undefined = strapi?.dirs?.app?.root ?? strapi?.dirs?.root ?? process.cwd();
  if (!appRoot) return { data: null, reason: 'host-app-root-unknown' };
  try {
    const raw = await fs.readFile(path.join(appRoot, 'package.json'), 'utf8');
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      data: {
        name: parsed.name,
        version: parsed.version,
        dependencies: parsed.dependencies ?? {},
        devDependencies: parsed.devDependencies ?? {},
      },
    };
  } catch (err) {
    return { data: null, reason: err instanceof Error ? err.message : String(err) };
  }
};

const buildReadme = ({
  sessionShortId,
  sessionId,
  schemaVersion,
  hostPackagesSkipped,
}: {
  sessionShortId: string;
  sessionId: string;
  schemaVersion: number;
  hostPackagesSkipped: boolean;
}): string => {
  const lines: string[] = [];
  lines.push(`# Localazy Strapi Plugin — Troubleshooting Bundle`);
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Session id: ${sessionId}`);
  lines.push(`Schema version: ${schemaVersion}`);
  lines.push('');
  lines.push('## Contents');
  lines.push('');
  lines.push('- `meta.json` — schema version, session metadata.');
  lines.push('- `versions.json` — plugin version, Strapi version, Node version, platform/arch.');
  lines.push('- `env.json` — allow-listed environment variables only.');
  lines.push('- `browser.json` — user agent, language, viewport, console errors (from the admin UI).');
  lines.push('- `session.json` — full activity-log session record (URLs scrubbed of secret query keys).');
  lines.push('- `error.log` — chronological text log of session entries.');
  lines.push('- `plugin-settings.json` — full plugin settings (webhook URL secrets scrubbed).');
  lines.push('- `content-transfer-setup.json` — content-transfer setup record.');
  if (hostPackagesSkipped) {
    lines.push('- `host-packages.json` — NOT INCLUDED (could not be read; see `bundle-truncated.json`).');
  } else {
    lines.push("- `host-packages.json` — host project's package.json (deps + devDeps only).");
  }
  lines.push('- `content-types/` — schema.json per touched content-type UID.');
  lines.push('- `entries/<uid>/<documentId>--<locale>.json` — per-entry payload from `strapi.documents().findOne()`.');
  lines.push('- `bundle-truncated.json` — present only if any per-section cap was exceeded.');
  lines.push('');
  lines.push('## Reproducing locally');
  lines.push('');
  lines.push('1. `unzip` the bundle.');
  lines.push('2. Recreate the content types from `content-types/*.schema.json` in your Strapi project.');
  lines.push('3. Import the entries via the Document Service using `entries/<uid>/*.json`.');
  lines.push('4. Apply `plugin-settings.json` and `content-transfer-setup.json` via the plugin admin UI.');
  lines.push('5. Trigger the same upload/download/webhook with the same locale set.');
  lines.push('6. Compare the failure against `error.log` and `session.json`.');
  lines.push('');
  lines.push(`Bundle short id: ${sessionShortId}`);
  return lines.join('\n');
};

export const buildDebugBundle = async ({
  strapi,
  sessionId,
  browserPayloadEncoded,
}: BuildDebugBundleParams): Promise<BuildDebugBundleResult> => {
  const zip = new JSZip();
  const truncationMarkers: TruncationMarker[] = [];

  // 1. Look up the source services.
  const pluginName = 'localazy';
  const activityLogsService = strapi.plugin(pluginName).service('ActivityLogsService');
  const pluginSettingsService = strapi.plugin(pluginName).service('PluginSettingsService');
  const strapiService = strapi.plugin(pluginName).service('StrapiService');
  const localazyUserService = strapi.plugin(pluginName).service('LocalazyUserService');

  const session: ActivityLogSession | null = await activityLogsService.getSession(sessionId);
  if (!session) {
    throw new Error(`Session ${sessionId} not found`);
  }

  const sessionShortId = session.id.slice(0, 8);

  // 2. Gather verbatim + sanitized fragments.
  const pluginSettingsRaw: PluginSettings = await pluginSettingsService.getPluginSettings();
  const contentTransferSetup: ContentTransferSetup = await pluginSettingsService.getContentTransferSetup();
  const identity: Identity | null = await localazyUserService.getUser();
  const redactedIdentity: RedactedIdentity | null = redactIdentity(identity);
  const pluginVersion: string = await strapiService.getPluginVersion();
  const strapiVersion: string = strapiService.getStrapiVersion();

  // 3. Build top-level files.
  zip.file(
    'meta.json',
    JSON.stringify(
      {
        schemaVersion: DEBUG_BUNDLE_SCHEMA_VERSION,
        generatedAt: new Date().toISOString(),
        sessionId: session.id,
        sessionShortId,
        eventType: session.eventType,
        status: session.status,
        startedAt: session.startedAt,
        finishedAt: session.finishedAt ?? null,
        initiatedBy: session.initiatedBy,
        identity: redactedIdentity,
      },
      null,
      2
    )
  );

  zip.file(
    'versions.json',
    JSON.stringify(
      {
        plugin: { name: '@localazy/strapi-plugin', version: pluginVersion },
        strapi: { version: strapiVersion },
        node: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      null,
      2
    )
  );

  const envSnapshot: Record<string, EnvSnapshotEntry> = pickEnvAllowlist(process.env);
  zip.file(
    'env.json',
    JSON.stringify(
      {
        allowlist: [...DEBUG_BUNDLE_ENV_ALLOWLIST],
        values: envSnapshot,
      },
      null,
      2
    )
  );

  const { payload: browserPayload, truncationMarkers: browserMarkers } = decodeBrowserPayload(browserPayloadEncoded);
  truncationMarkers.push(...browserMarkers);
  zip.file('browser.json', JSON.stringify(browserPayload ? browserPayload : { captured: false }, null, 2));

  zip.file('session.json', JSON.stringify(sanitizeSession(session), null, 2));

  const { text: errorLogText, markers: errorLogMarkers } = buildErrorLog(session);
  truncationMarkers.push(...errorLogMarkers);
  zip.file('error.log', errorLogText);

  zip.file('plugin-settings.json', JSON.stringify(sanitizePluginSettings(pluginSettingsRaw), null, 2));
  zip.file('content-transfer-setup.json', JSON.stringify(contentTransferSetup, null, 2));

  const hostPackages = await readHostPackages(strapi);
  if (hostPackages.data) {
    zip.file('host-packages.json', JSON.stringify(hostPackages.data, null, 2));
  }

  // 4. Per-UID content-type schemas + per-entry payloads.
  const tuples = extractUidsAndDocumentsFromSession(session);
  const failedTuples = tuples.filter((t) => t.failed);
  const passedTuples = tuples.filter((t) => !t.failed);
  const prioritised: DocumentTuple[] = [...failedTuples, ...passedTuples];

  const kept = prioritised.slice(0, CAPS.totalEntries);
  const skipped = prioritised.slice(CAPS.totalEntries);
  if (skipped.length > 0) {
    truncationMarkers.push({
      kind: 'entries-skipped',
      tuples: skipped.map(({ uid, documentId, locale }) => ({ uid, documentId, locale })),
    });
  }

  const uniqueUids = [...new Set(kept.map((t) => t.uid))];
  for (const uid of uniqueUids) {
    const schema: SerializedContentTypeSchema | null = serializeContentTypeSchema(strapi.contentTypes?.[uid]);
    if (schema) {
      zip.file(`content-types/${safeUidForPath(uid)}.schema.json`, JSON.stringify(schema, null, 2));
    }
  }

  for (const tuple of kept) {
    let documentJson: unknown = null;
    try {
      const doc = await strapi
        .documents(tuple.uid)
        .findOne({ documentId: tuple.documentId, locale: tuple.locale, populate: '*' });
      documentJson = doc ? stripDocumentInternals(doc) : null;
    } catch (err) {
      documentJson = { __error: err instanceof Error ? err.message : String(err) };
    }
    const serialised = JSON.stringify(documentJson, null, 2);
    const sizeBytes = Buffer.byteLength(serialised, 'utf8');
    let body: string;
    if (sizeBytes > CAPS.perEntryBytes) {
      truncationMarkers.push({
        kind: 'entry-too-large',
        uid: tuple.uid,
        documentId: tuple.documentId,
        locale: tuple.locale,
        originalSizeBytes: sizeBytes,
      });
      body = JSON.stringify({ __truncated: true, originalSizeBytes: sizeBytes }, null, 2);
    } else {
      body = serialised;
    }
    zip.file(`entries/${safeUidForPath(tuple.uid)}/${tuple.documentId}--${tuple.locale}.json`, body);
  }

  // 5. README + truncation marker.
  zip.file(
    'README.md',
    buildReadme({
      sessionShortId,
      sessionId: session.id,
      schemaVersion: DEBUG_BUNDLE_SCHEMA_VERSION,
      hostPackagesSkipped: !hostPackages.data,
    })
  );

  if (truncationMarkers.length > 0 || !hostPackages.data) {
    const marker = {
      schemaVersion: DEBUG_BUNDLE_SCHEMA_VERSION,
      markers: truncationMarkers,
      hostPackagesSkipped: hostPackages.data ? null : (hostPackages.reason ?? 'unknown'),
    };
    zip.file('bundle-truncated.json', JSON.stringify(marker, null, 2));
  }

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const filename = `localazy-debug-bundle-${sessionShortId}-${formatTimestampForFilename(Date.now())}.zip`;
  return { zipBuffer, filename };
};
