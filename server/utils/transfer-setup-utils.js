const getMainKeysOfNestedArrayObjects = require("./get-main-keys-of-nested-array-objects");
const flattenObject = require("./flatten-object");

const findSetupModelByCollectionName = (models, collectionName) => {
  return models.find((model) => Object.keys(model)[0] === collectionName);
};

const findSetupModelByCollectionUid = (
  contentTransferSetup,
  strapiContentTypesModels,
  collectionUid
) => {
  const currentModel = strapiContentTypesModels.find(
    (model) => model.uid === collectionUid
  );
  const modelContentTransferSetup = contentTransferSetup.setup
    .find((model) => Object.keys(model)[0] === currentModel.collectionName);
  return modelContentTransferSetup[currentModel.collectionName];
}

const getCollectionsNames = (setup) => {
  return getMainKeysOfNestedArrayObjects(setup);
};

const isCollectionTransferEnabled = (models, collectionName) => {
  const model = findSetupModelByCollectionName(models, collectionName);

  if (!model || !model[collectionName]) {
    return false;
  }

  return !!model[collectionName].__model__;
};

const getPickPaths = (transferSetupModelProps) => {
  const flattenedObject = flattenObject(transferSetupModelProps);
  const pickPaths = Object.keys(flattenedObject).filter(
    (key) => flattenedObject[key] === true && key.indexOf("__model__") === -1
  );

  // id needs to be always included
  pickPaths.push("id");

  return pickPaths;
};

module.exports = {
  findSetupModelByCollectionName,
  findSetupModelByCollectionUid,
  getCollectionsNames,
  isCollectionTransferEnabled,
  getPickPaths,
};
