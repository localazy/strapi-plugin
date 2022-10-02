"use strict";

const cloneDeep = require("lodash/cloneDeep");
const findModel = require("./find-model");
const set = require("lodash/set");
const get = require("lodash/get");

// TODO: move to external function set
const isComponent = (attributeObj) => {
  return attributeObj.type === "component";
};

// TODO: move to external function set
const isRepeatable = (attributeObj) => {
  return isComponent(attributeObj) && !!attributeObj.repeatable;
};

// TODO: move to external function set
const getAttribute = (model, attribute) => {
  const attributeObj = model.attributes[attribute];
  return attributeObj;
};

const populateCreateUpdateEntryWithBaseEntry = (
  models,
  createUpdateEntry,
  baseEntry,
  uid
) => {
  const populatedEntry = cloneDeep(createUpdateEntry);

  const populateEntry = (
    partialBaseEntry,
    model,
    objectKey = "",
    prefix = "",
    component = "",
    isRepeatableComponent = false
  ) => {
    if (Array.isArray(partialBaseEntry)) {
      // is array
      const attribute = getAttribute(model, objectKey);

      if (typeof attribute !== 'undefined') {
        const newPrefix = prefix ? `${prefix}.${objectKey}` : objectKey;
        const doesExistInCreateUpdateEntry = get(createUpdateEntry, newPrefix);
        if (typeof doesExistInCreateUpdateEntry === 'undefined') {
          set(populatedEntry, newPrefix, partialBaseEntry);
        } else {
          for (const [objectKey, value] of Object.entries(entry)) {
            populateEntry(
              value,
              model,
              objectKey,
              newPrefix
            );
          }
        }
      } else if (isRepeatableComponent) {
        Object.entries(partialBaseEntry).forEach(([partialBaseEntryItemIndex, partialBaseEntryItem]) => {
          // TODO: is this okay?
          const newPrefix = `${prefix}.${partialBaseEntryItemIndex}`;
          populateEntry(
            partialBaseEntryItem,
            model,
            partialBaseEntryItemIndex,
            newPrefix,
          );
        });
      }

    } else if (typeof partialBaseEntry === "object") {
      // is object
      for (const [objectKey, value] of Object.entries(partialBaseEntry)) {
        const attribute = getAttribute(model, objectKey);
        if (attribute === undefined) {
          // logicaly don't anything, skip...
          continue;
        } else if (isComponent(attribute)) {
          // is component
          const component = attribute.component;
          const componentModel = findModel(models, component);

          const newPrefix = prefix ? `${prefix}.${objectKey}` : objectKey;
          const inCreateUpdateEntry = get(createUpdateEntry, newPrefix);
          let doesExistInCreateUpdateEntry;
          if (isRepeatable(attribute)) {
            // TODO: how to handle repeatable components?
            console.log(`repeatable component: ${component}`);
            doesExistInCreateUpdateEntry = !inCreateUpdateEntry.length;
          } else {
            doesExistInCreateUpdateEntry = (typeof inCreateUpdateEntry === 'undefined' || inCreateUpdateEntry === null);
          }

          // TODO: double check & update the condition
          if (!!doesExistInCreateUpdateEntry) {
            let valueToSet = value;
            if (isRepeatable(attribute)) {
              valueToSet = value.map((item) => {
                delete item.id;
                return {
                  __component: component,
                  ...item,
                };
              });
            } else {
              delete valueToSet.id;
              valueToSet.__component = component;
            }
            set(populatedEntry, newPrefix, valueToSet);
            // set(populatedEntry, `${newPrefix}.__component`, component);
          } else {
            populateEntry(
              value,
              componentModel,
              objectKey,
              newPrefix,
              component,
              isRepeatable(attribute),
            );
          }
        } else {
          const newPrefix = prefix ? `${prefix}.${objectKey}` : objectKey;
          const doesExistInCreateUpdateEntry = get(createUpdateEntry, newPrefix);
          if (typeof doesExistInCreateUpdateEntry === 'undefined') {
            set(populatedEntry, newPrefix, value);
          } else {
            populateEntry(
              value,
              model,
              objectKey,
              newPrefix
            );
          }
        }
      }
    } else if (partialBaseEntry !== Object(partialBaseEntry)) {
      // is primitive/literal
      const attribute = getAttribute(model, objectKey);
      if (typeof attribute !== 'undefined') {
        const doesExistInCreateUpdateEntry = get(createUpdateEntry, prefix);
        // TODO: double check & update the condition
        if (typeof doesExistInCreateUpdateEntry === 'undefined' || doesExistInCreateUpdateEntry === null) {
          set(populatedEntry, prefix, partialBaseEntry);
        }
      }
    } else {
      // ! TODO: something unknown?
    }
  }

  const model = findModel(models, uid);
  populateEntry(baseEntry, model);

  return populatedEntry;
};

module.exports = populateCreateUpdateEntryWithBaseEntry;
