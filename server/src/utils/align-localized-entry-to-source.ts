import { cloneDeep, isPlainObject } from 'lodash-es';
import { findModel } from './model-utils';

/** Remove the ids of components and dynamic zone items (not of media or relations) in place. */
const dropComponentIds = (models, item: any, model: any): void => {
  if (!isPlainObject(item)) {
    return;
  }
  delete item.id;
  for (const [name, attribute] of Object.entries<any>(model?.attributes || {})) {
    const value = item[name];
    if (attribute.type === 'component') {
      const componentModel = findModel(models, attribute.component);
      (Array.isArray(value) ? value : [value]).forEach((child) => dropComponentIds(models, child, componentModel));
    } else if (attribute.type === 'dynamiczone' && Array.isArray(value)) {
      value.forEach((child) => dropComponentIds(models, child, findModel(models, child?.__component)));
    }
  }
};

/** A source-locale item, ready to be written into the localization as a new component. */
const asNewComponent = (models, sourceItem: any, model: any) => {
  const copy = cloneDeep(sourceItem);
  dropComponentIds(models, copy, model);
  return copy;
};

/**
 * Downloaded values are positioned by the source-locale entry: the n-th repeatable component or
 * dynamic zone item of the source goes to the n-th item of the localization. That holds only while
 * both lists have the same layout. When the source list was changed (items added or removed,
 * dynamic zone components replaced or reordered), the localized list is rebuilt from the source
 * items instead of merging translations into unrelated items.
 *
 * Only lists that receive downloaded values (present in `downloadedEntry`) are aligned; other
 * localized values are kept as they are.
 */
export const alignLocalizedEntryToSource = (
  models,
  localizedEntry: any,
  sourceEntry: any,
  model: any,
  downloadedEntry: any
): any => {
  if (!isPlainObject(localizedEntry) || !isPlainObject(sourceEntry) || !isPlainObject(downloadedEntry)) {
    return localizedEntry;
  }

  const aligned = { ...localizedEntry };
  for (const [name, attribute] of Object.entries<any>(model?.attributes || {})) {
    const source = sourceEntry[name];
    const current = localizedEntry[name];
    const downloaded = downloadedEntry[name];
    if (downloaded === undefined || downloaded === null || current === undefined) {
      continue;
    }

    if (attribute.type === 'component') {
      const componentModel = findModel(models, attribute.component);
      if (attribute.repeatable) {
        if (!Array.isArray(source)) continue;
        const currentItems = Array.isArray(current) ? current : [];
        aligned[name] =
          currentItems.length === source.length
            ? currentItems.map((item, index) =>
                alignLocalizedEntryToSource(models, item, source[index], componentModel, downloaded[index])
              )
            : source.map((item) => asNewComponent(models, item, componentModel));
      } else if (isPlainObject(source) && isPlainObject(current)) {
        aligned[name] = alignLocalizedEntryToSource(models, current, source, componentModel, downloaded);
      }
    } else if (attribute.type === 'dynamiczone') {
      if (!Array.isArray(source)) continue;
      const currentItems = Array.isArray(current) ? current : [];
      const sameLayout =
        currentItems.length === source.length &&
        currentItems.every((item, index) => item?.__component === source[index]?.__component);
      aligned[name] = sameLayout
        ? currentItems.map((item, index) =>
            alignLocalizedEntryToSource(
              models,
              item,
              source[index],
              findModel(models, item.__component),
              downloaded[index]
            )
          )
        : source.map((item) => asNewComponent(models, item, findModel(models, item.__component)));
    }
  }
  return aligned;
};
