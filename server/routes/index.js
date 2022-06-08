"use strict";

const localazyUserRoutes = require("./localazy-user");
const localazyAuthRoutes = require("./localazy-auth");
const pluginSettingsRoutes = require("./plugin-settings");
const strapiRoutes = require("./strapi");
const localazyTransferRoutes = require("./localazy-transfer");
const localazyProjectRoutes = require("./localazy-project");

module.exports = {
  "content-api": {
    type: "content-api",
    routes: [...strapiRoutes],
  },
  admin: {
    type: "admin",
    routes: [
      ...localazyAuthRoutes,
      ...localazyUserRoutes,
      ...pluginSettingsRoutes,
      ...strapiRoutes,
      ...localazyTransferRoutes,
      ...localazyProjectRoutes,
    ],
  },
};
