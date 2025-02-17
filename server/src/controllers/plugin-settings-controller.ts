import { Core } from '@strapi/strapi';
import { getPluginSettingsService } from '../core';

const PluginSettingsController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getContentTransferSetup(ctx) {
    ctx.body = await getPluginSettingsService().getContentTransferSetup();
  },

  async updateContentTransferSetup(ctx) {
    ctx.body = await getPluginSettingsService().updateContentTransferSetup(ctx.request.body);
  },

  async getPluginSettings(ctx) {
    ctx.body = await getPluginSettingsService().getPluginSettings();
  },

  async updatePluginSettings(ctx) {
    ctx.body = await getPluginSettingsService().updatePluginSettings(ctx.request.body);
  },
});

export default PluginSettingsController;
