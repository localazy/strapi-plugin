"use strict";

const crypto = require("crypto");
const PluginSettingsServiceHelper = require('../services/helpers/plugin-settings-service-helper');

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      const pluginSettingsServiceHelper = new PluginSettingsServiceHelper(strapi);
      await pluginSettingsServiceHelper.setup();

      if (!pluginSettingsServiceHelper.shouldAllowWebhookDownloadProcess()) {
        throw new Error("Localazy Plugin: Webhook download process is disabled; terminating execution");
      }

      const requestBody = ctx.request.body;
      strapi.log.info(`Localazy Plugin: Webhook of type '${requestBody.type}' procedure started`);

      const LocalazyPubApiService = strapi
        .plugin("localazy")
        .service("localazyPubApiService");
      const LocalazyUserService = strapi
        .plugin("localazy")
        .service("localazyUserService");
      const user = await LocalazyUserService.getUser();

      const result = await LocalazyPubApiService.getWebhooksSecret(user.project.id);

      const { secret } = result;
      const xLocalazyHmac = ctx.request.header["x-localazy-hmac"];
      const xLocalazyTimestamp = ctx.request.header["x-localazy-timestamp"];

      // if older than 15 mins - do not process
      const THRESHOLD = 900000; // 15 mins = 900000ms

      const intXLocalazyTimestamp = parseInt(xLocalazyTimestamp);
      if (Number.isNaN(intXLocalazyTimestamp)) {
        throw new Error("Localazy Plugin: Webhook request invalid timestamp provided; terminating execution");
      }

      if ((intXLocalazyTimestamp * 1000 + THRESHOLD) < Date.now()) {
        throw new Error("Localazy Plugin: Webhook request is older than threshold; terminating execution");
      }

      const strapiHmac = crypto.createHmac("sha256", secret);
      const signedMessage = strapiHmac.update(`${xLocalazyTimestamp}-${JSON.stringify(requestBody)}`).digest("hex");

      if (xLocalazyHmac !== signedMessage) {
        throw new Error("Localazy Plugin: Webhook verification did not pass; terminating execution");
      }

      /**
       * When further actions are called by a webhook, then there's no user assigned to the operation
       * It's needed to assign the user ID to the operation (requested e.g. for adding a new locale)
       */
      if (!ctx.state.user) {
        const webhookAuthorId = pluginSettingsServiceHelper.getWebhookAuthorId();
        if (Number.isNaN(webhookAuthorId)) {
          throw new Error("Localazy Plugin: Webhook author is not set; terminating execution");
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
  }
}
