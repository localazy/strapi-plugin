/* eslint-disable no-await-in-loop */

"use strict";

const localazyApiClientFactory = require("../utils/localazy-api-client-factory");

module.exports = ({ strapi }) => ({
  /**
   * Upload data to Localazy.
   * Use config to adjust the upload process.
   * Returns status and id of a last chunk
   */
  async upload(file, config = {}) {
    try {
      const LocalazyApi = await localazyApiClientFactory();
      const user = await strapi
        .plugin("localazy")
        .service("localazyUserService")
        .getUser();

      const result = await LocalazyApi.import.json({
        project: user.project.id,
        json: file,
        ...config,
      });

      return {
        success: true,
        result,
      };
    } catch (e) {
      strapi.log.error(e);
      return {
        success: false,
        message: e.message,
      };
    }
  },

  createImportFileRepresentation(
    sourceLang,
    strings
  ) {
    const file = {
      [sourceLang]: {
        ...strings,
      },
    };

    return file;
  },
});
