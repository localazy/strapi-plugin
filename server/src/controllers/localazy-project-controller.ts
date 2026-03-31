import { Core } from '@strapi/strapi';
import { getLocalazyUserService, getLocalazyPubAPIService, getPluginSettingsService } from '../core';

const STRAPI_WEBHOOK_CUSTOM_ID = 'strapi-plugin-localazy';

const LocalazyProjectController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getConnectedProject(ctx) {
    const LocalazyUserService = getLocalazyUserService();
    const LocalazyPubAPIService = getLocalazyPubAPIService();

    const user = await LocalazyUserService.getUser();
    const project = await LocalazyPubAPIService.getProject(user.project.id, true, true);

    ctx.body = project;
  },
  async getWebhookStatus(ctx) {
    const LocalazyUserService = getLocalazyUserService();
    const user = await LocalazyUserService.getUser();
    const LocalazyPubApiService = getLocalazyPubAPIService();

    const webhooks = await LocalazyPubApiService.listWebhooks(user.project.id);

    // Find our webhook by customId
    const ours = webhooks.find((w: any) => w.customId === STRAPI_WEBHOOK_CUSTOM_ID);

    if (ours) {
      ctx.body = { status: 'configured', url: ours.url, enabled: ours.enabled };
      return;
    }

    ctx.body = { status: 'not_configured' };
  },
  async setupWebhook(ctx) {
    const { url } = ctx.request.body;
    const LocalazyUserService = getLocalazyUserService();
    const user = await LocalazyUserService.getUser();
    const LocalazyPubApiService = getLocalazyPubAPIService();
    const PluginSettingsService = getPluginSettingsService();

    // Get existing webhooks
    const existing = await LocalazyPubApiService.listWebhooks(user.project.id);

    // Remove our old webhook if it exists (by customId)
    const filtered = existing.filter((w: any) => w.customId !== STRAPI_WEBHOOK_CUSTOM_ID);

    // Add new webhook with our customId
    const items = [
      ...filtered,
      {
        enabled: true,
        customId: STRAPI_WEBHOOK_CUSTOM_ID,
        url,
        events: ['project_published'],
        description: 'Strapi Plugin - Download translations',
      },
    ];

    await LocalazyPubApiService.updateWebhooks(user.project.id, items);

    // Save webhook URL to plugin settings for display
    await PluginSettingsService.updatePluginSettings({
      webhookConfig: { url },
    });

    ctx.body = { success: true };
  },
  async getStrapiUrl(ctx) {
    let url = strapi.config.get('server.url') as string;
    if (!url) {
      const host = strapi.config.get('server.host') || '0.0.0.0';
      const port = strapi.config.get('server.port') || 1337;
      const displayHost = host === '0.0.0.0' || host === '::' ? 'localhost' : host;
      url = `http://${displayHost}:${port}`;
    }
    ctx.body = { url };
  },
});

export default LocalazyProjectController;
