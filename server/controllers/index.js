"use strict";

const localazyUserController = require("./localazy-user-controller");
const localazyAuthController = require("./localazy-auth-controller");
const strapiController = require("./strapi-controller");
const pluginSettingsController = require("./plugin-settings-controller");
const localazyTransferController = require("./localazy-transfer-controller");
const localazyProjectController = require("./localazy-project-controller");

module.exports = {
  localazyUserController,
  localazyAuthController,
  strapiController,
  pluginSettingsController,
  localazyTransferController,
  localazyProjectController,
};
