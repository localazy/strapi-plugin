"use strict";

const axios = require("axios");
const config = require("../config");

const ROOT_URL = config.default.LOCALAZY_PLUGIN_CONNECTOR_API_URL;
const PLUGIN_ID = config.default.LOCALAZY_PLUGIN_ID;

module.exports = (/* { strapi } */) => ({
  async generateKeys() {
    try {
      const result = await axios.get(`${ROOT_URL}/public/keys`, {
        headers: {
          "X-Localazy-Plugin-Id": PLUGIN_ID,
        },
      });
      return result.data;
    } catch (e) {
      throw e.data;
    }
  },

  async completeLogin(readKey) {
    try {
      const result = await axios.get(
        `${ROOT_URL}/oauth/poll?readKey=${readKey}`,
        {
          headers: {
            "X-Localazy-Plugin-Id": PLUGIN_ID,
          },
        }
      );
      return result.data;
    } catch (e) {
      throw e.data;
    }
  },
});
