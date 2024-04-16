/* eslint-disable no-await-in-loop */

"use strict";

const localazyApiClientFactory = require("../utils/localazy-api-client-factory");
const delay = require("../utils/delay");
const config = require("../config").default;

module.exports = ({ strapi }) => ({
  /**
   * Upload data to Localazy.
   * Use config to adjust the upload process.
   * Returns status and id of a last chunk
   */
  async upload(files, config = {}) {
    let ret = {
      success: false,
      message: "No data was uploaded",
    };
    try {
      for (const file of files) {
        const LocalazyApi = await localazyApiClientFactory();
        const user = await strapi
          .plugin("localazy")
          .service("localazyUserService")
          .getUser();

        const result = await LocalazyApi.import({
          projectId: user.project.id,
          files: file,
          ...config,
        });
        await delay();
        ret = {
          success: true,
          result: result.result,
        };
      }
      return ret;
    } catch (e) {
      strapi.log.error(e);
      return {
        success: false,
        message: e.message,
      };
    }
  },

  /**
   * Check Directus for the Lifted Limits OAuth Apps IDs
   */
  CHUNK_LIMIT: config.LOCALAZY_PUBLIC_API_LIFTED_LIMITS ? 99900 : 9990,

  splitToChunks(data, CHUNK_LIMIT = null) {
    const chunks = [];
    const keys = Object.keys(data);
    const keysCount = keys.length;
    const localChunkLimit = CHUNK_LIMIT || this.CHUNK_LIMIT;
    const chunksCount = Math.ceil(keysCount / localChunkLimit);
    for (let i = 0; i < chunksCount; i += 1) {
      const chunkStrings = {};
      const from = localChunkLimit * i;
      const to = localChunkLimit * (i + 1);

      const currentKeys = keys.slice(from, to);
      currentKeys.forEach((key) => {
        chunkStrings[key] = data[key];
      });
      chunks.push(chunkStrings);
    }

    return chunks;
  },

  createImportFileRepresentation(
    filename,
    path,
    type,
    sourceLang,
    stringsChunks
  ) {
    const files = [];

    for (const strings of stringsChunks) {
      const file = [
        {
          name: filename,
          path,
          content: {
            type,
            [sourceLang]: {
              ...strings,
            },
          },
        },
      ];
      files.push(file);
    }

    return files;
  },
});
