import { set, get } from 'lodash-es';
import { resetArrayKeysDeep } from './reset-array-keys-deep';
import { getAttribute, isComponent, isDynamicZone, isRepeatable, findModel } from './model-utils';

/**
 * Items positioning is done by the `toCreateEntry` function
 */
export const parsedLocalazyEntryToCreateEntry = (
  models: any,
  parsedLocalazyEntry: any,
  baseEntry: any,
  uid: string,
  locale = ''
) => {
  const createEntry: Record<string, any> = {};
  const repeatableComponentsKeystoFilter = [];
  const dynamicZoneComponentKeys = [];

  const toCreateEntry = (
    entry: any,
    model: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    key = '',
    prefix = '',
    component = '',
    isRepeatableComponent = false,
    isDZ = false,
    isInsideDZ = false
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
              const localizedEntryRepeatableItemPosition = baseEntryRepeateableGroup.findIndex(
                (repeatableItem) => !!repeatableItem && repeatableItem.id === baseEntryRepeatableItemId
              );
              if (localizedEntryRepeatableItemPosition > -1) {
                toCreateEntry(
                  value,
                  model,
                  localizedEntryRepeatableItemPosition,
                  `${prefix}.${localizedEntryRepeatableItemPosition}`,
                  component
                );
              }
            }
          }

          if (component && !isRepeatableComponent) {
            toCreateEntry(value, model, `${prefix}`, `${prefix}`);
          }

          if (!component && isRepeatableComponent) {
            // used for indices filtering in dynamic zones
            if (!repeatableComponentsKeystoFilter.includes(prefix)) {
              repeatableComponentsKeystoFilter.push(prefix);
            }
            const baseEntryRepeatableItemId = parseInt(baseEntryItemId);
            const baseEntryRepeateableGroup = get(baseEntry, prefix);
            if (baseEntryRepeateableGroup !== undefined) {
              const localizedEntryRepeatableItemPosition = baseEntryRepeateableGroup.findIndex(
                (repeatableItem) => !!repeatableItem && repeatableItem.id === baseEntryRepeatableItemId
              );
              if (localizedEntryRepeatableItemPosition > -1) {
                const dzEntry = get(baseEntry, prefix).find((v) => v.id === baseEntryRepeatableItemId);
                const dzEntryComponent = dzEntry.__component;
                const dzEntryComponentModel = findModel(models, dzEntryComponent);
                toCreateEntry(
                  value,
                  dzEntryComponentModel,
                  localizedEntryRepeatableItemPosition,
                  `${prefix}.${localizedEntryRepeatableItemPosition}`,
                  dzEntryComponent,
                  true,
                  true
                );
              }
            }
          }
        }
      });
    } else if (isDZ) {
      Object.entries(entry).forEach(([dzEntryIdWithComponent, value]) => {
        const [dzEntryId, dzEntryComponent] = dzEntryIdWithComponent.split(';');
        const parsedDzEntryId = parseInt(dzEntryId);
        const baseEntryDZEntry = get(baseEntry, prefix).find(
          (v) => v.id === parsedDzEntryId && v.__component === dzEntryComponent
        );
        if (baseEntryDZEntry !== undefined) {
          const dzEntryComponentModel = findModel(models, dzEntryComponent);
          toCreateEntry(
            value,
            dzEntryComponentModel,
            dzEntryId,
            `${prefix}.${dzEntryId}`,
            dzEntryComponent,
            true,
            false, // we're already inside, so it's falsy
            true
          );
        }
        /**
         * Don't do anything if `baseEntryDZEntry` is `undefined` - it means that the entry was deleted
         * That also automatically presumes that deal with `undefined` `baseEntryDZIndex` inside the Dynamic Zone
         */
      });
    } else {
      // is object
      Object.entries(entry).forEach(([objectKey, value]) => {
        const attribute = getAttribute(model, objectKey);
        if (attribute === undefined) {
          // logicaly don't anything, skip...
        } else if (isComponent(attribute)) {
          // is component
          const innerComponent = attribute.component;
          const componentModel = findModel(models, innerComponent);

          let newPrefixBase = prefix;
          let newPrefix = newPrefixBase ? `${newPrefixBase}.${objectKey}` : `${objectKey}`;
          if (isInsideDZ) {
            const [dzParamKey, dzEntryId] = newPrefixBase.split('.');
            const parsedDzEntryId = parseInt(dzEntryId);
            const baseEntryDZIndex = get(baseEntry, dzParamKey).findIndex(
              (v) => v.__component === component && v.id === parsedDzEntryId
            );
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
            objectKey,
            newPrefix,
            innerComponent,
            isRepeatableComponent,
            false,
            isInsideDZ
          );
        } else if (isDynamicZone(attribute)) {
          // behaves sort of like repeatable component
          const newPrefix = prefix ? `${prefix}.${objectKey}` : `${objectKey}`;
          toCreateEntry(
            value,
            null, // model is evaluated later as it's dynamic (DZ)
            objectKey,
            newPrefix,
            '', // component is computed later as it's dynamic (DZ)
            true,
            true
          );
        } else {
          let newPrefixBase = prefix;
          let newPrefix = newPrefixBase ? `${newPrefixBase}.${objectKey}` : `${objectKey}`;
          if (isInsideDZ) {
            const [dzParamKey, dzEntryId] = newPrefixBase.split('.');
            const parsedDzEntryId = parseInt(dzEntryId);
            const baseEntryDZIndex = get(baseEntry, dzParamKey).findIndex(
              (v) => v.__component === component && v.id === parsedDzEntryId
            );
            newPrefixBase = `${dzParamKey}.${baseEntryDZIndex}`;
            newPrefix = `${newPrefixBase}.${objectKey}`;
          }
          set(createEntry, newPrefix, value);

          if (component) {
            const componentKeyToSet = `${newPrefixBase}.__component`;
            set(createEntry, componentKeyToSet, component);

            if (isInsideDZ) {
              const isKeyAdded =
                typeof dynamicZoneComponentKeys.find((v) => v.key === componentKeyToSet) !== 'undefined';
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
  toCreateEntry(parsedLocalazyEntry, model);
  if (locale) {
    createEntry.locale = locale;
  }

  resetArrayKeysDeep(createEntry, repeatableComponentsKeystoFilter);
  return { createEntry, dynamicZoneComponentKeys };
};

module.exports = parsedLocalazyEntryToCreateEntry;
