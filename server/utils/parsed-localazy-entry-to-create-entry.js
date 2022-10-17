"use strict";

const set = require("lodash/set");
const get = require("lodash/get");
const resetArrayKeysDeep = require("./reset-array-keys-deep");
const { getAttribute, isComponent, isDynamicZone, isRepeatable, findModel } = require("./model-utils");

const parsedLocalazyEntryToCreateEntry = (
  models,
  parsedLocalazyEntry,
  baseEntry,
  uid,
  locale = ""
) => {
  const createEntry = {};
  const repeatableComponentsKeystoFilter = [];
  const dynamicZoneComponentKeys = [];

  const toCreateEntry = (
    entry,
    model,
    baseEntry,
    // eslint-disable-next-line no-unused-vars
    key = "",
    prefix = "",
    component = "",
    isRepeatableComponent = false,
    isDZ = false,
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

          if (!component && isRepeatableComponent) {
            // TODO: this is a DZ; implement
            // used for indices filtering in dynamic zones
            if (!repeatableComponentsKeystoFilter.includes(prefix)) {
              repeatableComponentsKeystoFilter.push(prefix);
            }
            const baseEntryRepeatableItemId = parseInt(baseEntryItemId);
            const baseEntryRepeateableGroup = get(baseEntry, prefix);
            if (baseEntryRepeateableGroup !== undefined) {
              const localizedEntryRepeatableItemPosition = baseEntryRepeateableGroup.findIndex((repeatableItem) => !!repeatableItem && repeatableItem.id === baseEntryRepeatableItemId);
              if (localizedEntryRepeatableItemPosition > -1) {
                const dzEntry = get(baseEntry, prefix).find((v) => v.id === baseEntryRepeatableItemId);
                const dzEntryComponent = dzEntry.__component;
                const dzEntryComponentModel = findModel(models, dzEntryComponent);
                toCreateEntry(
                  value,
                  dzEntryComponentModel,
                  baseEntry,
                  localizedEntryRepeatableItemPosition,
                  `${prefix}.${localizedEntryRepeatableItemPosition}`,
                  dzEntryComponent,
                  true,
                  true,
                );
              }
            }
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
        } else if (isDynamicZone(attribute)) {
          // TODO: implement logic
          // behaves sort of like repeatable component
          const newPrefix = prefix
            ? `${prefix}.${objectKey}`
            : `${objectKey}`;
          toCreateEntry(
            value,
            null, // model is evaluated later as it's dynamic (DZ)
            baseEntry,
            objectKey,
            newPrefix,
            "", // component is computed later as it's dynamic (DZ)
            true,
            true,
          );
        } else {
          const newPrefix = prefix ? `${prefix}.${objectKey}` : `${objectKey}`;
          set(createEntry, newPrefix, value);

          if (component) {
            const componentKeyToSet = `${prefix}.__component`;
            set(createEntry, componentKeyToSet, component);

            if (isDZ) {
              const isKeyAdded = (typeof dynamicZoneComponentKeys.find((v) => v.key === componentKeyToSet) !== "undefined");
              if (!isKeyAdded)
                dynamicZoneComponentKeys.push({
                  key: componentKeyToSet,
                  component,
                });
            }
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
  return { createEntry, dynamicZoneComponentKeys };
};

module.exports = parsedLocalazyEntryToCreateEntry;
