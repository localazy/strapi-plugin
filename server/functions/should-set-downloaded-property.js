const get = require("lodash/get");

const getDynamicZoneKeySegment = (parsedKey) => {
  return parsedKey.find((segment) => segment.includes(";"));
};

const isDynamicZone = (parsedKey) => {
  return !!getDynamicZoneKeySegment(parsedKey);
};

const getComponentNameFromDynamicZoneKeySegment = (dynamicZoneKeySegment) => {
  return dynamicZoneKeySegment.split(";")[1];
};

const getDynamicZoneKeySegmentIndex = (parsedKey) => {
  return parsedKey.findIndex((segment) => segment.includes(";"));
}

const getDynamicZonePropertyName = (parsedKey) => {
  const dynamicZoneKeySegmentIndex = getDynamicZoneKeySegmentIndex(parsedKey);

  if (dynamicZoneKeySegmentIndex === -1) {
    return undefined;
  }

  return parsedKey[dynamicZoneKeySegmentIndex - 1];
};

const shouldSetDownloadedProperty = (
  modelContentTransferSetup,
  parsedKeyRest,
) => {
  if (!modelContentTransferSetup.__model__) {
    return false;
  }

  const dynamicZoneKeySegment = getDynamicZoneKeySegment(parsedKeyRest);
  if (!!dynamicZoneKeySegment) {
    const dynamicZonePropertyName = getDynamicZonePropertyName(parsedKeyRest);
    const componentName = getComponentNameFromDynamicZoneKeySegment(dynamicZoneKeySegment);

    const dzContentTransferSetupModel = get(modelContentTransferSetup, dynamicZonePropertyName);
    const dzContentTransferSetupComponentModel = dzContentTransferSetupModel.find((c) => c.__component__ === componentName);

    if (!dzContentTransferSetupComponentModel) {
      return false;
    }

    const dynamicZoneKeySegmentIndex = getDynamicZoneKeySegmentIndex(parsedKeyRest);
    const slicedParsedKeyRest = parsedKeyRest.slice(dynamicZoneKeySegmentIndex + 1);
    const filteredSlicedParsedKeyRest = slicedParsedKeyRest.filter((segment) => isNaN(parseInt(segment)));

    return !!get(dzContentTransferSetupComponentModel, filteredSlicedParsedKeyRest);
  } else {
    const filteredParsedKeyRest = parsedKeyRest
      .filter((partialKey) => isNaN(parseInt(partialKey)));
    return !!get(modelContentTransferSetup, filteredParsedKeyRest);
  }
};

module.exports = shouldSetDownloadedProperty;
