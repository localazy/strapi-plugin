"use strict";

const getPickedFlattenKeysForHookEntry = require('../utils/get-picked-flatten-keys-for-hook-entry');
const config = require("../config").default;
const getLocalazyApi = require("../utils/get-localazy-api");
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
  const LocalazyDownloadService = strapi
    .plugin("localazy")
    .service("localazyDownloadService");

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

  const projectKeys = await LocalazyDownloadService.download({
    projectId: user.project.id,
    fileId: strapiFile.id,
    lang: eventEntryLocale,
  });

  const pickedFlattenKeys = Object.keys(pickedFlatten);
  const filteredProjectKeysIds = projectKeys.data
    .filter((key) => pickedFlattenKeys.includes(key.key[0]))
    .map((key) => key.id);

  const LocalazyApi = await getLocalazyApi();
  // call in a loop in a sequence, to avoid hitting PubAPI limits
  for (const filteredProjectKeysId of filteredProjectKeysIds) {
    try {
      await LocalazyApi.updateKey({
        projectId: user.project.id,
        keyId: filteredProjectKeysId,
        // deprecated: 0,
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
