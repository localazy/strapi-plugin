"use strict";

const SUPPORTED_CONTENT_TYPE_FIELDS = require("../models/supported-content-type-fields");
const SUPPORTED_CUSTOM_FIELD_PLUGINS = require("../models/supported-custom-field-plugins");

const getModelTree = (attributes, models) => {
  const currentModelTree = {};
  for (const attribute in attributes) {
    if (attributes[attribute].type === "component") {
      const nestedModel = models.find(
        (model) => model.uid === attributes[attribute].component
      );

      currentModelTree[attribute] = {
        ...getModelTree(nestedModel.__schema__.attributes, models),
      };
    } else if (
      SUPPORTED_CONTENT_TYPE_FIELDS.includes(attributes[attribute].type)
      || (attributes[attribute].type === "customField" && SUPPORTED_CUSTOM_FIELD_PLUGINS.includes(attributes[attribute].customField))
    ) {
      currentModelTree[attribute] = false;
    } else {
      currentModelTree[attribute] = null;
    }
  }

  return currentModelTree;
};

/**
 * Kinds of models ["collectionType", "singleType"] are expected by the function.
 */
const getModelsTree = (models) => {
  const modelsTree = [];
  for (const model of models) {
    const modelTree = {
      [model.__schema__.collectionName]: {
        __model__: true,
        ...getModelTree(model.__schema__.attributes, models),
      },
    };
    modelsTree.push(modelTree);
  }
  return modelsTree;
};

module.exports = getModelsTree;
