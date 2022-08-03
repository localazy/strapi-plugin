"use strict";

const contentTransferSetupModel = require("../db/model/content-transfer-setup");

const pluginSettingsModel = require("../db/model/plugin-settings");
// {
//   KEY,
//   emptyPluginSettings,
// } = require("../db/model/plugin-settings");
const getStrapiStore = require("../db/model/utils/get-strapi-store");

module.exports = ({ strapi }) => ({
  async getContentTransferSetup() {
    const pluginStore = getStrapiStore(strapi);
    const setup = await pluginStore.get({ key: contentTransferSetupModel.KEY });

    return setup || contentTransferSetupModel.emptyContentTransferSetup;
  },

  async updateContentTransferSetup(setup) {
    const newSetup = {
      has_setup: true,
      setup,
    };
    const pluginStore = getStrapiStore(strapi);
    await pluginStore.set({
      key: contentTransferSetupModel.KEY,
      value: newSetup,
    });

    return newSetup;
  },

  async getPluginSettings() {
    const pluginStore = getStrapiStore(strapi);
    const settings = await pluginStore.get({ key: pluginSettingsModel.KEY });

    return settings || pluginSettingsModel.emptyPluginSettings;
  },

  async updatePluginSettings(settings) {
    const newSettings = settings;
    const pluginStore = getStrapiStore(strapi);
    await pluginStore.set({
      key: pluginSettingsModel.KEY,
      value: newSettings,
    });

    return newSettings;
  },
});
