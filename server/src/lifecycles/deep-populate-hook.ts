import { getFullPopulateLocalazyUploadObject } from '../utils/get-full-populate-localazy-upload-object';
import {
  getFullPopulateObject,
  DEFAULT_POPULATE_DEPTH,
  DEFAULT_MAX_POPULATE_DEPTH,
  FullPopulateObject,
} from '../utils/get-full-populate-object';
import type { UID } from '@strapi/strapi';

export type ChosenPopulateParam = 'localazyPLevel' | 'pLevel';

export type DeepPopulateHookEvent = {
  model: {
    uid: UID.ContentType;
  };
  params: {
    localazyPLevel?: number;
    pLevel?: number;
    populate?: FullPopulateObject;
  };
};

const deepPopulateHook = (event: DeepPopulateHookEvent) => {
  const localazyPLevel = event.params?.localazyPLevel;
  const chosen: ChosenPopulateParam = localazyPLevel ? 'localazyPLevel' : 'pLevel';
  const eventDepth = event.params[chosen];

  // skip deep populate if `eventDepth` is undefined
  if (typeof eventDepth === 'undefined') {
    return;
  }

  const populateDefaultDepth = (strapi.plugin('strapi-plugin-v5')?.config('populateDefaultDepth') ??
    DEFAULT_POPULATE_DEPTH) as number;
  // adjust invalid (0) is not a valid depth
  let depth = Math.max(eventDepth, populateDefaultDepth, 1);
  const maxDepth = (strapi.plugin('strapi-plugin-v5')?.config('populateMaxDepth') ??
    DEFAULT_MAX_POPULATE_DEPTH) as number;
  if (depth > maxDepth) {
    depth = maxDepth;
  }

  let modelObject: FullPopulateObject;
  switch (chosen) {
    case 'localazyPLevel': {
      modelObject = getFullPopulateLocalazyUploadObject(event.model.uid, depth);
      break;
    }
    case 'pLevel': {
      modelObject = getFullPopulateObject(event.model.uid, depth);
      break;
    }
  }
  if (typeof modelObject !== 'boolean' && modelObject !== undefined) {
    event.params.populate = modelObject.populate;
  }
};

export default deepPopulateHook;
