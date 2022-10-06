"use strict";

const cloneDeep = require("lodash/cloneDeep");
const set = require("lodash/set");
const get = require("lodash/get");
const isEmpty = require("lodash/isEmpty");
const {
  getAttribute,
  isComponent,
  isRepeatable,
  isRelation,
  findModel
} = require("./model-utils");

const doesExistInPopulatedLocalizedEntry = (val) => {
  if (Array.isArray(val)) {
    // is array
    return !!val.length;
  }

  if (typeof val === "object") {
    // is object
    return !isEmpty(val);
  }

  if (val !== Object(val)) {
    // is primitive
    return !!val;
  }
}

const getNewPrefix = (objectKey, prefix) => {
  return prefix ? `${prefix}.${objectKey}` : objectKey;
};

const populateCreateUpdateEntryWithBaseEntry = async (
  models,
  createUpdateEntry,
  baseEntry,
  populatedLocalizedEntry,
  uid,
  locale
) => {
  const populatedEntry = cloneDeep(createUpdateEntry);

  const populateEntry = async (
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
        const newPrefix = getNewPrefix(objectKey, prefix);
        const inCreateUpdateEntry = get(createUpdateEntry, newPrefix);
        // TODO: decide whether add || inCreateUpdateEntry === null to the condition
        const isMissingInCreateUpdateEntry = !!(typeof inCreateUpdateEntry === 'undefined');
        if (isMissingInCreateUpdateEntry) {
          const populatedLocalizedEntryVal = get(populatedLocalizedEntry, newPrefix);
          if (doesExistInPopulatedLocalizedEntry(populatedLocalizedEntryVal)) {
            set(populatedEntry, newPrefix, populatedLocalizedEntryVal);
          } else {
            set(populatedEntry, newPrefix, partialBaseEntry);
          }
        } else {
          for (const [objectKey, value] of Object.entries(entry)) {
            await populateEntry(
              value,
              model,
              objectKey,
              newPrefix
            );
          }
        }
      } else if (isRepeatableComponent) {
        Object.entries(partialBaseEntry).forEach(async ([partialBaseEntryItemIndex, partialBaseEntryItem]) => {
          const newPrefix = `${prefix}.${partialBaseEntryItemIndex}`;
          await populateEntry(
            partialBaseEntryItem,
            model,
            partialBaseEntryItemIndex,
            newPrefix,
          );
        });
      }

    } else if (typeof partialBaseEntry === "object") {
      // is object
      if (partialBaseEntry === null) {
        partialBaseEntry = {};
      }

      for (const [objectKey, value] of Object.entries(partialBaseEntry)) {
        const attribute = getAttribute(model, objectKey);
        if (typeof attribute === 'undefined') {
          // skip...
          continue;
        } else if (isComponent(attribute)) {
          // is component
          const component = attribute.component;
          const componentModel = findModel(models, component);

          const newPrefix = getNewPrefix(objectKey, prefix);
          const inCreateUpdateEntry = get(createUpdateEntry, newPrefix);
          let isMissingInCreateUpdateEntry;
          if (isRepeatable(attribute)) {
            isMissingInCreateUpdateEntry = !!((typeof inCreateUpdateEntry === 'undefined') || (inCreateUpdateEntry && !inCreateUpdateEntry.length));
          } else {
            isMissingInCreateUpdateEntry = !!(typeof inCreateUpdateEntry === 'undefined' || inCreateUpdateEntry === null);
          }

          if (isMissingInCreateUpdateEntry) {
            const populatedLocalizedEntryVal = get(populatedLocalizedEntry, newPrefix);
            let valueToSet = value;
            if (doesExistInPopulatedLocalizedEntry(populatedLocalizedEntryVal)) {
              valueToSet = populatedLocalizedEntryVal;
            }
            if (isRepeatable(attribute)) {
              valueToSet = value.map((item) => {
                delete item.id;
                return {
                  __component: component,
                  ...item,
                };
              });
            } else {
              if (!isEmpty(valueToSet)) {
                delete valueToSet.id;
                valueToSet.__component = component;
              }
            }
            set(populatedEntry, newPrefix, valueToSet);
          }
          await populateEntry(
            value,
            componentModel,
            objectKey,
            newPrefix,
            component,
            isRepeatable(attribute),
          );
        } else if (isRelation(attribute)) {
          const newPrefix = getNewPrefix(objectKey, prefix);
          const populatedLocalizedEntryVal = get(populatedLocalizedEntry, newPrefix);
          if (doesExistInPopulatedLocalizedEntry(populatedLocalizedEntryVal)) {
            // skip...
            continue;
          }

          const isArray = Array.isArray(value);
          let arraiedValue = value;
          if (!isArray) {
            arraiedValue = [value];
          }
          for (const [index, item] of Object.entries(arraiedValue)) {
            if (!isEmpty(item)) {
              const entityId = item.id;
              if (!!entityId) {
                const entryWithLocalizations = await strapi.entityService.findOne(attribute.target, entityId, {
                  populate: ['localizations'],
                });

                const localizedEntry = entryWithLocalizations.localizations.find((item) => item.locale === locale);
                if (!!localizedEntry && localizedEntry.id) {
                  if (!isArray) {
                    set(populatedEntry, newPrefix, { id: localizedEntry.id });
                  } else {
                    set(populatedEntry, `${newPrefix}.${index}`, { id: localizedEntry.id });
                  }
                }
              }
            }
          }
        } else {
          const newPrefix = getNewPrefix(objectKey, prefix);
          const inCreateUpdateEntry = get(createUpdateEntry, newPrefix);
          const isMissingInCreateUpdateEntry = !!(typeof inCreateUpdateEntry === 'undefined' || inCreateUpdateEntry === null);
          if (isMissingInCreateUpdateEntry) {
            const populatedLocalizedEntryVal = get(populatedLocalizedEntry, newPrefix);
            if (doesExistInPopulatedLocalizedEntry(populatedLocalizedEntryVal)) {
              set(populatedEntry, newPrefix, populatedLocalizedEntryVal);
            } else {
              set(populatedEntry, newPrefix, value);
            }
          } else {
            await populateEntry(
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
        const inCreateUpdateEntry = get(createUpdateEntry, prefix);
        const isMissingInCreateUpdateEntry = !!(typeof inCreateUpdateEntry === 'undefined' || inCreateUpdateEntry === null);
        if (isMissingInCreateUpdateEntry) {
          set(populatedEntry, prefix, partialBaseEntry);
        }
      }
    } else {
      // ? TODO: something unknown
      console.info(`Unknown type processed: ${partialBaseEntry}`);
    }
  }

  const model = findModel(models, uid);
  await populateEntry(baseEntry, model);

  return populatedEntry;
};

module.exports = populateCreateUpdateEntryWithBaseEntry;
