"use strict";

const localazyGenericConnectorClientFactory = require("../utils/localazy-generic-connector-client-factory");

module.exports = {
  async generateKeys(ctx) {
    const GenericConnectorApi = await localazyGenericConnectorClientFactory();
    ctx.body = await GenericConnectorApi.public.keys();
  },

  async continuousPoll(ctx) {
    // init continuous poll
    const { readKey } = ctx.query;
    const GenericConnectorApi = await localazyGenericConnectorClientFactory();
    const pollResult = await GenericConnectorApi.oauth.continuousPoll({
      readKey,
    });
    const pollResultData = pollResult.data;

    ctx.body = pollResultData;
  },
};
