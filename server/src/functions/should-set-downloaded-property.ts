import { get } from 'lodash-es';
import type {
  ModelContentTransferSetup,
  ModelContentTransferSetupDZFields,
} from '../models/plugin/content-transfer-setup';

export const hasDynamicZoneKeySegment = (parsedKey: string[]): boolean => {
  return parsedKey.some((segment) => segment.includes(';'));
};

export const getDynamicZoneKeySegment = (parsedKey: string[]): string | undefined => {
  return parsedKey.find((segment) => segment.includes(';'));
};

export const getComponentNameFromDynamicZoneKeySegment = (dynamicZoneKeySegment: string): string => {
  return dynamicZoneKeySegment.split(';')[1];
};

export const getDynamicZoneKeySegmentIndex = (parsedKey: string[]): number => {
  return parsedKey.findIndex((segment) => segment.includes(';'));
};

export const getDynamicZonePropertyName = (parsedKey: string[]): string | undefined => {
  const dynamicZoneKeySegmentIndex = getDynamicZoneKeySegmentIndex(parsedKey);

  if (dynamicZoneKeySegmentIndex === -1) {
    return undefined;
  }

  return parsedKey[dynamicZoneKeySegmentIndex - 1];
};

export enum ShouldSetDownloadedPropertyReturnType {
  YES = 'yes',
  NO = 'no',
  JSON = 'json',
}

/**
 * Locate the field a downloaded key belongs to, using the Content Transfer Setup.
 *
 * - `YES`: the key is a plain field enabled for transfer (the field is the key's last segment).
 * - `JSON`: the key is one leaf of an enabled `json` or `blocks` field, which the upload flattens
 *   into one key per leaf; `fieldSegmentIndex` is the index in `parsedKeyRest` of the segment
 *   naming that field. Everything before it is the path to the entry or component owning the
 *   field (dynamic zone `id;component` segments and component ids included); everything after it
 *   is the leaf's path inside the field's value, e.g. for
 *   `beats[3;about.timeline].stops[10].notes[0].children[0].text` the field is `notes` (index 4)
 *   of stop 10 of timeline 3, and for `tags[0]` or `years.2024` it is `tags` / `years` (index 0).
 * - `NO`: anything else (field disabled or unknown, component gone, model not set up).
 */
export const locateDownloadedField = (
  modelContentTransferSetup: ModelContentTransferSetup,
  parsedKeyRest: string[]
): { type: ShouldSetDownloadedPropertyReturnType; fieldSegmentIndex: number } => {
  const notFound = { type: ShouldSetDownloadedPropertyReturnType.NO, fieldSegmentIndex: -1 };
  if (!modelContentTransferSetup.__model__) {
    return notFound;
  }

  let setupModel: unknown = modelContentTransferSetup;
  let startIndex = 0;

  if (hasDynamicZoneKeySegment(parsedKeyRest)) {
    const dynamicZoneKeySegmentIndex = getDynamicZoneKeySegmentIndex(parsedKeyRest);
    const componentName = getComponentNameFromDynamicZoneKeySegment(parsedKeyRest[dynamicZoneKeySegmentIndex]);
    const dzContentTransferSetupModel = get(
      modelContentTransferSetup,
      getDynamicZonePropertyName(parsedKeyRest)
    ) as ModelContentTransferSetupDZFields[];
    if (!Array.isArray(dzContentTransferSetupModel)) {
      return notFound;
    }
    setupModel = dzContentTransferSetupModel.find((c) => c.__component__ === componentName);
    if (!setupModel) {
      return notFound;
    }
    startIndex = dynamicZoneKeySegmentIndex + 1;
  }

  // positions of the named (non-numeric) segments; numeric ones are array positions or component ids
  const namedSegmentIndexes: number[] = [];
  for (let index = startIndex; index < parsedKeyRest.length; index++) {
    if (isNaN(parseInt(parsedKeyRest[index]))) {
      namedSegmentIndexes.push(index);
    }
  }

  // the longest named path enabled in the setup is the field
  for (let length = namedSegmentIndexes.length; length > 0; length--) {
    const fieldPath = namedSegmentIndexes.slice(0, length).map((index) => parsedKeyRest[index]);
    if (get(setupModel, fieldPath) === true) {
      const fieldSegmentIndex = namedSegmentIndexes[length - 1];
      // anything after the field's own segment is a path inside a json/blocks value
      const type =
        fieldSegmentIndex === parsedKeyRest.length - 1
          ? ShouldSetDownloadedPropertyReturnType.YES
          : ShouldSetDownloadedPropertyReturnType.JSON;
      return { type, fieldSegmentIndex };
    }
  }

  return notFound;
};

export const shouldSetDownloadedProperty = (
  modelContentTransferSetup: ModelContentTransferSetup,
  parsedKeyRest: string[]
): ShouldSetDownloadedPropertyReturnType => {
  return locateDownloadedField(modelContentTransferSetup, parsedKeyRest).type;
};

/** Index of the `json`/`blocks` field's own segment in `parsedKeyRest`, or -1 (see `locateDownloadedField`). */
export const getJsonFieldSegmentIndex = (
  modelContentTransferSetup: ModelContentTransferSetup,
  parsedKeyRest: string[]
): number => {
  const { type, fieldSegmentIndex } = locateDownloadedField(modelContentTransferSetup, parsedKeyRest);
  return type === ShouldSetDownloadedPropertyReturnType.JSON ? fieldSegmentIndex : -1;
};
