import { set, merge } from 'lodash-es';
import { parsedLocalazyEntryToCreateEntry } from './parsed-localazy-entry-to-create-entry';
import { omitDeep } from './omit-deep';
import { populateCreateUpdateEntryWithBaseEntry } from './populate-create-update-entry-with-base-entry';

export const parsedLocalazyEntryToUpdateEntry = async (
  allModels,
  localazyEntry,
  fullyPopulatedLocalizedEntry,
  currentEntry,
  baseEntry,
  uid,
  locale
) => {
  const { createEntry, dynamicZoneComponentKeys } = parsedLocalazyEntryToCreateEntry(
    allModels,
    localazyEntry,
    baseEntry,
    uid
  );

  /**
   * TODO: possibly improve for the following case:
   * A `key` is deleted from the base entry, and the same `key` still exist in the localized entry.
   * Even though the `key` is deprecated in Localazy, it concludes that the `key` is still used in the localized entry.
   * Therefore, it leads to an error when updating the entry.
   *
   * The solution for now: Delete the localized entry and re-download to force the creation process.
   */
  let updateEntry = {};
  merge(updateEntry, currentEntry, createEntry);
  updateEntry = omitDeep(updateEntry, [
    // '__component', // do not omit the __component
    'locale',
    'localizations',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'publishedAt',
  ]);
  // set dynamic zone component keys again
  dynamicZoneComponentKeys.forEach((v) => {
    set(updateEntry, v.key, v.component);
  });

  const filteredBaseEntry = omitDeep(baseEntry, [
    // "__component", // do not omit the __component
    'locale',
    'localizations',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'publishedAt',
  ]);
  const filteredFullyPopulatedLocalizedEntry = omitDeep(fullyPopulatedLocalizedEntry, [
    // "__component", // do not omit the __component
    'locale',
    'localizations',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'publishedAt',
  ]);
  const populatedEntry = await populateCreateUpdateEntryWithBaseEntry(
    allModels,
    updateEntry,
    filteredBaseEntry,
    filteredFullyPopulatedLocalizedEntry,
    uid,
    locale
  );

  // return updateEntry;
  return populatedEntry;
};
