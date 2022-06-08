"use strict";

const getLocalazyApi = require("../utils/get-localazy-api");
const delay = require("../utils/delay");

const fetchChunkResult = async (projectId, fileId, lang, next) => {
  try {
    const LocalazyApi = await getLocalazyApi();
    const chunkResult = await LocalazyApi.listKeysInFileForLanguage({
      projectId,
      fileId,
      lang,
      next,
    });

    return chunkResult;
  } catch (e) {
    strapi.log.error(e);
    return {
      keys: [],
    };
  }
};

module.exports = ({ strapi }) => ({
  async download(config = {}) {
    try {
      const data = [];
      let chunkResult;
      do {
        const next = (chunkResult && chunkResult.next) || "";
        chunkResult = await fetchChunkResult(
          config.projectId,
          config.fileId,
          config.lang,
          next
        );
        await delay();
        data.push(chunkResult);
      } while (chunkResult.next);

      return {
        success: true,
        data: data.map((chunk) => chunk.keys).flat(),
      };
    } catch (e) {
      strapi.log.error(e);
      return {
        success: false,
        message: e.message,
      };
    }
  },
});
