const set = require("lodash/set");
const get = require("lodash/get");

const resetArrayKeysDeep = (object, keysToFilter) => {
  // sort keys from deep to shallow (so we won't rewrite indices)
  const sortedKeysToFilter = keysToFilter.sort((a, b) => {
    const aLvl = a.match(/\./g)?.length || 0;
    const bLvl = b.match(/\./g)?.length || 0;

    return bLvl - aLvl;
  })
  for (const key of sortedKeysToFilter) {
    const part = get(object, key);
    const filteredPart = part.filter((item) => item !== undefined);
    set(object, key, filteredPart);
  }
};

module.exports = resetArrayKeysDeep;
