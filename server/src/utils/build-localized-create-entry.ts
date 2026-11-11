import { merge } from 'lodash-es';
import { parsedLocalazyEntryToCreateEntry } from './parsed-localazy-entry-to-create-entry';
import { omitDeep } from './omit-deep';
import { dropDocumentIdExceptMedia } from './drop-property-deep';

const OMIT_KEYS = ['locale', 'localizations', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'publishedAt'];

/**
 * Data for creating a new localization of `baseEntry` (the source-locale entry) from the
 * translated model downloaded from Localazy: the source entry with the translated values put in
 * place. Items positioning is done by `parsedLocalazyEntryToCreateEntry`, so the two can be merged.
 */
export const buildLocalizedCreateEntry = (models, translatedModel, baseEntry, uid, isoStrapi: string) => {
  const { createEntry } = parsedLocalazyEntryToCreateEntry(models, translatedModel, baseEntry, uid, isoStrapi);

  // TODO: Deal with relations - must be omitted
  // Drop documentId from all objects except media objects (images, files, etc.)
  const filteredBaseEntry = dropDocumentIdExceptMedia(omitDeep(baseEntry, OMIT_KEYS));

  let mergedCreateEntry: Record<string, any> = {};
  merge(mergedCreateEntry, filteredBaseEntry, createEntry);
  mergedCreateEntry = omitDeep(mergedCreateEntry, OMIT_KEYS);
  mergedCreateEntry.locale = isoStrapi;

  return mergedCreateEntry;
};
