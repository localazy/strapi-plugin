import {
  getFullPopulateObject,
  DEFAULT_POPULATE_DEPTH,
  DEFAULT_MAX_POPULATE_DEPTH,
  FullPopulateObject,
} from '../utils/get-full-populate-object';
import { getFullPopulateLocalazyUploadObject } from '../utils/get-full-populate-localazy-upload-object';
import { getFullPopulateLocalazyDownloadObject } from '../utils/get-full-populate-localazy-download-object';
import { PLUGIN_NAME } from '../config/core/config';
import type { UID } from '@strapi/strapi';

export enum ChosenPopulateParam {
  LOC_UPLOAD_PLEVEL = 'locUploadPLevel',
  LOC_DOWNLOAD_PLEVEL = 'locDownloadPLevel',
  PLEVEL = 'pLevel',
}

export type DeepPopulateHookEvent = {
  model: {
    uid: UID.ContentType;
  };
  params: {
    locUploadPLevel?: number;
    locDownloadPLevel?: number;
    pLevel?: number;
    populate?: FullPopulateObject;
  };
};

const deepPopulateHook = (event: DeepPopulateHookEvent) => {
  const locUploadPLevel = event.params?.locUploadPLevel;
  const locDownloadPLevel = event.params?.locDownloadPLevel;
  let chosen: ChosenPopulateParam = ChosenPopulateParam.PLEVEL;

  /**
   * These cannot be used at the same time
   */
  if (locUploadPLevel) {
    chosen = ChosenPopulateParam.LOC_UPLOAD_PLEVEL;
  } else if (locDownloadPLevel) {
    chosen = ChosenPopulateParam.LOC_DOWNLOAD_PLEVEL;
  }
  const eventDepth = event.params[chosen];

  // skip deep populate if `eventDepth` is undefined
  if (typeof eventDepth === 'undefined') {
    return;
  }

  const populateDefaultDepth = (strapi.plugin(PLUGIN_NAME)?.config('populateDefaultDepth') ??
    DEFAULT_POPULATE_DEPTH) as number;
  // adjust invalid (0) is not a valid depth
  let depth = Math.max(eventDepth, populateDefaultDepth, 1);
  const maxDepth = (strapi.plugin(PLUGIN_NAME)?.config('populateMaxDepth') ?? DEFAULT_MAX_POPULATE_DEPTH) as number;
  if (depth > maxDepth) {
    depth = maxDepth;
  }

  let modelObject: FullPopulateObject;
  switch (chosen) {
    case ChosenPopulateParam.LOC_UPLOAD_PLEVEL: {
      modelObject = getFullPopulateLocalazyUploadObject(event.model.uid, depth);
      break;
    }
    case ChosenPopulateParam.PLEVEL: {
      modelObject = getFullPopulateObject(event.model.uid, depth);
      break;
    }
    case ChosenPopulateParam.LOC_DOWNLOAD_PLEVEL: {
      modelObject = getFullPopulateLocalazyDownloadObject(event.model.uid, depth);
      break;
    }
  }
  if (typeof modelObject !== 'boolean' && modelObject !== undefined) {
    event.params.populate = modelObject.populate;
  }
};

export default deepPopulateHook;
