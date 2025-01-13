import get from "lodash-es/get";
import uniq from "lodash-es/uniq";
import deepKeys from "@david-vaclavek/deep-keys";
import sortByModelName from "../../@common/utils/sort-by-model-name";
import arrayOfModelsToObject from "../utils/array-of-models-to-object";

// TODO: ADD TYPES

export default (
  localizableTree: any[] = [],
  storedSetupSchema: any[] = [],
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
  let currentModelsSchemaComponentKeys = currentModelsSchemaKeys.filter((key: string) => key.match(regex)).map((key: string) => key.replace(regex, ''));
  let storedSetupSchemaComponentKeys = storedSetupSchemaKeys.filter((key: string) => key.match(regex)).map((key: string) => key.replace(regex, ''));
  currentModelsSchemaComponentKeys = uniq(currentModelsSchemaComponentKeys);
  storedSetupSchemaComponentKeys = uniq(storedSetupSchemaComponentKeys);

  const currentModelsSchemaComponentKeysComponentProp = currentModelsSchemaKeys.filter((key: string) => key.includes('__component__') && currentModelsSchemaComponentKeys.some((k: string) => key.includes(k)));
  const storedSetupSchemaComponentKeysComponentProp = storedSetupSchemaKeys.filter((key: string) => key.includes('__component__') && storedSetupSchemaComponentKeys.some((k: string) => key.includes(k)));

  /**
   * Is in the "stored setup schema" but not in the "current model"
   */
  let removedKeys = [];
  removedKeys.push(...storedSetupSchemaComponentKeysComponentProp.map((key: string) => {
    const storedComponentName = get(storedSetupSchema, key);
    const currentComponentName = get(localizableTree, key);

    // this must return an array of keys
    if (storedComponentName !== currentComponentName) {
      const part = key.split('.').slice(0, -1).join('.');

      return storedSetupSchemaKeys.filter((k: string) => k.includes(part));
    }

    return [];
  }).reduce((acc: string[], val: string[]) => acc.concat(val), []));
  removedKeys.push(...storedSetupSchemaKeys.filter((key: string) => !currentModelsSchemaKeys.includes(key)));
  removedKeys = uniq(removedKeys);

  /**
   * Is in the "current model" but not in the "stored setup schema"
   */
  let newKeys = [];
  newKeys.push(...currentModelsSchemaComponentKeysComponentProp.map((key: string) => {
    const storedComponentName = get(storedSetupSchema, key);
    const currentComponentName = get(localizableTree, key);

    // this must return an array of keys
    if (storedComponentName !== currentComponentName) {
      const part = key.split('.').slice(0, -1).join('.');

      return currentModelsSchemaKeys.filter((k: string) => k.includes(part));
    }

    return [];
  }).reduce((acc: string[], val: string[]) => acc.concat(val), []));
  newKeys.push(...currentModelsSchemaKeys.filter((key: string) => !storedSetupSchemaKeys.includes(key)));
  newKeys = uniq(newKeys);

  /**
   * Filter out the removed keys
  */
  const filteredStoredSetupSchemaKeys = storedSetupSchemaKeys.filter(
    (key: string) => !removedKeys.includes(key)
  );

  return {
    oLocalizableTree: localizableTree,
    oStoredSetupSchema: storedSetupSchema,
    removedKeys,
    newKeys,
    filteredStoredSetupSchemaKeys,
  }
}
