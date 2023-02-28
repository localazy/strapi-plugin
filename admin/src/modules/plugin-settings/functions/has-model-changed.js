import get from "lodash-es/get";
import PluginSettingsService from "../services/plugin-settings-service";
import StrapiModelService from "../services/strapi-model-service";
import getModelsTree from "../utils/get-models-tree";
import findModelValueByKey from "../utils/find-model-value-by-key";
import getContentTransferSetupKeysSets from "./get-content-transfer-setup-keys-sets";

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

  const {
    oStoredSetupSchema,
    removedKeys,
    newKeys,
    filteredStoredSetupSchemaKeys
  } = getContentTransferSetupKeysSets(
    localizableTree,
    storedSetupSchema,
  );

  if (newKeys.length || removedKeys.length) {
    return true;
  }

  /**
   * Check if the values are different (type might have changed; boolean to null or vice versa)
   */
  // eslint-disable-next-line no-restricted-syntax
  for (const key of filteredStoredSetupSchemaKeys) {
    const localizableTreeValueToSet = get(oStoredSetupSchema, key);
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
