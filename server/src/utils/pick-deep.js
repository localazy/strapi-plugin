"use strict";
const isObject = require("lodash/isObject");
const set = require("lodash/set");
const includes = require("lodash/includes");

const deepLodashPick = (obj, keys, newObj = {}, path = []) => {
  for (let k in obj) {
    const value = obj[k];

    if (isObject(value)) {
      path.push(k);
      deepLodashPick(value, keys, newObj, path);
      path.pop();
    } else if (includes(keys, k)) {
      set(newObj, [...path, k], value);
    }
  }

  return newObj;
}

module.exports = deepLodashPick;
