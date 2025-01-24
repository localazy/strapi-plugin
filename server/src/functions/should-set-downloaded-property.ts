import { get } from 'lodash-es';

// TODO: ADD TYPES

export const getDynamicZoneKeySegment = (parsedKey) => {
  return parsedKey.find((segment) => segment.includes(';'));
};

export const getComponentNameFromDynamicZoneKeySegment = (dynamicZoneKeySegment) => {
  return dynamicZoneKeySegment.split(';')[1];
};

export const getDynamicZoneKeySegmentIndex = (parsedKey) => {
  return parsedKey.findIndex((segment) => segment.includes(';'));
};

export const getDynamicZonePropertyName = (parsedKey) => {
  const dynamicZoneKeySegmentIndex = getDynamicZoneKeySegmentIndex(parsedKey);

  if (dynamicZoneKeySegmentIndex === -1) {
    return undefined;
  }

  return parsedKey[dynamicZoneKeySegmentIndex - 1];
};

/**
 *
 * @param {*} modelContentTransferSetup
 * @param {*} parsedKeyRest
 * @returns "yes" | "no" | "json"
 */
export const shouldSetDownloadedProperty = (modelContentTransferSetup, parsedKeyRest) => {
  if (!modelContentTransferSetup.__model__) {
    return false;
  }

  const dynamicZoneKeySegment = getDynamicZoneKeySegment(parsedKeyRest);
  if (!!dynamicZoneKeySegment) {
    const dynamicZonePropertyName = getDynamicZonePropertyName(parsedKeyRest);
    const componentName = getComponentNameFromDynamicZoneKeySegment(dynamicZoneKeySegment);

    const dzContentTransferSetupModel = get(modelContentTransferSetup, dynamicZonePropertyName);
    const dzContentTransferSetupComponentModel = dzContentTransferSetupModel.find(
      (c) => c.__component__ === componentName
    );

    if (!dzContentTransferSetupComponentModel) {
      return false;
    }

    const dynamicZoneKeySegmentIndex = getDynamicZoneKeySegmentIndex(parsedKeyRest);
    const slicedParsedKeyRest = parsedKeyRest.slice(dynamicZoneKeySegmentIndex + 1);
    const filteredSlicedParsedKeyRest = slicedParsedKeyRest.filter((segment) => isNaN(parseInt(segment)));

    if (get(dzContentTransferSetupComponentModel, filteredSlicedParsedKeyRest) === true) {
      return 'yes';
    }

    // json fields
    while (filteredSlicedParsedKeyRest.length > 0) {
      // last segment out
      filteredSlicedParsedKeyRest.pop();
      if (get(dzContentTransferSetupComponentModel, filteredSlicedParsedKeyRest) === true) {
        return 'json';
      }
    }

    return 'no';
  } else {
    const filteredParsedKeyRest = parsedKeyRest.filter((partialKey) => isNaN(parseInt(partialKey)));

    if (get(modelContentTransferSetup, filteredParsedKeyRest) === true) {
      return 'yes';
    }

    // json fields
    while (filteredParsedKeyRest.length > 0) {
      // last segment out
      filteredParsedKeyRest.pop();
      if (get(modelContentTransferSetup, filteredParsedKeyRest) === true) {
        return 'json';
      }
    }

    return 'no';
  }
};
