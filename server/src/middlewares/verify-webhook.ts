import crypto from 'crypto';
import type { Core } from '@strapi/strapi';
import PluginSettingsServiceHelper from '../services/helpers/plugin-settings-service-helper';
import { getLocalazyUserService, getLocalazyPubAPIService } from '../core';

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    try {
      const pluginSettingsServiceHelper = new PluginSettingsServiceHelper();
      await pluginSettingsServiceHelper.setup();

      if (!pluginSettingsServiceHelper.shouldAllowWebhookDownloadProcess()) {
        throw new Error('Localazy Plugin: Webhook download process is disabled; terminating execution');
      }

      const requestBody = ctx.request.body;
      strapi.log.info(`Localazy Plugin: Webhook of type '${requestBody.type}' procedure started`);

      const LocalazyPubApiService = getLocalazyPubAPIService();
      const LocalazyUserService = getLocalazyUserService();
      const user = await LocalazyUserService.getUser();

      const secret = await LocalazyPubApiService.getWebhooksSecret(user.project.id);

      const xLocalazyHmac = ctx.request.header['x-localazy-hmac'];
      const xLocalazyTimestamp = ctx.request.header['x-localazy-timestamp'];

      // if older than 15 mins - do not process
      const THRESHOLD = 900000; // 15 mins = 900000ms

      const intXLocalazyTimestamp = parseInt(xLocalazyTimestamp);
      if (Number.isNaN(intXLocalazyTimestamp)) {
        throw new Error('Localazy Plugin: Webhook request invalid timestamp provided; terminating execution');
      }

      if (intXLocalazyTimestamp * 1000 + THRESHOLD < Date.now()) {
        throw new Error('Localazy Plugin: Webhook request is older than threshold; terminating execution');
      }

      const strapiHmac = crypto.createHmac('sha256', secret);
      const signedMessage = strapiHmac.update(`${xLocalazyTimestamp}-${JSON.stringify(requestBody)}`).digest('hex');

      if (xLocalazyHmac !== signedMessage) {
        throw new Error('Localazy Plugin: Webhook verification did not pass; terminating execution');
      } else {
        strapi.log.info('Localazy Plugin: Webhook verification passed');
      }

      /**
       * When further actions are called by a webhook, then there's no user assigned to the operation
       * It's needed to assign the user ID to the operation (requested e.g. for adding a new locale)
       */
      if (!ctx.state.user) {
        const webhookAuthorId = pluginSettingsServiceHelper.getWebhookAuthorId();
        if (Number.isNaN(webhookAuthorId)) {
          throw new Error('Localazy Plugin: Webhook author is not set; terminating execution');
        }
        ctx.state.user = {
          id: webhookAuthorId,
        };
      }

      await next(); // proceed with the request; await for the response

      strapi.log.info(`Localazy Plugin: Webhook of type '${requestBody.type}' procedure finished`);
    } catch (e) {
      strapi.log.warn(e.message);
      ctx.body = {
        success: false,
        message: e.message,
      };
    }
  };
};
