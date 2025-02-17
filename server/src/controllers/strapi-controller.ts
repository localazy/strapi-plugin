import type { Core } from '@strapi/strapi';
import { getStrapiService } from '../core';

const StrapiController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getModels(ctx) {
    ctx.body = await getStrapiService().getModels();
  },
  async getLocalizableModels(ctx) {
    ctx.body = await getStrapiService().getLocalizableModels();
  },
  async postLifecycleLocalazyWebhooks() {
    strapi.log.info('done');
  },
  async getPluginVersion(ctx) {
    ctx.body = {
      version: await getStrapiService().getPluginVersion(),
    };
  },
});

export default StrapiController;
