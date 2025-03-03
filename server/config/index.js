"use strict";

// depending on the STRAPI_ADMIN_LOCALAZY_ENV, use the correct config
let config = require("./production/index");

if (process.env.STRAPI_ADMIN_LOCALAZY_ENV === "local") {
  config = require("./local/index");
}

if (process.env.STRAPI_ADMIN_LOCALAZY_ENV === "development") {
  config = require("./development/index");
}

module.exports = {
  default: {
    // Default plugin configuration, merged with the user configuration
    ...(config || {}),
  },
  validator() { },
};
