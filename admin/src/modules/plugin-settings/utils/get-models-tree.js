/**
 * Supported kinds of models are expected by the function, needs to be checked before calling the function
 */
const getModelsTree = (allModels, localizableModels = []) => {
  const modelsTree = [];

  const getModelTree = (
    attributes,
    isComponentAttributes = false,
    isComponentAttributesObjectTranslatable = null
  ) => {
    const currentModelTree = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const attribute in attributes) {
      if (attributes[attribute].type === "component") {
        const nestedModel = allModels.find(
          (model) => model.uid === attributes[attribute].component
        );

        currentModelTree[attribute] = {
          ...getModelTree(
            nestedModel.__schema__.attributes,
            true,
            isComponentAttributesObjectTranslatable === null
              ? attributes[attribute].pluginOptions?.i18n?.localized || false
              : isComponentAttributesObjectTranslatable
          ),
        };
      } else if (
        ["string", "text", "richtext"].includes(attributes[attribute].type)
      ) {
        // field might not be localizable
        if (isComponentAttributes) {
          if (isComponentAttributesObjectTranslatable) {
            currentModelTree[attribute] = false;
          } else {
            currentModelTree[attribute] = null;
          }
        } else if (
          !isComponentAttributes &&
          (!attributes[attribute].pluginOptions ||
            !attributes[attribute].pluginOptions.i18n ||
            !attributes[attribute].pluginOptions.i18n.localized)
        ) {
          currentModelTree[attribute] = null;
        } else {
          currentModelTree[attribute] = false;
        }
      } else {
        currentModelTree[attribute] = null;
      }
    }

    return currentModelTree;
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const model of localizableModels) {
    if (model.__schema__.collectionName) {
      const modelTree = {
        [model.__schema__.collectionName]: {
          __model__: true,
          ...getModelTree(model.__schema__.attributes),
        },
      };
      modelsTree.push(modelTree);
    }
  }

  return modelsTree;
};

export default getModelsTree;
