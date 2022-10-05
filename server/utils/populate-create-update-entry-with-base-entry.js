"use strict";

const cloneDeep = require("lodash/cloneDeep");
const findModel = require("./find-model");
const set = require("lodash/set");
const get = require("lodash/get");
const isEmpty = require("lodash/isEmpty");

// TODO: move to external function set
const isComponent = (attributeObj) => {
  return attributeObj.type === "component";
};

// TODO: move to external function set
const isRelation = (attributeObj) => {
  return attributeObj.type === "relation" && attributeObj.target !== "plugin::upload.file";
}

// TODO: move to external function set
const isRepeatable = (attributeObj) => {
  return isComponent(attributeObj) && !!attributeObj.repeatable;
};

// TODO: move to external function set
const getAttribute = (model, attribute) => {
  const attributeObj = model.attributes[attribute];
  return attributeObj;
};

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
        const newPrefix = prefix ? `${prefix}.${objectKey}` : objectKey;
        const doesExistInCreateUpdateEntry = get(createUpdateEntry, newPrefix);
        // TODO: decide whether add || doesExistInCreateUpdateEntry === null to the condition
        if (typeof doesExistInCreateUpdateEntry === 'undefined') {
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
          // TODO: is this okay?
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
            doesExistInCreateUpdateEntry = (typeof inCreateUpdateEntry === 'undefined') || (inCreateUpdateEntry && !inCreateUpdateEntry.length);
          } else {
            doesExistInCreateUpdateEntry = (typeof inCreateUpdateEntry === 'undefined' || inCreateUpdateEntry === null);
          }

          // TODO: double check & update the condition
          if (!!doesExistInCreateUpdateEntry) {
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
          }// else {
          await populateEntry(
            value,
            componentModel,
            objectKey,
            newPrefix,
            component,
            isRepeatable(attribute),
          );
          //}
        } else if (isRelation(attribute)) {
          // check whether is set on populatedEntry
          const newPrefix = prefix ? `${prefix}.${objectKey}` : objectKey;
          const populatedLocalizedEntryVal = get(populatedLocalizedEntry, newPrefix);
          if (doesExistInPopulatedLocalizedEntry(populatedLocalizedEntryVal)) {
            // skip
            continue;
          }

          const isArray = Array.isArray(value);
          let arraiedValue = value;
          if (!isArray) {
            // TODO: should I make a deep copy?
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
          const newPrefix = prefix ? `${prefix}.${objectKey}` : objectKey;
          const doesExistInCreateUpdateEntry = get(createUpdateEntry, newPrefix);
          if (typeof doesExistInCreateUpdateEntry === 'undefined' || doesExistInCreateUpdateEntry === null) {
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
  await populateEntry(baseEntry, model);

  return populatedEntry;
};

module.exports = populateCreateUpdateEntryWithBaseEntry;
