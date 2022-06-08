"use strict";

const pickEntries = (flatten, pickPaths) => {
  const pickedEntries = {};
  Object.keys(flatten).forEach((key) => {
    const filteredKey = key.replace(/\d|[[\]]+/g, "");
    if (pickPaths.includes(filteredKey)) {
      pickedEntries[key] = flatten[key];
    }
  });
  return pickedEntries;
};

module.exports = pickEntries;
