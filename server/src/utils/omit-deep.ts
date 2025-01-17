import cloneDeepWith from "lodash/cloneDeepWith";

const omitDeep = (collection: any, excludeKeys: any) => {
  function omitFn(value: any) {
    if (value && typeof value === "object") {
      excludeKeys.forEach((key: any) => {
        delete value[key];
      });
    }
  }

  if (Array.isArray(collection)) {
    const clonedData = [];
    for (const collectionItem of collection) {
      clonedData.push(cloneDeepWith(collectionItem, omitFn));
    }
    return clonedData;
  }
  return cloneDeepWith(collection, omitFn);
}

export { omitDeep };
