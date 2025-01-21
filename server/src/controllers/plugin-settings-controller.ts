import { Core } from '@strapi/strapi';

const PluginSettingsController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getContentTransferSetup(ctx) {
    ctx.body = await strapi.plugin('strapi-plugin-v5').service('PluginSettingsService').getContentTransferSetup();
  },

  async updateContentTransferSetup(ctx) {
    ctx.body = await strapi
      .plugin('strapi-plugin-v5')
      .service('PluginSettingsService')
      .updateContentTransferSetup(ctx.request.body);
  },

  async getPluginSettings(ctx) {
    ctx.body = await strapi.plugin('strapi-plugin-v5').service('PluginSettingsService').getPluginSettings();
  },

  async updatePluginSettings(ctx) {
    ctx.body = await strapi
      .plugin('strapi-plugin-v5')
      .service('PluginSettingsService')
      .updatePluginSettings(ctx.request.body);
  },
});

export default PluginSettingsController;
