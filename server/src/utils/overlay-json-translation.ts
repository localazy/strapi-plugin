import { cloneDeep, get, isPlainObject } from 'lodash-es';

/**
 * The key segment `flattenObject` uses for an array item: `id;__component` for component-like
 * objects, else the item's `documentId` or `id`, else its index.
 */
const arrayItemSegment = (item: any, index: number): string => {
  if (isPlainObject(item) && item.id && item.__component) {
    return `${item.id};${item.__component}`;
  }
  return String(item?.documentId || item?.id || index);
};

/** `flattenObject` adds an object's own `documentId` / `id` as an extra key segment. */
const objectIdSegment = (value: any): string | undefined => {
  if (isPlainObject(value) && (value.documentId || value.id)) {
    return String(value.documentId || value.id);
  }
  return undefined;
};

const overlayValue = (source: any, translated: any): any => {
  if (typeof source === 'string') {
    return typeof translated === 'string' ? translated : source;
  }

  if (Array.isArray(source)) {
    // an array item's id already is its segment; it is not added a second time
    return source.map((item, index) => overlayValue(item, get(translated, [arrayItemSegment(item, index)])));
  }

  if (isPlainObject(source)) {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(source)) {
      // never uploaded (`flattenObject` skips them), so never translated
      result[key] = key === 'id' || key === 'documentId' ? value : overlayChild(value, get(translated, [key]));
    }
    return result;
  }

  // numbers, booleans, null: not translatable
  return source;
};

const overlayChild = (source: any, translated: any): any => {
  const idSegment = Array.isArray(source) ? undefined : objectIdSegment(source);
  return overlayValue(source, idSegment ? get(translated, [idSegment]) : translated);
};

/**
 * Download side of a `json` field. On upload, every leaf of the source-locale value becomes one
 * Localazy key (see `flattenObject`); `translated` is those leaves put back together by key path.
 * The result is a copy of the source value with each string leaf replaced by its translation, so
 * its shape (objects vs arrays, numeric keys, non-string values) always matches the source, leaves
 * that are no longer in the source are ignored, and untranslated leaves keep the source text.
 *
 * Returns `undefined` when there is no source value to overlay onto.
 */
export const overlayJsonTranslation = (sourceValue: any, translated: any): any => {
  if (sourceValue === undefined || sourceValue === null) {
    return undefined;
  }
  if (typeof sourceValue !== 'object') {
    return typeof sourceValue === 'string' && typeof translated === 'string' ? translated : sourceValue;
  }
  return overlayChild(cloneDeep(sourceValue), translated);
};
