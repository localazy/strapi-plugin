"use strict";

const map = require("lodash/map");
const pickDeep = require("./pick-deep");
const flattenObject = require("./flatten-object");

const isDynamicZoneKey = (key, transferSetupModel) => {
  const matches = key.match(/\[\d+\]+/g);

  if (matches.length < 2) {
    return false;
  }

  const dynamicPropertyEntryIdWithSquareBrackets = matches[1];
  const dynamicPropertyNamePart = key.split(".").find((s, index) => index > 1 && s.includes(dynamicPropertyEntryIdWithSquareBrackets));
  const dynamicPropertyName = dynamicPropertyNamePart.replace(dynamicPropertyEntryIdWithSquareBrackets, "");

  return Array.isArray(transferSetupModel[dynamicPropertyName]);
};

const getDynamicZoneEntryId = (key, transferSetupModel) => {
  if (!isDynamicZoneKey(key, transferSetupModel)) {
    return undefined;
  }

  const matches = key.match(/\[\d+\]+/g);
  // remove square brackets
  const id = matches[1].replace(/[\[\]']+/g, '');
  return id;
}

const doesPickPathsIncludeTheComponent = (pickPaths, dzParameterKey) => {
  return pickPaths.some((pp) => pp.includes(dzParameterKey));
}

const pickEntries = (flatten, pickPaths, transferSetupModel) => {
  // * dynamic zones properties must! always be in 1st level (not in component; Strapi restrictions)

  const dzEntryIdComponentMap = {};
  const flattenComponentProps = Object.fromEntries(Object.entries(flatten).filter(([key]) => key.includes('__component')));

  const pickedDeep = pickDeep(transferSetupModel, ["__component__"]);
  const flattenedPickedDeep = flattenObject(pickedDeep);
  map(flattenedPickedDeep, (v, i) => {
    const newI = i.replace(".__component__", "");
    flattenedPickedDeep[newI] = v;
    delete flattenedPickedDeep[i];
  });

  Object.keys(flattenComponentProps).map((key) => {
    if (!isDynamicZoneKey(key, transferSetupModel)) {
      return;
    }

    const entryId = getDynamicZoneEntryId(key, transferSetupModel);
    dzEntryIdComponentMap[entryId] = {
      component: flattenComponentProps[key],
      key: Object.keys(flattenedPickedDeep).find((fpdk) => flattenedPickedDeep[fpdk] === flattenComponentProps[key]),
    };
  });

  const pickedEntries = {};
  const mappedPickPaths = pickPaths.map((pickPath) => pickPath.replace(/\[\d+\]/g, ""));

  // filter out "__component"
  const filteredFlatten = Object.fromEntries(Object.entries(flatten).filter(([key]) => !key.includes('__component')));
  Object.keys(filteredFlatten).forEach((key) => {
    // decide whether it is a dynamic zone
    // handle dynamic zones, in case of similarly-named fields across more components
    const isDynamicZone = isDynamicZoneKey(key, transferSetupModel);
    if (isDynamicZone) {
      const dzEntryId = getDynamicZoneEntryId(key, transferSetupModel);
      const dzParameterKey = dzEntryIdComponentMap[dzEntryId].key;

      if (!doesPickPathsIncludeTheComponent(pickPaths, dzParameterKey)) {
        return;
      }
    }

    const filteredKey = key.replace(/\[\d+\]/g, "");
    if (mappedPickPaths.includes(filteredKey)) {
      if (isDynamicZone) {
        const dzEntryId = getDynamicZoneEntryId(key, transferSetupModel);
        const dzParameterKey = dzEntryIdComponentMap[dzEntryId].key;

        const dzParameterName = dzParameterKey.substring(0, dzParameterKey.indexOf('['));
        const toBeReplaced = `${dzParameterName}[${dzEntryId}]`;
        const dzParameterComponent = dzEntryIdComponentMap[dzEntryId].component;
        const componentAddition = `${dzParameterName}[${dzEntryId};${dzParameterComponent}]`;
        const replacedKey = key.replace(toBeReplaced, componentAddition);
        pickedEntries[replacedKey] = flatten[key];
      } else {
        pickedEntries[key] = flatten[key];
      }
    }
  });
  return pickedEntries;
};

module.exports = pickEntries;
