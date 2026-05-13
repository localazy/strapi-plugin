import {
  DEBUG_BUNDLE_ENV_ALLOWLIST,
  extractUidsAndDocumentsFromSession,
  pickEnvAllowlist,
  redactIdentity,
  scrubUrlSecrets,
  serializeContentTypeSchema,
  stripDocumentInternals,
} from '../sanitize-debug-bundle';

describe('sanitize-debug-bundle', () => {
  describe('redactIdentity', () => {
    it('reduces a full identity to the safe shape and reports token presence', () => {
      const result = redactIdentity({
        accessToken: 'secret-token-123',
        scope: 'translate',
        project: { id: 'p1', image: '', name: 'P', url: 'https://example.test' },
        user: { id: 'u1', name: 'Alice' },
      });
      expect(result).toEqual({ userId: 'u1', name: 'Alice', scope: 'translate', hasAccessToken: true });
      expect(result).not.toHaveProperty('accessToken');
    });

    it('reports hasAccessToken=false when token is empty', () => {
      const result = redactIdentity({
        accessToken: '',
        scope: '',
        project: { id: '', image: '', name: '', url: '' },
        user: { id: '', name: '' },
      });
      expect(result).toEqual({ userId: '', name: '', scope: '', hasAccessToken: false });
    });

    it('returns null for null identity', () => {
      expect(redactIdentity(null)).toBeNull();
      expect(redactIdentity(undefined)).toBeNull();
    });
  });

  describe('scrubUrlSecrets', () => {
    it('strips known secret query keys (case-insensitive)', () => {
      const result = scrubUrlSecrets('https://hooks.example.test/webhook?token=abc&page=1&Secret=xyz&Signature=s');
      expect(result).toBe('https://hooks.example.test/webhook?page=1');
    });

    it('handles apikey / api_key variants', () => {
      const result = scrubUrlSecrets('https://api.example.test/x?ApiKey=A&api_key=B&keep=1');
      expect(result).toBe('https://api.example.test/x?keep=1');
    });

    it('passes through unaffected URLs untouched', () => {
      const url = 'https://example.test/path?keep=1&also=2';
      expect(scrubUrlSecrets(url)).toBe(url);
    });

    it('returns non-string values unchanged', () => {
      expect(scrubUrlSecrets(123 as unknown as string)).toBe(123);
      expect(scrubUrlSecrets(null as unknown as string)).toBeNull();
    });

    it('returns invalid URL strings unchanged', () => {
      expect(scrubUrlSecrets('not a url at all')).toBe('not a url at all');
    });
  });

  describe('pickEnvAllowlist', () => {
    it('passes only the listed keys and marks presence', () => {
      const out = pickEnvAllowlist({
        STRAPI_ADMIN_LOCALAZY_ENV: 'dev',
        STRAPI_ADMIN_BACKEND_URL: 'https://strapi.example.test',
        NODE_ENV: 'production',
        // STRAPI_TELEMETRY_DISABLED intentionally absent
        JWT_SECRET: 'must-not-leak',
        DATABASE_PASSWORD: 'must-not-leak',
        ADMIN_JWT_SECRET: 'must-not-leak',
        API_TOKEN_SALT: 'must-not-leak',
        APP_KEYS: 'must-not-leak',
        TRANSFER_TOKEN_SALT: 'must-not-leak',
      } as NodeJS.ProcessEnv);

      expect(Object.keys(out).sort()).toEqual([...DEBUG_BUNDLE_ENV_ALLOWLIST].sort());
      expect(out.STRAPI_ADMIN_LOCALAZY_ENV).toEqual({ present: true, value: 'dev' });
      expect(out.STRAPI_TELEMETRY_DISABLED).toEqual({ present: false, value: null });
      expect(JSON.stringify(out)).not.toContain('must-not-leak');
    });
  });

  describe('serializeContentTypeSchema', () => {
    it('reduces a content type to the on-disk schema.json shape', () => {
      const ct = {
        kind: 'collectionType',
        collectionName: 'articles',
        info: { singularName: 'article', pluralName: 'articles', displayName: 'Article' },
        options: { draftAndPublish: true },
        pluginOptions: { i18n: { localized: true } },
        attributes: { title: { type: 'string' } },
        // fields that should be omitted:
        modelName: 'article',
        uid: 'api::article.article',
        lifecycles: { afterCreate: () => undefined },
      };
      const result = serializeContentTypeSchema(ct);
      expect(result).toEqual({
        kind: 'collectionType',
        collectionName: 'articles',
        info: ct.info,
        options: ct.options,
        pluginOptions: ct.pluginOptions,
        attributes: ct.attributes,
      });
      expect(result).not.toHaveProperty('lifecycles');
    });

    it('returns null for non-objects', () => {
      expect(serializeContentTypeSchema(null)).toBeNull();
      expect(serializeContentTypeSchema(undefined)).toBeNull();
    });
  });

  describe('stripDocumentInternals', () => {
    it('removes createdBy and updatedBy', () => {
      const result = stripDocumentInternals({
        id: 1,
        documentId: 'd',
        title: 'Hello',
        createdBy: { id: 5, email: 'admin@example.test' },
        updatedBy: { id: 5 },
      });
      expect(result).toEqual({ id: 1, documentId: 'd', title: 'Hello' });
    });

    it('leaves user-authored fields intact', () => {
      const result = stripDocumentInternals({ title: 't', body: 'b' });
      expect(result).toEqual({ title: 't', body: 'b' });
    });
  });

  describe('extractUidsAndDocumentsFromSession', () => {
    const passedEntry = (message: string, ts: number) => ({ message, timestamp: ts });

    it('parses created/updated/failed messages into tuples', () => {
      const tuples = extractUidsAndDocumentsFromSession({
        entries: [
          passedEntry('Upload started', 1),
          passedEntry('Created entry for api::article.article [doc-1] in fr', 2),
          passedEntry('Updated api::article.article [doc-2] in es', 3),
          passedEntry('Failed to create api::article.article [doc-3] in de: schema mismatch', 4),
        ],
      });
      expect(tuples).toEqual([
        { uid: 'api::article.article', documentId: 'doc-3', locale: 'de', failed: true },
        { uid: 'api::article.article', documentId: 'doc-1', locale: 'fr', failed: false },
        { uid: 'api::article.article', documentId: 'doc-2', locale: 'es', failed: false },
      ]);
    });

    it('emits failed tuples before passed tuples in the output', () => {
      const tuples = extractUidsAndDocumentsFromSession({
        entries: [
          passedEntry('Created entry for api::a.a [d1] in fr', 1),
          passedEntry('Created entry for api::a.a [d2] in fr', 2),
          passedEntry('Failed to update api::a.a [d3] in es: boom', 3),
          passedEntry('Error processing api::a.a [d4] in de: oh no', 4),
        ],
      });
      expect(tuples.slice(0, 2).every((t) => t.failed)).toBe(true);
      expect(tuples.slice(2).every((t) => !t.failed)).toBe(true);
      expect(tuples.map((t) => t.documentId)).toEqual(['d3', 'd4', 'd1', 'd2']);
    });

    it('keeps a tuple in the failed group even if it was also created/updated successfully later', () => {
      const tuples = extractUidsAndDocumentsFromSession({
        entries: [
          passedEntry('Failed to create api::a.a [d1] in fr: boom', 1),
          passedEntry('Created entry for api::a.a [d1] in fr', 2), // retry succeeded
          passedEntry('Created entry for api::a.a [d2] in fr', 3),
        ],
      });
      const d1 = tuples.find((t) => t.documentId === 'd1');
      expect(d1).toEqual({ uid: 'api::a.a', documentId: 'd1', locale: 'fr', failed: true });
      expect(tuples).toHaveLength(2);
      expect(tuples[0]).toEqual(d1);
      expect(tuples[1]).toEqual({ uid: 'api::a.a', documentId: 'd2', locale: 'fr', failed: false });
    });

    it('ignores messages without a parseable tuple', () => {
      const tuples = extractUidsAndDocumentsFromSession({
        entries: [
          passedEntry('Upload finished', 1),
          passedEntry('Excluding 3 entries for model api::a.a from upload', 2),
        ],
      });
      expect(tuples).toEqual([]);
    });

    it('recognises plugin::foo.bar UIDs', () => {
      const tuples = extractUidsAndDocumentsFromSession({
        entries: [passedEntry('Created entry for plugin::users-permissions.user [u1] in fr', 1)],
      });
      expect(tuples).toEqual([
        { uid: 'plugin::users-permissions.user', documentId: 'u1', locale: 'fr', failed: false },
      ]);
    });
  });
});
