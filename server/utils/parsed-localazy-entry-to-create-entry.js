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
    baseEntry, // this  does not need to be passed, can be referenced from the closure
    // eslint-disable-next-line no-unused-vars
    key = "",
    prefix = "",
    component = "",
    isRepeatableComponent = false,
    isDZ = false,
    isInsideDZ = false,
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
    } else if (isDZ) {
      // TODO: implement DZ functionality
      Object.entries(entry).forEach(([dzEntryIdWithComponent, value]) => {
        let [dzEntryId, dzEntryComponent] = dzEntryIdWithComponent.split(";");
        dzEntryId = parseInt(dzEntryId);
        const baseEntryDZEntry = get(baseEntry, prefix).find((v) => (v.id === dzEntryId) && (v.__component === dzEntryComponent));
        if (baseEntryDZEntry !== undefined) {
          const dzEntryComponentModel = findModel(models, dzEntryComponent);
          toCreateEntry(
            value,
            dzEntryComponentModel,
            baseEntry,
            dzEntryId,
            `${prefix}.${dzEntryId}`,
            dzEntryComponent,
            true,
            false, // we're already inside, so it's falsy
            true,
          );
        }
        // ? don't do anything if baseEntryDZEntry is undefined - it means that the entry was deleted
      });
    } else {
      // is object
      Object.entries(entry).forEach(([objectKey, value]) => {
        const attribute = getAttribute(model, objectKey);
        if (attribute === undefined) {
          // logicaly don't anything, skip...
        } else if (isComponent(attribute)) {
          // is component
          console.log("func key", key);
          console.log("func comp", component);
          const innerComponent = attribute.component;
          const componentModel = findModel(models, innerComponent);

          let newPrefixBase = prefix;
          let newPrefix = newPrefixBase
            ? `${newPrefixBase}.${objectKey}`
            : `${objectKey}`;
          if (isInsideDZ) {
            let [dzParamKey, dzEntryId] = newPrefixBase.split(".");
            dzEntryId = parseInt(dzEntryId);
            const baseEntryDZIndex = get(baseEntry, dzParamKey).findIndex((v) => (v.__component === component) && (v.id === dzEntryId)); // ? TODO: what if it's not found?
            newPrefixBase = `${dzParamKey}.${baseEntryDZIndex}`;
            newPrefix = `${newPrefixBase}.${objectKey}`;
          }
          const isRepeatableComponent = isRepeatable(attribute);
          if (!isRepeatableComponent) {
            set(createEntry, `${newPrefix}.__component`, innerComponent);
          }
          toCreateEntry(
            value,
            componentModel,
            baseEntry,
            objectKey,
            newPrefix,
            innerComponent,
            isRepeatableComponent,
            false,
            isInsideDZ,
          );
          // if (isRepeatable(attribute)) {
          //   // TODO: need to count with possible inner-DZ components
          //   // is repeatable - array
          //   // const newPrefix = prefix
          //   //   ? `${prefix}.${objectKey}`
          //   //   : `${objectKey}`;
          //   toCreateEntry(
          //     value,
          //     componentModel,
          //     baseEntry,
          //     objectKey,
          //     newPrefix,
          //     innerComponent,
          //     true,
          //     false,
          //     isInsideDZ,
          //   );
          // } else {
          //   // TODO: need to count with possible inner-DZ components
          //   // is no repeatable - object
          //   set(createEntry, `${newPrefix}.__component`, innerComponent);
          //   toCreateEntry(
          //     value,
          //     componentModel,
          //     baseEntry,
          //     objectKey,
          //     newPrefix,
          //     innerComponent,
          //     false,
          //     false,
          //     isInsideDZ,
          //   );
          // }
        } else if (isDynamicZone(attribute)) {
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
          let newPrefixBase = prefix;
          let newPrefix = newPrefixBase ? `${newPrefixBase}.${objectKey}` : `${objectKey}`;
          if (isInsideDZ) {
            let [dzParamKey, dzEntryId] = newPrefixBase.split(".");
            dzEntryId = parseInt(dzEntryId);
            const baseEntryDZIndex = get(baseEntry, dzParamKey).findIndex((v) => (v.__component === component) && (v.id === dzEntryId)); // ? TODO: what if it's not found?
            newPrefixBase = `${dzParamKey}.${baseEntryDZIndex}`;
            newPrefix = `${newPrefixBase}.${objectKey}`;
          }
          set(createEntry, newPrefix, value);

          if (component) {
            const componentKeyToSet = `${newPrefixBase}.__component`;
            set(createEntry, componentKeyToSet, component);

            if (isInsideDZ) {
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
