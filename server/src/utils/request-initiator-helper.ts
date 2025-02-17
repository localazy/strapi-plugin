import type { Core } from '@strapi/strapi';

class RequestInitiatorHelper {
  strapi: Core.Strapi;
  ctx: any;

  constructor(strapi: Core.Strapi) {
    this.strapi = strapi;
    this.ctx = strapi.requestContext.get();
  }

  isInitiatedByLocalazyWebhook() {
    if (typeof this.ctx !== 'undefined') {
      const ctxHeaders = this.ctx.headers;
      const xLocalazyHmac = ctxHeaders['x-localazy-hmac'];
      const xLocalazyTimestamp = ctxHeaders['x-localazy-timestamp'];
      if (!!xLocalazyHmac && !!xLocalazyTimestamp) {
        return true;
      }
    }
    return false;
  }

  isInitiatedByLocalazyPluginUI() {
    if (typeof this.ctx !== 'undefined') {
      const ctxHeaders = this.ctx.headers;
      const xLocalazyInitiatedBy = ctxHeaders['x-localazy-initiated-by'];
      if (!xLocalazyInitiatedBy) {
        return false;
      }
      return xLocalazyInitiatedBy === 'strapi-plugin-localazy';
    }
    return false;
  }
}

export default RequestInitiatorHelper;
