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

  return cloneDeepWith(collection, omitFn);
}

module.exports = omitDeep;
