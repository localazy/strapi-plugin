"use strict";

module.exports = {
  async getModels(ctx) {
    ctx.body = await strapi
      .plugin("localazy")
      .service("strapiService")
      .getModels();
  },
  async getLocalizableModels(ctx) {
    ctx.body = await strapi
      .plugin("localazy")
      .service("strapiService")
      .getLocalizableModels();
  },
  async postLifecycleLocalazyWebhooks(ctx) {
    strapi.log("done");
  },
  async getPluginVersion(ctx) {
    ctx.body = {
      version: await strapi
        .plugin("localazy")
        .service("strapiService")
        .getPluginVersion()
    }
  }
};
