"use strict";

const ROUTE_PREFIX = "/plugin-settings";

module.exports = [
  {
    method: "GET",
    path: `${ROUTE_PREFIX}/content-transfer-setup`,
    handler: "pluginSettingsController.getContentTransferSetup",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: `${ROUTE_PREFIX}/content-transfer-setup`,
    handler: "pluginSettingsController.updateContentTransferSetup",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: `${ROUTE_PREFIX}/plugin-settings`,
    handler: "pluginSettingsController.getPluginSettings",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: `${ROUTE_PREFIX}/plugin-settings`,
    handler: "pluginSettingsController.updatePluginSettings",
    config: {
      policies: [],
    },
  }
];
