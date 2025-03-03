"use strict";

module.exports = {
  async getContentTransferSetup(ctx) {
    ctx.body = await strapi
      .plugin("localazy")
      .service("pluginSettingsService")
      .getContentTransferSetup();
  },

  async updateContentTransferSetup(ctx) {
    ctx.body = await strapi
      .plugin("localazy")
      .service("pluginSettingsService")
      .updateContentTransferSetup(ctx.request.body);
  },

  async getPluginSettings(ctx) {
    ctx.body = await strapi
      .plugin("localazy")
      .service("pluginSettingsService")
      .getPluginSettings();
  },

  async updatePluginSettings(ctx) {
    ctx.body = await strapi
      .plugin("localazy")
      .service("pluginSettingsService")
      .updatePluginSettings(ctx.request.body);
  }
};
