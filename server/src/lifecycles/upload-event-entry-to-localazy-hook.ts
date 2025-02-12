import getPickedFlattenKeysForHookEntry from '../utils/get-picked-flatten-keys-for-hook-entry';
import config from '../config';
import { getLocalazyUploadService } from '../core';

export default async (event: any) => {
  const pickedFlattedResult = await getPickedFlattenKeysForHookEntry(event);
  if (typeof pickedFlattedResult === 'undefined') {
    return;
  }
  const { pickedFlatten, eventEntryLocale } = pickedFlattedResult;

  const LocalazyUploadService = getLocalazyUploadService();
  const importFile = LocalazyUploadService.createImportFileRepresentation(eventEntryLocale, pickedFlatten);

  const uploadConfig = {
    contentOptions: {
      type: config.default.LOCALAZY_DEFAULT_FILE_EXTENSION,
    },
    fileOptions: {
      name: config.default.LOCALAZY_DEFAULT_FILE_NAME,
      path: config.default.LOCALAZY_DEFAULT_FILE_PATH,
    },
  };
  const result = await LocalazyUploadService.upload(importFile, uploadConfig);
  return result;
};
