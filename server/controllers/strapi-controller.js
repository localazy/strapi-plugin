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
};
