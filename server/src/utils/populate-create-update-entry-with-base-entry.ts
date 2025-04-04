import { cloneDeep, set, get, isEmpty } from 'lodash-es';
import { getAttribute, isComponent, isRepeatable, isDynamicZone, isRelation, findModel } from './model-utils';

const doesExistInPopulatedLocalizedEntry = (val) => {
  if (Array.isArray(val)) {
    // is array
    return !!val.length;
  }

  if (typeof val === 'object') {
    // is object
    return !isEmpty(val);
  }

  if (val !== Object(val)) {
    // is primitive
    return !!val;
  }
};

const getNewPrefix = (objectKey, prefix) => {
  return prefix ? `${prefix}.${objectKey}` : objectKey;
};

export const populateCreateUpdateEntryWithBaseEntry = async (
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
    objectKey = '',
    prefix = '',
    component = '',
    isRepeatableComponent = false,
    isDZ = false
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
          const entry = partialBaseEntry; // TODO: really needed?
          for (const [objectKey, value] of Object.entries(entry)) {
            await populateEntry(value, model, objectKey, newPrefix);
          }
        }
      } else if (!component && isRepeatableComponent && isDZ) {
        Object.entries(partialBaseEntry).forEach(async ([partialBaseEntryItemIndex, partialBaseEntryItem]) => {
          const component = partialBaseEntryItem.__component;
          const model = findModel(models, component);
          const newPrefix = `${prefix}.${partialBaseEntryItemIndex}`;
          await populateEntry(partialBaseEntryItem, model, partialBaseEntryItemIndex, newPrefix);
        });
      } else if (component && isRepeatableComponent) {
        Object.entries(partialBaseEntry).forEach(async ([partialBaseEntryItemIndex, partialBaseEntryItem]) => {
          const newPrefix = `${prefix}.${partialBaseEntryItemIndex}`;
          await populateEntry(partialBaseEntryItem, model, partialBaseEntryItemIndex, newPrefix);
        });
      }
    } else if (typeof partialBaseEntry === 'object') {
      // is object
      if (partialBaseEntry === null) {
        partialBaseEntry = {};
      }

      for (const [objectKey, value] of Object.entries(partialBaseEntry)) {
        const attribute = getAttribute(model, objectKey);
        if (typeof attribute === 'undefined' && objectKey === '__component') {
          const newPrefix = getNewPrefix(objectKey, prefix);
          set(populatedEntry, newPrefix, value);
        } else if (typeof attribute === 'undefined') {
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
            isMissingInCreateUpdateEntry = !!(
              typeof inCreateUpdateEntry === 'undefined' ||
              (inCreateUpdateEntry && !inCreateUpdateEntry.length)
            );
          } else {
            isMissingInCreateUpdateEntry = !!(
              typeof inCreateUpdateEntry === 'undefined' || inCreateUpdateEntry === null
            );
          }

          if (isMissingInCreateUpdateEntry) {
            const populatedLocalizedEntryVal = get(populatedLocalizedEntry, newPrefix);
            let valueToSet: any = value;
            if (doesExistInPopulatedLocalizedEntry(populatedLocalizedEntryVal)) {
              valueToSet = populatedLocalizedEntryVal;
            }
            if (isRepeatable(attribute)) {
              valueToSet = (value as any[]).map((item) => {
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
          await populateEntry(value, componentModel, objectKey, newPrefix, component, isRepeatable(attribute));
        } else if (isDynamicZone(attribute)) {
          // is dynamic zone
          const newPrefix = getNewPrefix(objectKey, prefix);
          const inCreateUpdateEntry = get(createUpdateEntry, newPrefix);
          const isMissingInCreateUpdateEntry = !!(
            typeof inCreateUpdateEntry === 'undefined' ||
            (inCreateUpdateEntry && !inCreateUpdateEntry.length)
          );

          if (isMissingInCreateUpdateEntry) {
            const populatedLocalizedEntryVal = get(populatedLocalizedEntry, newPrefix);
            let valueToSet = value;
            if (doesExistInPopulatedLocalizedEntry(populatedLocalizedEntryVal)) {
              valueToSet = populatedLocalizedEntryVal;
            }
            valueToSet = (value as any[]).map((item) => {
              delete item.id;
              return {
                __component: component,
                ...item,
              };
            });
            set(populatedEntry, newPrefix, valueToSet);
          }
          await populateEntry(
            value,
            '', // model is evaluated later as it's dynamic (DZ)
            objectKey,
            newPrefix,
            '', // component is computed later as it's dynamic (DZ)
            true,
            true
          );
          // }
        } else if (isRelation(attribute)) {
          // TODO: based on the plugin settings, assign/not assign the relation (documentId)
          const newPrefix = getNewPrefix(objectKey, prefix);

          const isArray = Array.isArray(value);
          let arraiedValue = value;
          if (!isArray) {
            arraiedValue = [value];
          }
          const localizedDocumentIds = [];
          for (const item of Object.values(arraiedValue)) {
            if (!isEmpty(item)) {
              const documentId = item.documentId;
              if (!!documentId) {
                const localizedEntry = await strapi.documents(attribute.target).findOne({
                  documentId,
                  locale,
                });
                if (localizedEntry) {
                  localizedDocumentIds.push(localizedEntry.documentId);
                }
              }
            }
          }
          if (localizedDocumentIds.length > 0) {
            set(populatedEntry, newPrefix, localizedDocumentIds);
          }
        } else {
          const newPrefix = getNewPrefix(objectKey, prefix);
          const inCreateUpdateEntry = get(createUpdateEntry, newPrefix);
          const isMissingInCreateUpdateEntry = !!(
            typeof inCreateUpdateEntry === 'undefined' || inCreateUpdateEntry === null
          );
          if (isMissingInCreateUpdateEntry) {
            const populatedLocalizedEntryVal = get(populatedLocalizedEntry, newPrefix);
            if (doesExistInPopulatedLocalizedEntry(populatedLocalizedEntryVal)) {
              set(populatedEntry, newPrefix, populatedLocalizedEntryVal);
            } else {
              set(populatedEntry, newPrefix, value);
            }
          } else {
            await populateEntry(value, model, objectKey, newPrefix);
          }
        }
      }
    } else if (partialBaseEntry !== Object(partialBaseEntry)) {
      // is primitive/literal
      const attribute = getAttribute(model, objectKey);
      if (typeof attribute !== 'undefined') {
        const inCreateUpdateEntry = get(createUpdateEntry, prefix);
        const isMissingInCreateUpdateEntry = !!(
          typeof inCreateUpdateEntry === 'undefined' || inCreateUpdateEntry === null
        );
        if (isMissingInCreateUpdateEntry) {
          set(populatedEntry, prefix, partialBaseEntry);
        }
      }
    } else {
      // ? TODO: something unknown
      console.info(`Unknown type processed: ${partialBaseEntry}`);
    }
  };

  const model = findModel(models, uid);
  await populateEntry(baseEntry, model);

  return populatedEntry;
};
