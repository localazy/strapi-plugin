"use strict";

const set = require("lodash/set");

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

const findModel = (models, uid) => {
  const model = models.find((model) => model.uid === uid);
  return model;
};

const parsedLocalazyEntryToCreateEntry = (
  models,
  parsedLocalazyEntry,
  uid,
  locale = ""
) => {
  const createEntry = {};

  const toCreateEntry = (
    entry,
    model,
    // eslint-disable-next-line no-unused-vars
    key = "",
    prefix = "",
    component = "",
    isRepeatableComponent = false
  ) => {
    if (Array.isArray(entry)) {
      // is array
      let i = 0;
      Object.entries(entry).forEach(([, value]) => {
        if (value !== null) {
          if (component && isRepeatableComponent) {
            toCreateEntry(value, model, i, `${prefix}.${i}`, component);
            i += 1;
          }

          if (component && !isRepeatableComponent) {
            toCreateEntry(value, model, `${prefix}`, `${prefix}`);
          }
        }
      });
    } else {
      // is object
      Object.entries(entry).forEach(([objectKey, value]) => {
        const attribute = getAttribute(model, objectKey);
        if (attribute === undefined) {
          // logicaly don't anything, skip...
        } else if (isComponent(attribute)) {
          // is component
          const component = attribute.component;
          const componentModel = findModel(models, component);
          if (isRepeatable(attribute)) {
            // is repeatable - array
            const newPrefix = prefix
              ? `${prefix}.${objectKey}`
              : `${objectKey}`;
            toCreateEntry(
              value,
              componentModel,
              objectKey,
              newPrefix,
              component,
              true
            );
          } else {
            // is no repeatable - object
            const newPrefix = prefix
              ? `${prefix}.${objectKey}`
              : `${objectKey}`;
            set(createEntry, `${newPrefix}.__component`, component);
            toCreateEntry(
              value,
              componentModel,
              objectKey,
              newPrefix,
              component,
              false
            );
          }
        } else {
          const newPrefix = prefix ? `${prefix}.${objectKey}` : `${objectKey}`;
          set(createEntry, newPrefix, value);

          if (component) {
            set(createEntry, `${prefix}.__component`, component);
          }
          // is not component
        }
      });
    }
  };

  const model = findModel(models, uid);
  toCreateEntry(parsedLocalazyEntry, model);
  if (locale) {
    createEntry.locale = locale;
  }

  return createEntry;
};

module.exports = parsedLocalazyEntryToCreateEntry;
