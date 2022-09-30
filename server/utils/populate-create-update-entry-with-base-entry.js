"use strict";

const cloneDeep = require("lodash/cloneDeep");
const findModel = require("./find-model");
const set = require("lodash/set");
const get = require("lodash/get");

const isMedia = (attributeObj) => {
  return attributeObj.type === "media";
}

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
    prefix = ""
  ) => {
    if (Array.isArray(partialBaseEntry)) {
      // is array
      const attribute = getAttribute(model, objectKey);

      if (typeof attribute !== 'undefined') {
        const newPrefix = prefix ? `${prefix}.${objectKey}` : objectKey;
        const doesExistInCreateUpdateEntry = get(createUpdateEntry, `${prefix}.${objectKey}`);
        if (typeof doesExistInCreateUpdateEntry === 'undefined') {
          set(populatedEntry, `${prefix}.${objectKey}`, partialBaseEntry);
        } else {
          for (const [objectKey, value] of Object.entries(entry)) {
            populateEntry(
              value,
              model,
              objectKey,
              `${prefix}.${objectKey}`
            );
          }
        }
      }

    } else if (typeof partialBaseEntry === "object") {
      // is object
      for (const [objectKey, value] of Object.entries(partialBaseEntry)) {
        const attribute = getAttribute(model, objectKey);
        if (attribute === undefined) {
          // logicaly don't anything, skip...
          continue;
        }

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
        /*if (isMedia(attribute)) {
          // TODO: implement functionality
          console.log(`${objectKey} is a media type`);
          console.log(`${!!attribute.multiple ? 'multiple' : 'single'}`);
          console.log(`${!!attribute.pluginOptions?.i18n?.localized ? 'localized' : 'non-localized'}`);
        }*/
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
