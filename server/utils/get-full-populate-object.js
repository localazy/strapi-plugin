// is taken from
// https://github.com/Barelydead/strapi-plugin-populate-deep
// based on the issue
// https://github.com/strapi/strapi/issues/11836

const isEmpty = require("lodash/isEmpty");
const merge = require("lodash/merge");
const DEFAULT_MAX_POPULATE_DEPTH = 10;
const DEFAULT_POPULATE_DEPTH = 5;

const getModelPopulationAttributes = (model) => {
  if (model.uid === "plugin::upload.file") {
    const { related, ...attributes } = model.attributes;
    return attributes;
  }

  return model.attributes;
};

const getFullPopulateObject = (modelUid, depth = DEFAULT_POPULATE_DEPTH) => {
  let localDepth = depth;
  if (localDepth <= 1) {
    return true;
  }
  if (modelUid === "admin::user") {
    return undefined;
  }
  const populateMaxDepth = strapi.plugin("localazy")?.config("populateMaxDepth") ?? DEFAULT_MAX_POPULATE_DEPTH;
  if (Number.isInteger(populateMaxDepth) && localDepth > populateMaxDepth) {
    localDepth = populateMaxDepth;
  }

  const populate = {};
  const model = strapi.getModel(modelUid);
  for (const [key, value] of Object.entries(
    getModelPopulationAttributes(model)
  )) {
    if (value) {
      if (value.type === "component") {
        populate[key] = getFullPopulateObject(value.component, localDepth - 1);
      } else if (value.type === "dynamiczone") {
        const dynamicPopulate = value.components.reduce((prev, cur) => {
          const curPopulate = getFullPopulateObject(cur, localDepth - 1);
          return curPopulate === true ? prev : merge(prev, curPopulate);
        }, {});
        populate[key] = isEmpty(dynamicPopulate) ? true : dynamicPopulate;
      } else if (value.type === "relation") {
        const relationPopulate = getFullPopulateObject(
          value.target,
          localDepth - 1
        );
        if (relationPopulate) {
          populate[key] = relationPopulate;
        }
      } else if (value.type === "media") {
        populate[key] = true;
      }
    }
  }
  return isEmpty(populate) ? true : { populate };
};

module.exports = {
  getFullPopulateObject,
  DEFAULT_POPULATE_DEPTH
};
