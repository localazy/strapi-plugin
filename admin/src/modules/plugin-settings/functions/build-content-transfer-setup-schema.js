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

  const currentModelsSchemaKeys = deepKeys(localizableTree);
  const storedSetupSchemaKeys = deepKeys(storedSetupSchema);

  // components order may have changed; this would prevent properties from mixing up
  const regex = /\.\d+\.__component__/;
  let currentModelsSchemaComponentKeys = currentModelsSchemaKeys.filter((key) => key.match(regex)).map((key) => key.replace(regex, ''));
  let storedSetupSchemaComponentKeys = storedSetupSchemaKeys.filter((key) => key.match(regex)).map((key) => key.replace(regex, ''));
  currentModelsSchemaComponentKeys = uniq(currentModelsSchemaComponentKeys);
  storedSetupSchemaComponentKeys = uniq(storedSetupSchemaComponentKeys);

  const currentModelsSchemaComponentKeysComponentProp = currentModelsSchemaKeys.filter((key) => key.includes('__component__') && currentModelsSchemaComponentKeys.some((k) => key.includes(k)));
  const storedSetupSchemaComponentKeysComponentProp = storedSetupSchemaKeys.filter((key) => key.includes('__component__') && storedSetupSchemaComponentKeys.some((k) => key.includes(k)));

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
