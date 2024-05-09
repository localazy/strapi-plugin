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

  const importFile = LocalazyUploadService.createImportFileRepresentation(
    eventEntryLocale,
    pickedFlatten
  );

  const uploadConfig = {
    contentOptions: {
      type: config.LOCALAZY_DEFAULT_FILE_EXTENSION,
    },
    fileOptions: {
      name: config.LOCALAZY_DEFAULT_FILE_NAME,
      path: config.LOCALAZY_DEFAULT_FILE_PATH,
    }
  };
  const result = await LocalazyUploadService.upload(importFile, uploadConfig);
  return result;
}
