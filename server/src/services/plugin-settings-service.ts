import { Core } from '@strapi/strapi';

import { KEY as CONTENT_TRANSFER_SETUP_KEY, emptyContentTransferSetup } from '../db/model/content-transfer-setup';
import { KEY as PLUGIN_SETTINGS_KEY, PluginSettings, emptyPluginSettings } from '../db/model/plugin-settings';
import getStrapiStore from '../db/model/utils/get-strapi-store';

const PluginSettingsService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getContentTransferSetup() {
    const pluginStore = getStrapiStore(strapi);
    const setup = await pluginStore.get({ key: CONTENT_TRANSFER_SETUP_KEY });

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
});

export default PluginSettingsService;
