/* eslint-disable no-await-in-loop */

"use strict";

const getLocalazyApi = require("../utils/get-localazy-api");
const delay = require("../utils/delay");

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
        const LocalazyApi = await getLocalazyApi();
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

  splitToChunks(data, CHUNK_LIMIT = 1000) {
    const chunks = [];
    const keys = Object.keys(data);
    const keysCount = keys.length;
    const chunksCount = Math.ceil(keysCount / CHUNK_LIMIT);
    for (let i = 0; i < chunksCount; i += 1) {
      const chunkStrings = {};
      const from = CHUNK_LIMIT * i;
      const to = CHUNK_LIMIT * (i + 1);

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
