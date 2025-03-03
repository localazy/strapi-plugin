"use strict";

const GenericConnectorClient = require("@localazy/generic-connector-client").GenericConnectorClient;
const config = require("../config");

const ROOT_URL = config.default.LOCALAZY_PLUGIN_CONNECTOR_API_URL;
const PLUGIN_ID = config.default.LOCALAZY_PLUGIN_ID;

module.exports = async () => {
  const api = new GenericConnectorClient({
    pluginId: PLUGIN_ID,
    genericConnectorUrl: ROOT_URL,
  });
  return api;
};
