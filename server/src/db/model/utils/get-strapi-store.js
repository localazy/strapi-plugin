"use strict";

const pluginId = "localazy";
module.exports = (strapi) =>
  strapi.store({
    environment: process.env.STRAPI_ADMIN_LOCALAZY_ENV,
    type: "plugin",
    name: pluginId,
  });
