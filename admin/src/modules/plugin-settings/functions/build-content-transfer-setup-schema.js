import set from "lodash-es/set";
import get from "lodash-es/get";
import uniq from "lodash-es/uniq";
import deepKeys from "@david-vaclavek/deep-keys";
import sortByModelName from "../../@common/utils/sort-by-model-name";
import arrayOfModelsToObject from "../utils/array-of-models-to-object";
import findModelValueByKey from "../utils/find-model-value-by-key";

export default (
  localizableTree = [],
  storedSetupSchema = [],
  allModelsTree = []
) => {
  localizableTree = arrayOfModelsToObject(
    localizableTree.sort(sortByModelName)
  );
  storedSetupSchema = arrayOfModelsToObject(
    storedSetupSchema.sort(sortByModelName)
  );

  const unsortedCurrentModelsSchemaKeys = deepKeys(localizableTree);
  const unsortedStoredSetupSchemaKeys = deepKeys(storedSetupSchema);
  // const unsortedAllModelsSchemaKeys = deepKeys(allModelsTree);

  // components order may have changed; this would prevent properties from mixing up
  const regex = /\.\d+\.__component__/;
  let currentModelsSchemaComponentKeys = unsortedCurrentModelsSchemaKeys.filter((key) => key.match(regex)).map((key) => key.replace(regex, ''));
  let storedSetupSchemaComponentKeys = unsortedStoredSetupSchemaKeys.filter((key) => key.match(regex)).map((key) => key.replace(regex, ''));
  // let allModelsSchemaComponentKeys = unsortedAllModelsSchemaKeys.filter((key) => key.match(regex)).map((key) => key.replace(regex, ''));
  currentModelsSchemaComponentKeys = uniq(currentModelsSchemaComponentKeys);
  storedSetupSchemaComponentKeys = uniq(storedSetupSchemaComponentKeys);
  // allModelsSchemaComponentKeys = uniq(allModelsSchemaComponentKeys);

  const currentModelsSchemaKeys = deepKeys(localizableTree);
  const storedSetupSchemaKeys = deepKeys(storedSetupSchema);
  // const allModelsSchemaKeys = deepKeys(allModelsTree);

  // create a components indices map
  const currentModelsSchemaComponentKeysComponentProp = currentModelsSchemaKeys.filter((key) => key.includes('__component__') && currentModelsSchemaComponentKeys.some((k) => key.includes(k)));
  const storedSetupSchemaComponentKeysComponentProp = storedSetupSchemaKeys.filter((key) => key.includes('__component__') && storedSetupSchemaComponentKeys.some((k) => key.includes(k)));
  // const allModelsSchemaComponentKeysComponentProp = allModelsSchemaKeys.filter((key) => key.includes('__component__') && allModelsSchemaComponentKeys.some((k) => key.includes(k)));

  // const analyzedComponentNames = [];
  // const componentsIndicesMap = new Map();
  // currentModelsSchemaComponentKeysComponentProp.forEach((key) => {
  //   const split = key.split('.');
  //   const index = split[split.length - 2];
  //   const componentName = get(localizableTree, key);
  //   const componentProp = `${split.slice(0, split.length - 2).join('.')}.${componentName}`;

  //   if (!analyzedComponentNames.includes(componentProp)) {
  //     analyzedComponentNames.push(componentProp);
  //   }

  //   componentsIndicesMap.set(componentProp, [index, null, null]);
  // });

  // storedSetupSchemaComponentKeysComponentProp.forEach((key) => {
  //   const split = key.split('.');
  //   const index = split[split.length - 2];
  //   const componentName = get(storedSetupSchema, key);
  //   const componentProp = `${split.slice(0, split.length - 2).join('.')}.${componentName}`;

  //   if (!analyzedComponentNames.includes(componentProp)) {
  //     analyzedComponentNames.push(componentProp);
  //   }

  //   if (componentsIndicesMap.has(componentProp)) {
  //     const [currentModelsSchemaIndex, , allModelsSchemaIndex] = componentsIndicesMap.get(componentProp);
  //     componentsIndicesMap.set(componentProp, [currentModelsSchemaIndex, index, allModelsSchemaIndex]);
  //   } else {
  //     componentsIndicesMap.set(componentProp, [null, index, null]);
  //   }
  // });

  // allModelsSchemaComponentKeysComponentProp.forEach((key) => {
  //   const split = key.split('.');
  //   const index = split[split.length - 2];
  //   const componentName = get(allModelsTree, key);
  //   // cut the index
  //   const componentProp = `${split[1]}.${split.slice(1, split.length - 2).join('.')}.${componentName}`;

  //   if (!analyzedComponentNames.includes(componentProp)) {
  //     analyzedComponentNames.push(componentProp);
  //   }

  //   if (componentsIndicesMap.has(componentProp)) {
  //     const [currentModelsSchemaIndex, storedSetupSchemaIndex,] = componentsIndicesMap.get(componentProp);
  //     componentsIndicesMap.set(componentProp, [currentModelsSchemaIndex, storedSetupSchemaIndex, index]);
  //   } else {
  //     componentsIndicesMap.set(componentProp, [null, null, index]);
  //   }
  // });

  // debugger;

  /**
   * Is in the "stored setup schema" but not in the "current model"
   */
  let removedKeys = [];
  removedKeys.push(...storedSetupSchemaComponentKeysComponentProp.map((key) => {
    const storedComponentName = get(storedSetupSchema, key);
    const currentComponentName = get(localizableTree, key);

    // this must return an array of keys
    if (storedComponentName !== currentComponentName) {
      const part = key.split('.').slice(0, -1).join('.');

      return storedSetupSchemaKeys.filter((k) => k.includes(part));
    }

    return [];
  }).reduce((acc, val) => acc.concat(val), []));
  removedKeys.push(...storedSetupSchemaKeys.filter((key) => !currentModelsSchemaKeys.includes(key)));
  removedKeys = uniq(removedKeys);

  // debugger;

  /**
   * Is in the "current model" but not in the "stored setup schema"
   */
  let newKeys = [];
  newKeys.push(...currentModelsSchemaComponentKeysComponentProp.map((key) => {
    const storedComponentName = get(storedSetupSchema, key);
    const currentComponentName = get(localizableTree, key);

    // this must return an array of keys
    if (storedComponentName !== currentComponentName) {
      const part = key.split('.').slice(0, -1).join('.');

      return currentModelsSchemaKeys.filter((k) => k.includes(part));
    }

    return [];
  }).reduce((acc, val) => acc.concat(val), []));
  newKeys.push(...currentModelsSchemaKeys.filter((key) => !storedSetupSchemaKeys.includes(key)));
  newKeys = uniq(newKeys);

  // debugger;

  /**
   * Filter out the removed keys
  */
  const filteredStoredSetupSchemaKeys = storedSetupSchemaKeys.filter(
    (key) => !removedKeys.includes(key)
  );

  const destinationObject = {};
  filteredStoredSetupSchemaKeys.forEach((key) => {
    const localizableTreeValueToSet = get(storedSetupSchema, key);
    const allModelsTreeValueToSet = findModelValueByKey(allModelsTree, key);

    if (allModelsTreeValueToSet === null) {
      set(destinationObject, key, null);
    } else if (localizableTreeValueToSet !== null) {
      set(destinationObject, key, localizableTreeValueToSet);
    } else {
      // check for newly activated localizable fields & update model accordingly
      const newValueToSet = findModelValueByKey(allModelsTree, key);
      set(destinationObject, key, newValueToSet);
    }
  });
  newKeys.forEach((key) => {
    set(destinationObject, key, get(localizableTree, key));
  });

  const destinationArray = [];
  const sortedDestinationObjectKeys = Object.keys(destinationObject).sort(
    (a, b) => {
      if (a < b) return -1;

      if (a > b) return 1;

      return 0;
    }
  );

  // eslint-disable-next-line no-restricted-syntax
  for (const key of sortedDestinationObjectKeys) {
    destinationArray.push(destinationObject[key]);
  }

  return destinationArray;
};
