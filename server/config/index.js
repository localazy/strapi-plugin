"use strict";

// depending on the STRAPI_ADMIN_LOCALAZY_ENV, use the correct config
const config =
  process.env.STRAPI_ADMIN_LOCALAZY_ENV === "development"
    ? require("./development/index")
    : require("./production/index");

module.exports = {
  default: {
    // Default plugin configuration, merged with the user configuration
    ...(config || {}),
  },
  validator() {},
};
