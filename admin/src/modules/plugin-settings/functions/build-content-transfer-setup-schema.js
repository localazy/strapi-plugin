import set from "lodash-es/set";
import get from "lodash-es/get";
import deepKeys from "deep-keys";
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

  const removedKeys = storedSetupSchemaKeys.filter(
    (x) => !currentModelsSchemaKeys.includes(x)
  );

  const newKeys = currentModelsSchemaKeys.filter(
    (key) => !storedSetupSchemaKeys.includes(key)
  );

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
