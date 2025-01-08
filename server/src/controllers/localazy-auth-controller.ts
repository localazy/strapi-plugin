import type { Core } from '@strapi/strapi';
import LocalazyGenericConnectorClientFactory  from "../utils/localazy-generic-connector-client-factory";

const LocalazyAuthController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async generateKeys(ctx) {
    const GenericConnectorApi = await LocalazyGenericConnectorClientFactory();
    ctx.body = await GenericConnectorApi.public.keys();
  },

  async continuousPoll(ctx) {
    // init continuous poll
    const { readKey } = ctx.query;
    const GenericConnectorApi = await LocalazyGenericConnectorClientFactory();
    const pollResult = await GenericConnectorApi.oauth.continuousPoll({
      readKey,
    });
    const pollResultData = pollResult.data;

    ctx.body = pollResultData;
  },
});

export default LocalazyAuthController;
