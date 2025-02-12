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

export const shouldSetDownloadedProperty = (
  modelContentTransferSetup: ModelContentTransferSetup,
  parsedKeyRest: string[]
): ShouldSetDownloadedPropertyReturnType => {
  if (!modelContentTransferSetup.__model__) {
    return ShouldSetDownloadedPropertyReturnType.NO;
  }

  if (hasDynamicZoneKeySegment(parsedKeyRest)) {
    const dynamicZonePropertyName = getDynamicZonePropertyName(parsedKeyRest);
    const componentName = getComponentNameFromDynamicZoneKeySegment(getDynamicZoneKeySegment(parsedKeyRest));

    const dzContentTransferSetupModel = get(
      modelContentTransferSetup,
      dynamicZonePropertyName
    ) as ModelContentTransferSetupDZFields[];
    if (!Array.isArray(dzContentTransferSetupModel)) {
      return ShouldSetDownloadedPropertyReturnType.NO;
    }

    const dzContentTransferSetupComponentModel = dzContentTransferSetupModel.find(
      (c) => c.__component__ === componentName
    );

    if (!dzContentTransferSetupComponentModel) {
      return ShouldSetDownloadedPropertyReturnType.NO;
    }

    const dynamicZoneKeySegmentIndex = getDynamicZoneKeySegmentIndex(parsedKeyRest);
    const slicedParsedKeyRest = parsedKeyRest.slice(dynamicZoneKeySegmentIndex + 1);
    const filteredSlicedParsedKeyRest = slicedParsedKeyRest.filter((segment) => isNaN(parseInt(segment)));

    if (get(dzContentTransferSetupComponentModel, filteredSlicedParsedKeyRest) === true) {
      return ShouldSetDownloadedPropertyReturnType.YES;
    }

    // json fields
    while (filteredSlicedParsedKeyRest.length > 0) {
      // last segment out
      filteredSlicedParsedKeyRest.pop();
      if (get(dzContentTransferSetupComponentModel, filteredSlicedParsedKeyRest) === true) {
        return ShouldSetDownloadedPropertyReturnType.JSON;
      }
    }

    return ShouldSetDownloadedPropertyReturnType.NO;
  } else {
    const filteredParsedKeyRest = parsedKeyRest.filter((partialKey) => isNaN(parseInt(partialKey)));

    if (get(modelContentTransferSetup, filteredParsedKeyRest) === true) {
      return ShouldSetDownloadedPropertyReturnType.YES;
    }

    // json fields
    while (filteredParsedKeyRest.length > 0) {
      // last segment out
      filteredParsedKeyRest.pop();
      if (get(modelContentTransferSetup, filteredParsedKeyRest) === true) {
        return ShouldSetDownloadedPropertyReturnType.JSON;
      }
    }

    return ShouldSetDownloadedPropertyReturnType.NO;
  }
};
