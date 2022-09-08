"use strict";

const set = require("lodash/set");
const get = require("lodash/get");
const resetArrayKeysDeep = require("./reset-array-keys-deep");

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
  baseEntry,
  uid,
  locale = ""
) => {
  const createEntry = {};
  const repeatableComponentsKeystoFilter = [];

  const toCreateEntry = (
    entry,
    model,
    baseEntry,
    // eslint-disable-next-line no-unused-vars
    key = "",
    prefix = "",
    component = "",
    isRepeatableComponent = false
  ) => {
    if (Array.isArray(entry)) {
      // is array
      Object.entries(entry).forEach(([baseEntryItemId, value]) => {
        if (value !== null) {
          if (component && isRepeatableComponent) {
            // used for indices filtering in repeatable components
            if (!repeatableComponentsKeystoFilter.includes(prefix)) {
              repeatableComponentsKeystoFilter.push(prefix);
            }
            const baseEntryRepeatableItemId = parseInt(baseEntryItemId);
            const baseEntryRepeateableGroup = get(baseEntry, prefix);
            if (baseEntryRepeateableGroup !== undefined) {
              const localizedEntryRepeatableItemPosition = baseEntryRepeateableGroup.findIndex((repeatableItem) => !!repeatableItem && repeatableItem.id === baseEntryRepeatableItemId);
              if (localizedEntryRepeatableItemPosition > -1) {
                toCreateEntry(value, model, baseEntry, localizedEntryRepeatableItemPosition, `${prefix}.${localizedEntryRepeatableItemPosition}`, component);
              }
            }
          }

          if (component && !isRepeatableComponent) {
            toCreateEntry(value, model, baseEntry, `${prefix}`, `${prefix}`);
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
              baseEntry,
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
              baseEntry,
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
  toCreateEntry(parsedLocalazyEntry, model, baseEntry);
  if (locale) {
    createEntry.locale = locale;
  }

  resetArrayKeysDeep(createEntry, repeatableComponentsKeystoFilter);
  return createEntry;
};

module.exports = parsedLocalazyEntryToCreateEntry;
