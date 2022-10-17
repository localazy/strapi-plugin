"use strict";

const set = require("lodash/set");

const getPopulateObject = (keys) => {
  const populate = {};
  for (const key of keys) {
    set(populate, key, "*");
  }

  return populate;
};

const buildPopulate = (models, modelUid) => {
  const buildPopulateStep = (models, modelUid, prefix = "") => {
    const model = models.find((model) => model.uid === modelUid);

    if (!model || !model.attributes) {
      return getPopulateObject(keys);
    }

    for (const [attributeName, attribute] of Object.entries(model.attributes)) {
      if (attribute.type === "component") {
        const key = prefix
          ? `${prefix}.${attributeName}.populate`
          : `${attributeName}.populate`;
        keys.push(key);
        const newPrefix = prefix
          ? `${prefix}.${attributeName}`
          : `${attributeName}`;
        const innerModelUid = attribute.component;
        buildPopulateStep(models, innerModelUid, newPrefix);
      } else if (attribute.type === "dynamiczone") {
        // TODO: implement
        const key = prefix
          ? `${prefix}.${attributeName}.populate`
          : `${attributeName}.populate`;
        keys.push(key);
        // const newPrefix = prefix
        //   ? `${prefix}.${attributeName}`
        //   : `${attributeName}`;
        // attribute.components.forEach((dzComponent, index) => {
        //   const innerModelUid = dzComponent;
        //   buildPopulateStep(models, innerModelUid, newPrefix);
        // });
      }
    }

    return getPopulateObject(keys);
  };
  const keys = ["populate"];

  return buildPopulateStep(models, modelUid);
};

module.exports = buildPopulate;
