"use strict";

const myController = require("./my-controller");
const localazyUserController = require("./localazy-user-controller");
const localazyAuthController = require("./localazy-auth-controller");
const strapiController = require("./strapi-controller");
const pluginSettingsController = require("./plugin-settings-controller");
const localazyTransferController = require("./localazy-transfer-controller");
const localazyTransferControllerV2 = require("./localazy-transfer-controller-v2");
const localazyProjectController = require("./localazy-project-controller");

module.exports = {
  myController,
  localazyUserController,
  localazyAuthController,
  strapiController,
  pluginSettingsController,
  localazyTransferController,
  localazyTransferControllerV2,
  localazyProjectController,
};
