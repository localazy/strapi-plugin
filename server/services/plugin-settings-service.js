"use strict";

const {
  KEY,
  emptyContentTransferSetup,
} = require("../db/model/content-transfer-setup");
const getStrapiStore = require("../db/model/utils/get-strapi-store");

module.exports = ({ strapi }) => ({
  async getContentTransferSetup() {
    const pluginStore = getStrapiStore(strapi);
    const setup = await pluginStore.get({ key: KEY });

    return setup || emptyContentTransferSetup;
  },

  async updateContentTransferSetup(setup) {
    const newSetup = {
      has_setup: true,
      setup,
    };
    const pluginStore = getStrapiStore(strapi);
    await pluginStore.set({
      key: KEY,
      value: newSetup,
    });

    return newSetup;
  },
});
