"use strict";

const getAttribute = (model, attribute) => {
  const attributeObj = model.attributes[attribute];
  return attributeObj;
};

const isComponent = (attributeObj) => {
  return attributeObj.type === "component";
};

const isRepeatable = (attributeObj) => {
  return isComponent(attributeObj) && !!attributeObj.repeatable;
};

const isRelation = (attributeObj) => {
  return attributeObj.type === "relation"
    && attributeObj.target !== "plugin::upload.file";
};

const findModel = (models, uid) => {
  const model = models.find((model) => model.uid === uid);
  return model;
};

module.exports = {
  getAttribute,
  isComponent,
  isRepeatable,
  isRelation,
  findModel,
};
