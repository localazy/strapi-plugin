import deepKeys from "deep-keys";
import get from "lodash-es/get";
import PluginSettingsService from "../services/plugin-settings-service";
import StrapiModelService from "../services/strapi-model-service";
import getModelsTree from "../utils/get-models-tree";
import sortByModelName from "../../@common/utils/sort-by-model-name";
import arrayOfModelsToObject from "../utils/array-of-models-to-object";
import findModelValueByKey from "../utils/find-model-value-by-key";

/**
 * Pass parameters optionally so we don't have to fetch them again
 * Returns whether the content transfer setup has changed
 */
export default async (
  localizableTree = null,
  storedSetupSchema = null,
  allModelsTree = null
) => {
  let models;

  if (!localizableTree || !allModelsTree) {
    models = await StrapiModelService.getModels();
  }

  if (!localizableTree) {
    const localizableModels = await StrapiModelService.getLocalizableModels();
    localizableTree = getModelsTree(models, localizableModels);
  }

  if (!storedSetupSchema) {
    storedSetupSchema = (await PluginSettingsService.getContentTransferSetup())
      .setup;
  }

  if (!allModelsTree) {
    allModelsTree = getModelsTree(models, models);
  }

  localizableTree = arrayOfModelsToObject(
    localizableTree.sort(sortByModelName)
  );
  storedSetupSchema = arrayOfModelsToObject(
    storedSetupSchema.sort(sortByModelName)
  );

  const modelsTreeKeys = deepKeys(localizableTree);
  const storedSetupSchemaKeys = deepKeys(storedSetupSchema);

  const removedKeys = storedSetupSchemaKeys.filter(
    (x) => !modelsTreeKeys.includes(x)
  );
  const newKeys = modelsTreeKeys.filter(
    (key) => !storedSetupSchemaKeys.includes(key)
  );

  if (newKeys.length || removedKeys.length) {
    return true;
  }

  const filteredStoredSetupSchemaKeys = storedSetupSchemaKeys.filter(
    (key) => !removedKeys.includes(key)
  );

  // eslint-disable-next-line no-restricted-syntax
  for (const key of filteredStoredSetupSchemaKeys) {
    const localizableTreeValueToSet = get(storedSetupSchema, key);
    const allModelsTreeValueToSet = findModelValueByKey(allModelsTree, key);

    if (
      typeof localizableTreeValueToSet === "boolean" &&
      allModelsTreeValueToSet === null
    ) {
      return true;
    }

    if (
      localizableTreeValueToSet === null &&
      typeof allModelsTreeValueToSet === "boolean"
    ) {
      return true;
    }
  }

  return false;
};
