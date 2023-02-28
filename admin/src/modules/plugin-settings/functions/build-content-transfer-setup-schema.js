import set from "lodash-es/set";
import get from "lodash-es/get";
import findModelValueByKey from "../utils/find-model-value-by-key";
import getContentTransferSetupKeysSets from "./get-content-transfer-setup-keys-sets";

export default (
  localizableTree = [],
  storedSetupSchema = [],
  allModelsTree = []
) => {
  const {
    oLocalizableTree,
    oStoredSetupSchema,
    newKeys,
    filteredStoredSetupSchemaKeys
  } = getContentTransferSetupKeysSets(
    localizableTree,
    storedSetupSchema,
  );

  const destinationObject = {};
  filteredStoredSetupSchemaKeys.forEach((key) => {
    const localizableTreeValueToSet = get(oStoredSetupSchema, key);
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
    set(destinationObject, key, get(oLocalizableTree, key));
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
