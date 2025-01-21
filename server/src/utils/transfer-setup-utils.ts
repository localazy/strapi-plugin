import { getMainKeysOfNestedArrayObjects } from './get-main-keys-of-nested-array-objects';
import { flattenObject } from './flatten-object';

const findSetupModelByCollectionName = (models, collectionName) => {
  return models.find((model) => Object.keys(model)[0] === collectionName);
};

const findSetupModelByCollectionUid = (contentTransferSetup, strapiContentTypesModels, collectionUid) => {
  const currentModel = strapiContentTypesModels.find((model) => model.uid === collectionUid);

  if (!currentModel) {
    return undefined;
  }

  const modelContentTransferSetup = contentTransferSetup.setup.find(
    (model) => Object.keys(model)[0] === currentModel.collectionName
  );
  return modelContentTransferSetup[currentModel.collectionName];
};

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
    (key) => flattenedObject[key] === true && key.indexOf('__model__') === -1
  );

  // id needs to be always included
  pickPaths.push('id');

  return pickPaths;
};

const getPickPathsWithComponents = (transferSetupModelProps) => {
  const flattenedObject = flattenObject(transferSetupModelProps);
  let pickComponents = {};
  Object.keys(flattenedObject).forEach((key) => {
    if (key.includes('.__component__')) {
      const componentKey = key.split('.__component__')[0];
      const propertyName = componentKey.split('[')[0];
      if (!pickComponents[componentKey]) {
        const splitByDot = flattenedObject[key].split('.');
        pickComponents[componentKey] = `${propertyName}[${splitByDot[1]}]`;
      }
    }
  });
  const pickPaths = Object.keys(flattenedObject).filter(
    (key) => flattenedObject[key] === true && key.indexOf('__model__') === -1
  );

  // id needs to be always included
  pickPaths.push('id');

  let pickPathsWithComponents = [];
  Object.entries(pickPaths).forEach(([, value]) => {
    const componentKey = value.split('.')[0];
    let pushValue = value;
    if (pickComponents[componentKey]) {
      pushValue = value.replace(componentKey, pickComponents[componentKey]);
    }
    pickPathsWithComponents.push(pushValue);
  });

  return pickPathsWithComponents;
};

export {
  findSetupModelByCollectionName,
  findSetupModelByCollectionUid,
  getCollectionsNames,
  isCollectionTransferEnabled,
  getPickPaths,
  getPickPathsWithComponents,
};
