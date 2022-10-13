const get = require("lodash/get");

const shouldSetDownloadedProperty = (
  modelContentTransferSetup,
  parsedKeyRest,
) => {
  if (!modelContentTransferSetup.__model__) {
    return false;
  }

  const filteredParsedKeyRest = parsedKeyRest
    .filter((partialKey) => isNaN(parseInt(partialKey)));
  return !!get(modelContentTransferSetup, filteredParsedKeyRest);
};

module.exports = shouldSetDownloadedProperty;
