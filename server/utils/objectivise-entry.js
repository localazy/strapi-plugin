"use strict";

const set = require("lodash/set");

const arrayToObject = (array, keyField) =>
  array.reduce((obj, item) => {
    obj[item[keyField]] = item;
    return obj;
  }, {});

const objectiviseEntry = (entry) => {
  const objectivized = {};

  const objectiviseEntryStep = (entryStep, prefix = "") => {
    if (entryStep === null || typeof entryStep !== "object") {
      set(objectivized, prefix, entryStep);
    } else {
      if (Array.isArray(entryStep)) {
        const arrayedEntry = arrayToObject(entryStep, "id");
        Object.keys(arrayedEntry).forEach((key) => {
          objectiviseEntryStep(
            arrayedEntry[key],
            prefix ? `${prefix}.${key}` : key
          );
        });
      } else {
        Object.keys(entryStep).forEach((key) => {
          objectiviseEntryStep(
            entryStep[key],
            prefix ? `${prefix}.${key}` : key
          );
        });
      }
    }
  };
  objectiviseEntryStep(entry);

  return objectivized;
};

module.exports = objectiviseEntry;
