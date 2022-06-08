"use strict";

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
      ["string", "text", "richtext"].includes(attributes[attribute].type)
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
