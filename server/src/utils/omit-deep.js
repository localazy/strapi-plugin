"use strict";

const cloneDeepWith = require("lodash/cloneDeepWith");

function omitDeep(collection, excludeKeys) {
  function omitFn(value) {
    if (value && typeof value === "object") {
      excludeKeys.forEach((key) => {
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

module.exports = omitDeep;
