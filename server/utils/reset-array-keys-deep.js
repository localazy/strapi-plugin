const set = require("lodash/set");
const get = require("lodash/get");

const resetArrayKeysDeep = (object, keysToFilter) => {
  for (key of keysToFilter) {
    const part = get(object, key);
    const filteredPart = part.filter((item) => item !== undefined);
    set(object, key, filteredPart);
  }
};

module.exports = resetArrayKeysDeep;
