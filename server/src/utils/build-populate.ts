// TODO: ADD TYPES

import set from "lodash-es/set";

const getPopulateObject = (keys: string[]) => {
  const populate = {};
  for (const key of keys) {
    set(populate, key, "*");
  }

  return populate;
};

const buildPopulate = (models: any, modelUid: string) => {
  const buildPopulateStep = (models: any, modelUid: string, prefix = "") => {
    const model = models.find((model: any) => model.uid === modelUid);

    if (!model || !model.attributes) {
      return getPopulateObject(keys);
    }

    for (const [attributeName, attribute] of Object.entries(model.attributes)) {
      // @ts-ignore
      if (attribute.type === "component") {
        const key = prefix
          ? `${prefix}.${attributeName}.populate`
          : `${attributeName}.populate`;
        keys.push(key);
        const newPrefix = prefix
          ? `${prefix}.${attributeName}`
          : `${attributeName}`;
        // @ts-ignore
        const innerModelUid = attribute.component;
        buildPopulateStep(models, innerModelUid, newPrefix);
      // @ts-ignore
      } else if (attribute.type === "dynamiczone") {
        const key = prefix
          ? `${prefix}.${attributeName}.populate`
          : `${attributeName}.populate`;
        keys.push(key);
      }
    }

    return getPopulateObject(keys);
  };
  const keys = ["populate"];

  return buildPopulateStep(models, modelUid);
};

export default buildPopulate;
