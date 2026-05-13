import type { Identity } from '../db/model/localazy-user';
import type { ActivityLogEntry, ActivityLogSession } from '../db/model/activity-logs';

export type RedactedIdentity = {
  userId: string;
  name: string;
  scope: string;
  hasAccessToken: boolean;
};

export type EnvSnapshotEntry = {
  present: boolean;
  value: string | null;
};

export type SerializedContentTypeSchema = {
  kind?: unknown;
  collectionName?: unknown;
  info?: unknown;
  options?: unknown;
  pluginOptions?: unknown;
  attributes?: unknown;
};

export type DocumentTuple = {
  uid: string;
  documentId: string;
  locale: string;
  failed: boolean;
};

// Query-string keys we treat as secrets in every URL that ends up in the bundle.
const URL_SECRET_KEYS = ['token', 'secret', 'signature', 'key', 'apikey', 'api_key'];

// Allow-list of env vars that may appear verbatim in env.json. Anything not here is dropped
// (no exclude-list mechanism — explicit keys only, per AC3).
export const DEBUG_BUNDLE_ENV_ALLOWLIST = [
  'STRAPI_ADMIN_LOCALAZY_ENV',
  'STRAPI_ADMIN_BACKEND_URL',
  'NODE_ENV',
  'STRAPI_TELEMETRY_DISABLED',
] as const;

export const redactIdentity = (identity: Identity | null | undefined): RedactedIdentity | null => {
  if (!identity) return null;
  return {
    userId: identity.user?.id ?? '',
    name: identity.user?.name ?? '',
    scope: identity.scope ?? '',
    hasAccessToken: Boolean(identity.accessToken),
  };
};

export const scrubUrlSecrets = (input: unknown): unknown => {
  if (typeof input !== 'string') return input;
  // Cheap guard: if the string doesn't look URL-ish, skip parsing.
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(input) && !input.includes('?')) return input;
  try {
    const url = new URL(input);
    let mutated = false;
    for (const k of [...url.searchParams.keys()]) {
      if (URL_SECRET_KEYS.includes(k.toLowerCase())) {
        url.searchParams.delete(k);
        mutated = true;
      }
    }
    return mutated ? url.toString() : input;
  } catch {
    return input;
  }
};

export const pickEnvAllowlist = (env: NodeJS.ProcessEnv): Record<string, EnvSnapshotEntry> => {
  const out: Record<string, EnvSnapshotEntry> = {};
  for (const key of DEBUG_BUNDLE_ENV_ALLOWLIST) {
    const raw = env[key];
    const present = raw !== undefined;
    out[key] = {
      present,
      value: present ? (raw as string) : null,
    };
  }
  return out;
};

export const serializeContentTypeSchema = (contentType: unknown): SerializedContentTypeSchema | null => {
  if (!contentType || typeof contentType !== 'object') return null;
  const ct = contentType as Record<string, unknown>;
  return {
    kind: ct.kind,
    collectionName: ct.collectionName,
    info: ct.info,
    options: ct.options,
    pluginOptions: ct.pluginOptions,
    attributes: ct.attributes,
  };
};

// Internal Strapi fields that point at admin users (and so leak admin metadata).
const DOCUMENT_INTERNAL_FIELDS = ['createdBy', 'updatedBy'];

export const stripDocumentInternals = <T>(doc: T): T => {
  if (!doc || typeof doc !== 'object') return doc;
  const clone: Record<string, unknown> = { ...(doc as Record<string, unknown>) };
  for (const field of DOCUMENT_INTERNAL_FIELDS) {
    delete clone[field];
  }
  return clone as T;
};

// Match Strapi content-type UIDs like `api::article.article` or `plugin::users-permissions.user`
// followed by `[<documentId>]` and `in <locale>`. This is the only signal in current activity-log
// messages — see localazy-transfer-download-service messages (Created/Updated/Failed to.../Error processing).
const UID_PATTERN = '(?<uid>(?:api|plugin)::[a-z0-9-]+\\.[a-z0-9-]+)';
const TUPLE_REGEX = new RegExp(`${UID_PATTERN}\\s*\\[(?<documentId>[^\\]]+)\\]\\s+in\\s+(?<locale>[a-zA-Z0-9_-]+)`);

const isFailureMessage = (message: string): boolean => /^(Failed|Error)\b/i.test(message);

// Walk session entries, parse (uid, documentId, locale) tuples out of their message strings,
// and emit them in **failed-first priority order**, then passed entries, deduped by key.
// (A passed re-attempt of a previously-failed tuple stays in the failed group.)
export const extractUidsAndDocumentsFromSession = (session: Pick<ActivityLogSession, 'entries'>): DocumentTuple[] => {
  const failedByKey = new Map<string, DocumentTuple>();
  const passedByKey = new Map<string, DocumentTuple>();

  const visit = (entries: ActivityLogEntry[]) => {
    for (const entry of entries) {
      const match = TUPLE_REGEX.exec(entry.message);
      if (!match?.groups) continue;
      const { uid, documentId, locale } = match.groups as { uid: string; documentId: string; locale: string };
      const key = `${uid}|${documentId}|${locale}`;
      const tuple: DocumentTuple = { uid, documentId, locale, failed: isFailureMessage(entry.message) };
      if (tuple.failed) {
        passedByKey.delete(key);
        if (!failedByKey.has(key)) failedByKey.set(key, tuple);
      } else if (!failedByKey.has(key) && !passedByKey.has(key)) {
        passedByKey.set(key, tuple);
      }
    }
  };

  visit(session.entries ?? []);
  return [...failedByKey.values(), ...passedByKey.values()];
};
