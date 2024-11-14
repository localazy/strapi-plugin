"use strict";

const isDynamicZoneKey = (key) => {
  const matches = key.match(/\[\d+;[\w-]+\./g);
  return matches !== null;
};

const pickEntries = (flatten, pickPaths) => {
  // * Dynamic zones properties must! always be in 1st level (not in component; Strapi restrictions)
  const pickedEntries = {};
  const mappedPickPaths = pickPaths.map((pickPath) =>
    pickPath.replace(/\[\d+\]/g, "")
  );

  // filter out "__component"
  const filteredFlatten = Object.fromEntries(
    Object.entries(flatten).filter(([key]) => !key.includes("__component"))
  );
  Object.keys(filteredFlatten).forEach((key) => {
    let filteredKey = key;
    filteredKey = filteredKey.replace(/\[\d+\]/g, "");
    if (isDynamicZoneKey(key)) {
      filteredKey = filteredKey.replace(/\[\d+;[\w-]+\./g, `[`);
    }
    // if (mappedPickPaths.includes(filteredKey)) {
      if (
        mappedPickPaths.includes(filteredKey) ||
        // include JSON fields
        mappedPickPaths.some((pickPath) => filteredKey.startsWith(`${pickPath}.`))
      ) {
      pickedEntries[key] = flatten[key];
    }
  });
  return pickedEntries;
};

module.exports = pickEntries;
