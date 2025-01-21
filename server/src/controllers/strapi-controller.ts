import type { Core } from '@strapi/strapi';

const StrapiController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getModels(ctx) {
    ctx.body = await strapi.plugin('strapi-plugin-v5').service('StrapiService').getModels();
  },
  async getLocalizableModels(ctx) {
    ctx.body = await strapi.plugin('strapi-plugin-v5').service('StrapiService').getLocalizableModels();
  },
  async postLifecycleLocalazyWebhooks(ctx) {
    strapi.log.info('done');
  },
  async getPluginVersion(ctx) {
    ctx.body = {
      version: await strapi.plugin('strapi-plugin-v5').service('StrapiService').getPluginVersion(),
    };
  },
});

export default StrapiController;
