"use strict";

const getPickedFlattenKeysForHookEntry = require('../utils/get-picked-flatten-keys-for-hook-entry');
const config = require("../config").default;

module.exports = async (event) => {
  const pickedFlattedResult = await getPickedFlattenKeysForHookEntry(event);

  if (typeof pickedFlattedResult === "undefined") {
    return;
  }

  const { pickedFlatten, eventEntryLocale } = pickedFlattedResult;

  // Localazy Upload Service
  const LocalazyUploadService = strapi
    .plugin("localazy")
    .service("localazyUploadService");

  const chunks = LocalazyUploadService.splitToChunks(pickedFlatten);
  const importFile = LocalazyUploadService.createImportFileRepresentation(
    config.LOCALAZY_DEFAULT_FILE_NAME,
    config.LOCALAZY_DEFAULT_FILE_PATH,
    config.LOCALAZY_DEFAULT_FILE_EXTENSION,
    eventEntryLocale,
    chunks
  );

  const result = await LocalazyUploadService.upload(importFile);
  return result;
}
