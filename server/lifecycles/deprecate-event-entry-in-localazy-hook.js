"use strict";

const getPickedFlattenKeysForHookEntry = require('../utils/get-picked-flatten-keys-for-hook-entry');
const config = require("../config").default;
const localazyApiClientFactory = require("../utils/localazy-api-client-factory");
const delay = require("../utils/delay");

module.exports = async (event) => {
  const pickedFlattedResult = await getPickedFlattenKeysForHookEntry(event);

  if (typeof pickedFlattedResult === "undefined") {
    return;
  }

  const { pickedFlatten, eventEntryLocale } = pickedFlattedResult;

  const LocalazyUserService = strapi
    .plugin("localazy")
    .service("localazyUserService");
  const LocalazyPubApiService = strapi
    .plugin("localazy")
    .service("localazyPubApiService");

  const user = await LocalazyUserService.getUser();

  /**
   * Get Strapi File
   */
  const strapiFile = await LocalazyPubApiService.getStrapiFile(
    user.project.id
  );
  if (!strapiFile) {
    strapi.log.error(`File ${config.LOCALAZY_DEFAULT_FILE_NAME} not found`);
    return;
  }

  const LocalazyApi = await localazyApiClientFactory();
  const projectKeys = await LocalazyApi.files.listKeys({
    project: user.project.id,
    file: strapiFile.id,
    lang: eventEntryLocale,
  });

  if(!projectKeys) {
    strapi.log.error(`Keys not found for file ${strapiFile.id}`);
    return {
      success: false,
    };
  }

  const pickedFlattenKeys = Object.keys(pickedFlatten);
  const filteredProjectKeysIds = projectKeys
    .filter((key) => pickedFlattenKeys.includes(key.key[0]))
    .map((key) => key.id);

  // call in a loop in a sequence, to avoid hitting PubAPI limits
  for (const filteredProjectKeysId of filteredProjectKeysIds) {
    try {
      await LocalazyApi.keys.update({
        project: user.project.id,
        key: filteredProjectKeysId,
        deprecated: 0,
      });
      await delay();
    } catch (e) {
      strapi.log.error(e.message);
    }
  }

  return {
    success: true,
  };
}
