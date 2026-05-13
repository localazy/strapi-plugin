import type { Identity } from '../db/model/localazy-user';

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
