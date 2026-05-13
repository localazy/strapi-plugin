import JSZip from 'jszip';
import { buildDebugBundle, CAPS, DEBUG_BUNDLE_SCHEMA_VERSION } from '../build-debug-bundle';
import type { ActivityLogSession } from '../../db/model/activity-logs';

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
  };
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

  it('caps total entries at 100, with failed tuples prioritised', async () => {
    const entries = [];
    // 80 passed
    for (let i = 0; i < 80; i++) {
      entries.push({
        message: `Created entry for api::a.a [passed-${i}] in fr`,
        timestamp: Date.UTC(2026, 0, 1, 12, 0, i),
      });
    }
    // 50 failed (more than the slack room left under the 100 cap → some passed must be dropped)
    for (let i = 0; i < 50; i++) {
      entries.push({
        message: `Failed to update api::a.a [failed-${i}] in fr: boom`,
        timestamp: Date.UTC(2026, 0, 1, 12, 1, i),
      });
    }
    const session: ActivityLogSession = {
      id: '_Abc123Def456Gh78',
      eventType: 'download',
      status: 'failed',
      startedAt: Date.UTC(2026, 0, 1, 12, 0, 0),
      initiatedBy: 'tester',
      summary: 'lots of failures',
      entries,
    };
    const strapi = buildFakeStrapi({
      session,
      contentTypes: { 'api::a.a': { kind: 'collectionType', attributes: {} } },
    });
    const { zipBuffer } = await buildDebugBundle({ strapi, sessionId: '_Abc123Def456Gh78' });
    const files = await readZipEntries(zipBuffer);
    const entryFiles = Object.keys(files).filter((n) => n.startsWith('entries/'));
    expect(entryFiles).toHaveLength(CAPS.totalEntries);
    // All 50 failed must appear.
    for (let i = 0; i < 50; i++) {
      expect(entryFiles).toContain(`entries/api--a-a/failed-${i}--fr.json`);
    }
    // bundle-truncated.json should list only passed tuples (failed ones must never be skipped)
    const marker = JSON.parse(files['bundle-truncated.json']);
    const skipped = marker.markers.find((m: any) => m.kind === 'entries-skipped');
    expect(skipped).toBeDefined();
    expect(skipped.tuples.every((t: any) => t.documentId.startsWith('passed-'))).toBe(true);
    expect(skipped.tuples).toHaveLength(30);
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
    await expect(buildDebugBundle({ strapi, sessionId: 'no-such-session' })).rejects.toThrow(/not found/);
  });
});
