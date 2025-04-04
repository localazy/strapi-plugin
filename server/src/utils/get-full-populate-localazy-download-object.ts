/**
 * It is taken from the plugin
 * https://github.com/Barelydead/strapi-plugin-populate-deep
 * based on the issue
 * https://github.com/strapi/strapi/issues/11836
 *
 * Edit: for Strapi v5, it is taken from the plugin
 * https://github.com/NEDDL/strapi-v5-plugin-populate-deep/blob/main/server/helpers/index.js
 *
 */

// TODO: ADD TYPES

import isEmpty from 'lodash-es/isEmpty';
import merge from 'lodash-es/merge';
const DEFAULT_MAX_POPULATE_DEPTH = 10;
const DEFAULT_POPULATE_DEPTH = 5;

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

const getFullPopulateLocalazyDownloadObject = (
  modelUid: string,
  maxDepth: number = DEFAULT_POPULATE_DEPTH,
  ignore: string[] = ['localizations', 'createdAt', 'updatedAt', 'publishedAt']
): FullPopulateObject => {
  let localDepth = maxDepth;

  if (localDepth <= 1) {
    return true;
  }
  if (modelUid === 'admin::user') {
    return true;
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
        populate[key] = getFullPopulateLocalazyDownloadObject(value.component, maxDepth - 1);
      } else if (value.type === 'dynamiczone') {
        const dynamicPopulate = value.components.reduce((prev: any, cur: any) => {
          const curPopulate = getFullPopulateLocalazyDownloadObject(cur, maxDepth - 1);
          return merge(prev, { [cur]: curPopulate });
        }, {});
        populate[key] = isEmpty(dynamicPopulate) ? true : { on: dynamicPopulate };
      } else if (value.type === 'relation') {
        // do not fill relation with more than 1 level for download purposes
        const relationPopulate = getFullPopulateLocalazyDownloadObject(value.target, 1, ignore);
        if (relationPopulate) {
          populate[key] = relationPopulate;
        }
      } else if (value.type === 'media') {
        populate[key] = true;
      }
    }
  }
  return isEmpty(populate) ? true : { populate };
};

export { getFullPopulateLocalazyDownloadObject, DEFAULT_POPULATE_DEPTH, DEFAULT_MAX_POPULATE_DEPTH };
