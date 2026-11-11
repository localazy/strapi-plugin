import { set, get } from 'lodash-es';
import { getAttribute, isComponent, isDynamicZone, isRepeatable, isBlocks, isJson, findModel } from './model-utils';
import { overlayBlocksTranslation } from './blocks-to-translatable';
import { overlayJsonTranslation } from './overlay-json-translation';

/**
 * Items positioning is done by the `toCreateEntry` function: repeatable component and dynamic
 * zone items are placed at their position in `baseEntry` (the source-locale entry), so arrays may
 * have holes for items without downloaded values. They are not compacted, because callers merge
 * the result onto a complete entry (the source entry, or the current localization), and shifting
 * items would put translations into the wrong item.
 *
 * `rebuiltFieldPaths` lists where blocks and json fields were written; each holds a complete value
 * rebuilt from the source value (see `overlayBlocksTranslation`, `overlayJsonTranslation`).
 */
export const parsedLocalazyEntryToCreateEntry = (
  models: any,
  parsedLocalazyEntry: any,
  baseEntry: any,
  uid: string,
  locale = ''
) => {
  const createEntry: Record<string, any> = {};
  const dynamicZoneComponentKeys = [];
  const rebuiltFieldPaths: string[] = [];

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
          // A blocks or json field arrives as its translated leaves. Rebuild the full value by
          // overlaying them onto the source-locale value, so structure, formatting and
          // non-translatable values come from the source. Skip when there is no source value to
          // overlay onto rather than write an invalid one.
          const isRebuiltField = isBlocks(attribute) || isJson(attribute);
          let valueToSet = value;
          if (isBlocks(attribute)) {
            valueToSet = overlayBlocksTranslation(get(baseEntry, newPrefix), value);
          } else if (isJson(attribute)) {
            valueToSet = overlayJsonTranslation(get(baseEntry, newPrefix), value);
          }
          if (valueToSet === undefined) {
            return;
          }
          set(createEntry, newPrefix, valueToSet);
          if (isRebuiltField) {
            rebuiltFieldPaths.push(newPrefix);
          }

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

  return { createEntry, dynamicZoneComponentKeys, rebuiltFieldPaths };
};
