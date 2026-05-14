import type { Core } from '@strapi/strapi';
import PluginSettingsService from '../../services/plugin-settings-service';
import { KEY as PLUGIN_SETTINGS_KEY } from '../../db/model/plugin-settings';

type StoredValue = Record<string, unknown> | null;

const buildFakeStrapi = (initial: StoredValue = null) => {
  let state: StoredValue = initial ? JSON.parse(JSON.stringify(initial)) : null;
  const store = {
    get: async ({ key }: { key: string }) => (key === PLUGIN_SETTINGS_KEY ? state : null),
    set: async ({ key, value }: { key: string; value: unknown }) => {
      if (key === PLUGIN_SETTINGS_KEY) {
        state = JSON.parse(JSON.stringify(value));
      }
    },
  };
  const strapi = {
    store: () => store,
    log: { warn: jest.fn(), info: jest.fn(), error: jest.fn() },
  } as unknown as Core.Strapi;
  return { strapi, getState: () => state };
};

describe('plugin-settings-service.updatePluginSettingsUiPrefs — read-gated allowlist', () => {
  it('keeps allowlisted fields (defaultRoute, activityLogsSort) and merges with existing settings', async () => {
    const { strapi, getState } = buildFakeStrapi({
      defaultRoute: '/upload',
      webhookConfig: { url: 'https://example/webhook' },
    });
    const service = PluginSettingsService({ strapi });

    await service.updatePluginSettingsUiPrefs({
      defaultRoute: '/download',
      activityLogsSort: { download: { key: 'startedAt', direction: 'desc' } },
    });

    expect(getState()).toEqual({
      // allowlisted writes applied
      defaultRoute: '/download',
      activityLogsSort: { download: { key: 'startedAt', direction: 'desc' } },
      // pre-existing destructive fields untouched (merge, not overwrite)
      webhookConfig: { url: 'https://example/webhook' },
    });
  });

  it('drops every field outside the allowlist (cannot reach destructive settings)', async () => {
    const { strapi, getState } = buildFakeStrapi({
      defaultRoute: '/upload',
      webhookConfig: { url: 'https://example/webhook' },
    });
    const service = PluginSettingsService({ strapi });

    // Crafted payload mixing one allowlisted field with destructive ones a
    // `read`-only caller must not be able to write through this route.
    await service.updatePluginSettingsUiPrefs({
      defaultRoute: '/download',
      // The cast mirrors the kind of payload a hand-crafted request would send;
      // the service must drop these even though TS would normally reject them.
      ...({
        webhookConfig: { url: 'https://attacker/webhook' },
        download: { uiLanguages: ['xx'], webhookLanguages: ['xx'] },
        upload: { allowAutomated: true },
      } as object),
    } as Parameters<typeof service.updatePluginSettingsUiPrefs>[0]);

    expect(getState()).toEqual({
      defaultRoute: '/download',
      webhookConfig: { url: 'https://example/webhook' },
    });
  });

  it('ignores non-object input rather than wiping settings', async () => {
    const seed = { defaultRoute: '/upload' };
    const { strapi, getState } = buildFakeStrapi(seed);
    const service = PluginSettingsService({ strapi });

    for (const bogus of [null, undefined, 'string', 42, true]) {
      // Hand-crafted payloads can arrive as primitives; the service must
      // treat them as an empty allowlisted patch and leave state untouched.
      await service.updatePluginSettingsUiPrefs(bogus as never);
      expect(getState()).toEqual(seed);
    }
  });
});
