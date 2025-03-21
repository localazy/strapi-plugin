import getPickedFlattenKeysForHookEntry from '../utils/get-picked-flatten-keys-for-hook-entry';
import config from '../config';
import { getLocalazyUploadService } from '../core';
import type { HookParams } from '../models/plugin/hook-params';

export default async (params: HookParams) => {
  const pickedFlattedResult = await getPickedFlattenKeysForHookEntry(params);
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
