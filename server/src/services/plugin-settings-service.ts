import { Core } from '@strapi/strapi';

import { KEY as CONTENT_TRANSFER_SETUP_KEY, emptyContentTransferSetup } from '../db/model/content-transfer-setup';
import { KEY as PLUGIN_SETTINGS_KEY, PluginSettings, emptyPluginSettings } from '../db/model/plugin-settings';
import { KEY as SYNC_CURSOR_KEY, SyncCursor, emptySyncCursor } from '../db/model/sync-cursor';
import getStrapiStore from '../db/model/utils/get-strapi-store';
import { ContentTransferSetup } from '../models/plugin/content-transfer-setup';

// Fields settable via the `read`-gated UI-prefs endpoint. Anything outside this
// allowlist must go through `updatePluginSettings` (gated by `settings.update`).
const UI_PREF_FIELDS = ['defaultRoute', 'activityLogsSort'] as const;
type UiPrefField = (typeof UI_PREF_FIELDS)[number];
export type PluginSettingsUiPrefs = Partial<Pick<PluginSettings, UiPrefField>>;
const PluginSettingsService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getContentTransferSetup(): Promise<ContentTransferSetup> {
    const pluginStore = getStrapiStore(strapi);
    const setup = (await pluginStore.get({ key: CONTENT_TRANSFER_SETUP_KEY })) as ContentTransferSetup;

    return setup || emptyContentTransferSetup;
  },

  async updateContentTransferSetup(setup) {
    const newSetup = {
      has_setup: true,
      setup,
    };
    const pluginStore = getStrapiStore(strapi);
    await pluginStore.set({
      key: CONTENT_TRANSFER_SETUP_KEY,
      value: newSetup,
    });

    return newSetup;
  },

  async getPluginSettings(): Promise<PluginSettings> {
    const pluginStore = getStrapiStore(strapi);
    const settings = (await pluginStore.get({ key: PLUGIN_SETTINGS_KEY })) as PluginSettings;

    return settings || emptyPluginSettings;
  },

  async updatePluginSettings(settings) {
    const currentSettings = await this.getPluginSettings();

    // keep the current settings if the new settings are not provided
    const newSettings = {
      ...currentSettings,
      ...settings,
    };
    const pluginStore = getStrapiStore(strapi);
    await pluginStore.set({
      key: PLUGIN_SETTINGS_KEY,
      value: newSettings,
    });

    return newSettings;
  },

  // Counterpart to `updatePluginSettings` for the `read`-gated UI-prefs route.
  // Drops any field outside `UI_PREF_FIELDS` server-side so a `read`-only caller
  // cannot reach `webhookConfig` / `download.*` / `upload.*` via the merge.
  async updatePluginSettingsUiPrefs(prefs: PluginSettingsUiPrefs): Promise<PluginSettings> {
    const sanitized: PluginSettingsUiPrefs = {};
    if (prefs && typeof prefs === 'object') {
      for (const field of UI_PREF_FIELDS) {
        if (field in prefs) {
          (sanitized as Record<string, unknown>)[field] = (prefs as Record<string, unknown>)[field];
        }
      }
    }

    return this.updatePluginSettings(sanitized);
  },

  async getSyncCursor(): Promise<SyncCursor> {
    const pluginStore = getStrapiStore(strapi);
    const cursor = (await pluginStore.get({ key: SYNC_CURSOR_KEY })) as SyncCursor;

    return cursor || emptySyncCursor;
  },

  async updateSyncCursor(cursor: SyncCursor): Promise<SyncCursor> {
    const pluginStore = getStrapiStore(strapi);
    await pluginStore.set({
      key: SYNC_CURSOR_KEY,
      value: cursor,
    });

    return cursor;
  },
});

export type PluginSettingsServiceReturnType = ReturnType<typeof PluginSettingsService>;

export default PluginSettingsService;
