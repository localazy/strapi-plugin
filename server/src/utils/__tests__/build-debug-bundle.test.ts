import JSZip from 'jszip';
import { buildDebugBundle, CAPS, DEBUG_BUNDLE_SCHEMA_VERSION, SessionNotFoundError } from '../build-debug-bundle';
import type { ActivityLogSession } from '../../db/model/activity-logs';
import type { Core } from '@strapi/strapi';

type FakeServicesOverrides = {
  session?: ActivityLogSession | null;
  pluginSettings?: any;
  contentTransferSetup?: any;
  identity?: any;
  pluginVersion?: string;
  strapiVersion?: string;
  contentTypes?: Record<string, any>;
  documents?: (uid: string) => {
    findOne: (args: { documentId: string; locale: string; populate: string }) => Promise<any>;
  };
};

const buildFakeStrapi = (overrides: FakeServicesOverrides = {}) => {
  const session: ActivityLogSession | null =
    overrides.session === undefined
      ? {
          id: '_Abc123Def456Gh78',
          eventType: 'download',
          status: 'failed',
          startedAt: Date.UTC(2026, 0, 1, 12, 0, 0),
          finishedAt: Date.UTC(2026, 0, 1, 12, 5, 0),
          initiatedBy: 'tester@example.test',
          summary: 'Failed to download all entries',
          entries: [
            { message: 'Download started (full)', timestamp: Date.UTC(2026, 0, 1, 12, 0, 0) },
            {
              message: 'Created entry for api::article.article [doc-1] in fr',
              timestamp: Date.UTC(2026, 0, 1, 12, 1, 0),
            },
            {
              message: 'Failed to update api::article.article [doc-2] in es: validation error',
              timestamp: Date.UTC(2026, 0, 1, 12, 2, 0),
            },
          ],
          attemptedEntries: [
            {
              uid: 'api::article.article',
              documentId: 'doc-1',
              locale: 'fr',
              status: 'success',
              attemptedAt: Date.UTC(2026, 0, 1, 12, 1, 0),
            },
            {
              uid: 'api::article.article',
              documentId: 'doc-2',
              locale: 'es',
              status: 'failed',
              errorMessage: 'validation error',
              attemptedAt: Date.UTC(2026, 0, 1, 12, 2, 0),
            },
          ],
        }
      : overrides.session;

  const pluginSettings = overrides.pluginSettings ?? {
    defaultRoute: null,
    webhookConfig: { url: 'https://hooks.example.test/wh?token=SUPER&page=1', webhookId: 'wh-1' },
  };

  const contentTransferSetup = overrides.contentTransferSetup ?? { has_setup: true, setup: [] };

  const identity =
    overrides.identity === undefined
      ? {
          accessToken: 'real-secret-token',
          scope: 'translate',
          project: { id: 'p1', image: '', name: 'P', url: 'https://example.test' },
          user: { id: 'u1', name: 'Alice' },
        }
      : overrides.identity;

  const contentTypes = overrides.contentTypes ?? {
    'api::article.article': {
      kind: 'collectionType',
      collectionName: 'articles',
      info: { singularName: 'article', pluralName: 'articles', displayName: 'Article' },
      options: { draftAndPublish: true },
      pluginOptions: { i18n: { localized: true } },
      attributes: { title: { type: 'string' } },
    },
  };

  const documents =
    overrides.documents ??
    ((_uid: string) => ({
      findOne: async ({ documentId, locale }: { documentId: string; locale: string }) => ({
        documentId,
        locale,
        title: `Hello ${documentId} ${locale}`,
        createdBy: { id: 99, email: 'admin@example.test' },
        updatedBy: { id: 99 },
      }),
    }));

  const services: Record<string, any> = {
    ActivityLogsService: {
      getSession: async (id: string) => (session && session.id === id ? session : null),
    },
    PluginSettingsService: {
      getPluginSettings: async () => pluginSettings,
      getContentTransferSetup: async () => contentTransferSetup,
    },
    StrapiService: {
      getPluginVersion: async () => overrides.pluginVersion ?? '1.2.3',
      getStrapiVersion: () => overrides.strapiVersion ?? '5.6.0',
    },
    LocalazyUserService: {
      getUser: async () => identity,
    },
  };

  return {
    plugin: (_name: string) => ({ service: (key: string) => services[key] }),
    contentTypes,
    documents,
    dirs: { app: { root: '/tmp/some-nonexistent-host-app-root-for-tests' } },
    log: { error: () => undefined, info: () => undefined, warn: () => undefined },
  } as unknown as Core.Strapi;
};

const readZipEntries = async (buffer: Buffer): Promise<Record<string, string>> => {
  const zip = await JSZip.loadAsync(buffer);
  const out: Record<string, string> = {};
  for (const [name, file] of Object.entries(zip.files)) {
    if (file.dir) continue;
    out[name] = await file.async('string');
  }
  return out;
};

describe('buildDebugBundle', () => {
  it('produces the expected top-level file list and meta.json shape', async () => {
    const strapi = buildFakeStrapi();
    const { zipBuffer, filename } = await buildDebugBundle({ strapi, sessionId: '_Abc123Def456Gh78' });

    expect(filename).toMatch(/^localazy-debug-bundle-_Abc123D-.*\.zip$/);

    const files = await readZipEntries(zipBuffer);
    const names = Object.keys(files).sort();
    expect(names).toEqual(
      expect.arrayContaining([
        'README.md',
        'meta.json',
        'versions.json',
        'env.json',
        'browser.json',
        'session.json',
        'error.log',
        'plugin-settings.json',
        'content-transfer-setup.json',
        'content-types/api--article-article.schema.json',
        'entries/api--article-article/doc-2--es.json',
        'entries/api--article-article/doc-1--fr.json',
      ])
    );

    const meta = JSON.parse(files['meta.json']);
    expect(meta).toMatchObject({
      schemaVersion: DEBUG_BUNDLE_SCHEMA_VERSION,
      sessionId: '_Abc123Def456Gh78',
      sessionShortId: '_Abc123D',
      eventType: 'download',
      status: 'failed',
      identity: { userId: 'u1', name: 'Alice', scope: 'translate', hasAccessToken: true },
    });
  });

  it('never leaks the raw access token anywhere', async () => {
    const strapi = buildFakeStrapi({
      identity: {
        accessToken: 'unique-secret-needle-in-bundle',
        scope: 'translate',
        project: { id: '', image: '', name: '', url: '' },
        user: { id: '', name: '' },
      },
    });
    const { zipBuffer } = await buildDebugBundle({ strapi, sessionId: '_Abc123Def456Gh78' });
    const files = await readZipEntries(zipBuffer);
    for (const [, body] of Object.entries(files)) {
      expect(body).not.toContain('unique-secret-needle-in-bundle');
    }
  });

  it('scrubs webhook URL secrets in plugin-settings.json', async () => {
    const strapi = buildFakeStrapi();
    const { zipBuffer } = await buildDebugBundle({ strapi, sessionId: '_Abc123Def456Gh78' });
    const files = await readZipEntries(zipBuffer);
    const settings = JSON.parse(files['plugin-settings.json']);
    expect(settings.webhookConfig.url).toBe('https://hooks.example.test/wh?page=1');
    expect(JSON.stringify(settings)).not.toContain('SUPER');
  });

  it('strips createdBy/updatedBy from emitted entry payloads', async () => {
    const strapi = buildFakeStrapi();
    const { zipBuffer } = await buildDebugBundle({ strapi, sessionId: '_Abc123Def456Gh78' });
    const files = await readZipEntries(zipBuffer);
    const entry = JSON.parse(files['entries/api--article-article/doc-1--fr.json']);
    expect(entry).not.toHaveProperty('createdBy');
    expect(entry).not.toHaveProperty('updatedBy');
    expect(entry.title).toBe('Hello doc-1 fr');
  });

  it('uses the env allowlist and drops sensitive keys', async () => {
    process.env.STRAPI_ADMIN_LOCALAZY_ENV = 'jest-env-test';
    process.env.JWT_SECRET = 'must-not-leak-jwt';
    try {
      const strapi = buildFakeStrapi();
      const { zipBuffer } = await buildDebugBundle({ strapi, sessionId: '_Abc123Def456Gh78' });
      const files = await readZipEntries(zipBuffer);
      const env = JSON.parse(files['env.json']);
      expect(env.values.STRAPI_ADMIN_LOCALAZY_ENV).toEqual({ present: true, value: 'jest-env-test' });
      expect(env.values).not.toHaveProperty('JWT_SECRET');
      expect(JSON.stringify(env)).not.toContain('must-not-leak-jwt');
    } finally {
      delete process.env.STRAPI_ADMIN_LOCALAZY_ENV;
      delete process.env.JWT_SECRET;
    }
  });

  it('writes captured:false to browser.json when nothing is supplied', async () => {
    const strapi = buildFakeStrapi();
    const { zipBuffer } = await buildDebugBundle({ strapi, sessionId: '_Abc123Def456Gh78' });
    const files = await readZipEntries(zipBuffer);
    expect(JSON.parse(files['browser.json'])).toEqual({ captured: false });
  });

  it('decodes base64-encoded browser payload', async () => {
    const strapi = buildFakeStrapi();
    const payload = { userAgent: 'JestUA/1.0', language: 'en', viewport: { width: 1280, height: 800 } };
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64');
    const { zipBuffer } = await buildDebugBundle({
      strapi,
      sessionId: '_Abc123Def456Gh78',
      browserPayloadEncoded: encoded,
    });
    const files = await readZipEntries(zipBuffer);
    expect(JSON.parse(files['browser.json'])).toEqual(payload);
  });

  it('drops oversize browser payload and records a browser-payload-truncated marker', async () => {
    const strapi = buildFakeStrapi();
    const oversize = 'x'.repeat(CAPS.browserPayloadBytes + 1);
    const encoded = Buffer.from(oversize).toString('base64');
    const { zipBuffer } = await buildDebugBundle({
      strapi,
      sessionId: '_Abc123Def456Gh78',
      browserPayloadEncoded: encoded,
    });
    const files = await readZipEntries(zipBuffer);
    expect(JSON.parse(files['browser.json'])).toEqual({ captured: false });
    const marker = JSON.parse(files['bundle-truncated.json']);
    const browserMarker = marker.markers.find((m: any) => m.kind === 'browser-payload-truncated');
    expect(browserMarker).toBeDefined();
    expect(browserMarker.originalSizeBytes).toBe(oversize.length);
  });

  it('caps total entries at 100, with failed tuples prioritised', async () => {
    const attemptedEntries: ActivityLogSession['attemptedEntries'] = [];
    // 200 success records.
    for (let i = 0; i < 200; i++) {
      attemptedEntries!.push({
        uid: 'api::a.a',
        documentId: `passed-${i}`,
        locale: 'fr',
        status: 'success',
        attemptedAt: Date.UTC(2026, 0, 1, 12, 0, i),
      });
    }
    // 30 failed records (failed-first plus 70 success fills the 100 cap).
    for (let i = 0; i < 30; i++) {
      attemptedEntries!.push({
        uid: 'api::a.a',
        documentId: `failed-${i}`,
        locale: 'fr',
        status: 'failed',
        errorMessage: 'boom',
        attemptedAt: Date.UTC(2026, 0, 1, 12, 1, i),
      });
    }
    const session: ActivityLogSession = {
      id: '_Abc123Def456Gh78',
      eventType: 'download',
      status: 'failed',
      startedAt: Date.UTC(2026, 0, 1, 12, 0, 0),
      initiatedBy: 'tester',
      summary: 'lots of failures',
      entries: [],
      attemptedEntries,
    };
    const strapi = buildFakeStrapi({
      session,
      contentTypes: { 'api::a.a': { kind: 'collectionType', attributes: {} } },
    });
    const { zipBuffer } = await buildDebugBundle({ strapi, sessionId: '_Abc123Def456Gh78' });
    const files = await readZipEntries(zipBuffer);
    const entryFiles = Object.keys(files).filter((n) => n.startsWith('entries/'));
    expect(entryFiles).toHaveLength(CAPS.totalEntries);
    // All 30 failed must appear; locales come from the record (not a default).
    for (let i = 0; i < 30; i++) {
      expect(entryFiles).toContain(`entries/api--a-a/failed-${i}--fr.json`);
    }
    // bundle-truncated.json should list only success tuples (failed ones must never be skipped)
    const marker = JSON.parse(files['bundle-truncated.json']);
    const skipped = marker.markers.find((m: any) => m.kind === 'entries-skipped');
    expect(skipped).toBeDefined();
    expect(skipped.tuples.every((t: any) => t.documentId.startsWith('passed-'))).toBe(true);
    expect(skipped.tuples).toHaveLength(130);
  });

  it('materializes a pure-success upload-style session', async () => {
    const attemptedEntries: ActivityLogSession['attemptedEntries'] = [];
    for (let i = 0; i < 50; i++) {
      attemptedEntries!.push({
        uid: 'api::a.a',
        documentId: `doc-${i}`,
        locale: 'en',
        status: 'success',
        attemptedAt: Date.UTC(2026, 0, 1, 12, 0, i),
      });
    }
    const session: ActivityLogSession = {
      id: '_Abc123Def456Gh78',
      eventType: 'upload',
      status: 'completed',
      startedAt: Date.UTC(2026, 0, 1, 12, 0, 0),
      initiatedBy: 'tester',
      summary: 'upload ok',
      entries: [],
      attemptedEntries,
    };
    const strapi = buildFakeStrapi({
      session,
      contentTypes: { 'api::a.a': { kind: 'collectionType', attributes: {} } },
    });
    const { zipBuffer } = await buildDebugBundle({ strapi, sessionId: '_Abc123Def456Gh78' });
    const files = await readZipEntries(zipBuffer);
    const entryFiles = Object.keys(files).filter((n) => n.startsWith('entries/'));
    expect(entryFiles).toHaveLength(50);
    expect(entryFiles).toContain('entries/api--a-a/doc-0--en.json');
    expect(entryFiles).toContain('entries/api--a-a/doc-49--en.json');
  });

  it('handles legacy sessions (attemptedEntries undefined) with a marker and no entries', async () => {
    const session: ActivityLogSession = {
      id: '_Abc123Def456Gh78',
      eventType: 'download',
      status: 'completed',
      startedAt: Date.UTC(2026, 0, 1, 12, 0, 0),
      initiatedBy: 'tester',
      summary: 'legacy',
      entries: [],
      // attemptedEntries intentionally undefined
    };
    const strapi = buildFakeStrapi({ session });
    const { zipBuffer } = await buildDebugBundle({ strapi, sessionId: '_Abc123Def456Gh78' });
    const files = await readZipEntries(zipBuffer);
    const entryFiles = Object.keys(files).filter((n) => n.startsWith('entries/'));
    expect(entryFiles).toHaveLength(0);
    const marker = JSON.parse(files['bundle-truncated.json']);
    expect(marker.markers.some((m: any) => m.kind === 'attempted-entries-missing-legacy-session')).toBe(true);
  });

  it('writes __not_found placeholder when findOne returns null for an attempted tuple', async () => {
    const session: ActivityLogSession = {
      id: '_Abc123Def456Gh78',
      eventType: 'download',
      status: 'failed',
      startedAt: Date.UTC(2026, 0, 1, 12, 0, 0),
      initiatedBy: 'tester',
      summary: 'deleted between attempt and bundle',
      entries: [],
      attemptedEntries: [
        {
          uid: 'api::article.article',
          documentId: 'ghost',
          locale: 'fr',
          status: 'failed',
          errorMessage: 'gone',
          attemptedAt: Date.UTC(2026, 0, 1, 12, 1, 0),
        },
      ],
    };
    const strapi = buildFakeStrapi({
      session,
      documents: (_uid: string) => ({
        findOne: async () => null,
      }),
    });
    const { zipBuffer } = await buildDebugBundle({ strapi, sessionId: '_Abc123Def456Gh78' });
    const files = await readZipEntries(zipBuffer);
    const body = JSON.parse(files['entries/api--article-article/ghost--fr.json']);
    expect(body).toEqual({ __not_found: true, attemptedAt: Date.UTC(2026, 0, 1, 12, 1, 0) });
  });

  it('dedupes (uid, documentId, locale) and keeps failed status on retry success', async () => {
    const session: ActivityLogSession = {
      id: '_Abc123Def456Gh78',
      eventType: 'download',
      status: 'completed',
      startedAt: Date.UTC(2026, 0, 1, 12, 0, 0),
      initiatedBy: 'tester',
      summary: '',
      entries: [],
      attemptedEntries: [
        {
          uid: 'api::a.a',
          documentId: 'd1',
          locale: 'fr',
          status: 'failed',
          errorMessage: 'boom',
          attemptedAt: 1,
        },
        { uid: 'api::a.a', documentId: 'd1', locale: 'fr', status: 'success', attemptedAt: 2 },
        { uid: 'api::a.a', documentId: 'd2', locale: 'fr', status: 'success', attemptedAt: 3 },
      ],
    };
    const strapi = buildFakeStrapi({
      session,
      contentTypes: { 'api::a.a': { kind: 'collectionType', attributes: {} } },
    });
    const { zipBuffer } = await buildDebugBundle({ strapi, sessionId: '_Abc123Def456Gh78' });
    const files = await readZipEntries(zipBuffer);
    const entryFiles = Object.keys(files)
      .filter((n) => n.startsWith('entries/'))
      .sort();
    expect(entryFiles).toEqual(['entries/api--a-a/d1--fr.json', 'entries/api--a-a/d2--fr.json']);
  });

  it('emits an entry-too-large truncation marker when a document exceeds the per-entry cap', async () => {
    const big = 'x'.repeat(CAPS.perEntryBytes + 10);
    const strapi = buildFakeStrapi({
      documents: (_uid: string) => ({
        findOne: async ({ documentId, locale }: { documentId: string; locale: string }) => ({
          documentId,
          locale,
          big,
        }),
      }),
    });
    const { zipBuffer } = await buildDebugBundle({ strapi, sessionId: '_Abc123Def456Gh78' });
    const files = await readZipEntries(zipBuffer);
    const entryBody = JSON.parse(files['entries/api--article-article/doc-1--fr.json']);
    expect(entryBody).toHaveProperty('__truncated', true);
    expect(entryBody.originalSizeBytes).toBeGreaterThan(CAPS.perEntryBytes);

    const marker = JSON.parse(files['bundle-truncated.json']);
    expect(marker.markers.some((m: any) => m.kind === 'entry-too-large')).toBe(true);
  });

  it('truncates error.log when it exceeds the 2 MB cap', async () => {
    const entries = [];
    const longMessage = 'log-msg-' + 'a'.repeat(2048);
    // ~2000 entries × ~2k bytes ≈ 4 MB, comfortably over the cap.
    for (let i = 0; i < 2000; i++) {
      entries.push({ message: `${longMessage} ${i}`, timestamp: Date.UTC(2026, 0, 1, 0, 0, i % 60) });
    }
    const session: ActivityLogSession = {
      id: '_Abc123Def456Gh78',
      eventType: 'webhook',
      status: 'completed',
      startedAt: Date.UTC(2026, 0, 1),
      initiatedBy: 'tester',
      summary: '',
      entries,
    };
    const strapi = buildFakeStrapi({ session });
    const { zipBuffer } = await buildDebugBundle({ strapi, sessionId: '_Abc123Def456Gh78' });
    const files = await readZipEntries(zipBuffer);
    expect(Buffer.byteLength(files['error.log'], 'utf8')).toBeLessThanOrEqual(CAPS.errorLogBytes + 200);
    const marker = JSON.parse(files['bundle-truncated.json']);
    expect(marker.markers.some((m: any) => m.kind === 'error-log-truncated')).toBe(true);
  });

  it('marks host-packages.json skipped when host package.json cannot be read', async () => {
    const strapi = buildFakeStrapi();
    const { zipBuffer } = await buildDebugBundle({ strapi, sessionId: '_Abc123Def456Gh78' });
    const files = await readZipEntries(zipBuffer);
    expect(files['host-packages.json']).toBeUndefined();
    const marker = JSON.parse(files['bundle-truncated.json']);
    expect(marker.hostPackagesSkipped).toBeTruthy();
  });

  it('throws when the session does not exist', async () => {
    const strapi = buildFakeStrapi();
    await expect(buildDebugBundle({ strapi, sessionId: 'no-such-session' })).rejects.toThrow(SessionNotFoundError);
  });
});
