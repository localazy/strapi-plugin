/**
 * See get-full-populate-object.ts for more details
 */

// TODO: ADD TYPES

import isEmpty from 'lodash-es/isEmpty';
import merge from 'lodash-es/merge';
import { DEFAULT_POPULATE_DEPTH } from './get-full-populate-object';
import type { UID } from '@strapi/strapi';
const getModelPopulationAttributes = (model: any) => {
  if (model.uid === 'plugin::upload.file') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { related, ...attributes } = model.attributes;
    return attributes;
  }

  return model.attributes;
};

export type FullPopulateObject =
  | {
      populate: any;
    }
  | boolean
  | undefined;

const getFullPopulateLocalazyUploadObject = (
  modelUid: UID.ContentType,
  maxDepth: number = DEFAULT_POPULATE_DEPTH,
  ignore: string[] = ['locale', 'localizations', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'publishedAt']
): FullPopulateObject => {
  let localDepth = maxDepth;

  if (localDepth <= 1) {
    return true;
  }

  // we don't need creator fields, media and files
  if (['admin::user', 'plugin::upload.file'].includes(modelUid)) {
    return undefined;
  }

  const populate = {};
  const model = strapi.getModel(modelUid as any);
  if (model === undefined) {
    return undefined;
  }
  if (ignore && !ignore.includes(model.collectionName)) ignore.push(model.collectionName);
  for (const [key, value] of Object.entries<any>(getModelPopulationAttributes(model))) {
    if (ignore?.includes(key)) continue;
    if (value) {
      if (value.type === 'component') {
        populate[key] = getFullPopulateLocalazyUploadObject(value.component, maxDepth - 1);
      } else if (value.type === 'dynamiczone') {
        const dynamicPopulate = value.components.reduce((prev: any, cur: any) => {
          const curPopulate = getFullPopulateLocalazyUploadObject(cur, maxDepth - 1);
          return merge(prev, { [cur]: curPopulate });
        }, {});
        populate[key] = isEmpty(dynamicPopulate) ? true : { on: dynamicPopulate };
      }
      // skip relation and media - not needed for upload
    }
  }
  return isEmpty(populate) ? true : { populate };
};

export { getFullPopulateLocalazyUploadObject };
