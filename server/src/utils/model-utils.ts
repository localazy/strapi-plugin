import { isEmpty } from 'lodash-es';

const getAttribute = (model, attribute) => {
  if (isEmpty(model)) {
    return undefined;
  }

  const attributeObj = model.attributes[attribute];
  return attributeObj;
};

const isComponent = (attributeObj) => {
  return attributeObj.type === 'component';
};

const isDynamicZone = (attributeObj) => {
  return attributeObj.type === 'dynamiczone';
};

const isRepeatable = (attributeObj) => {
  return isComponent(attributeObj) && !!attributeObj.repeatable;
};

const isRelation = (attributeObj) => {
  return attributeObj.type === 'relation' && attributeObj.target !== 'plugin::upload.file';
};

const findModel = (models, uid) => {
  const model = models.find((model) => model.uid === uid);
  return model;
};

export { getAttribute, isComponent, isDynamicZone, isRepeatable, isRelation, findModel };
