import { set, get, merge, cloneDeep } from 'lodash-es';
import { parsedLocalazyEntryToCreateEntry } from './parsed-localazy-entry-to-create-entry';
import { omitDeep } from './omit-deep';
import { populateCreateUpdateEntryWithBaseEntry } from './populate-create-update-entry-with-base-entry';
import { alignLocalizedEntryToSource } from './align-localized-entry-to-source';
import { findModel } from './model-utils';

export const parsedLocalazyEntryToUpdateEntry = async (
  allModels,
  localazyEntry,
  fullyPopulatedLocalizedEntry,
  currentEntry,
  baseEntry,
  uid,
  locale
) => {
  const { createEntry, dynamicZoneComponentKeys, rebuiltFieldPaths } = parsedLocalazyEntryToCreateEntry(
    allModels,
    localazyEntry,
    baseEntry,
    uid
  );

  // Downloaded values are positioned by the source entry; lists whose layout changed in the source
  // are rebuilt from it before merging (see `alignLocalizedEntryToSource`).
  const model = findModel(allModels, uid);
  const alignedCurrentEntry = alignLocalizedEntryToSource(allModels, currentEntry, baseEntry, model, createEntry);

  let updateEntry = {};
  merge(updateEntry, alignedCurrentEntry, createEntry);
  // A downloaded blocks or json field is a complete value rebuilt from the current source value.
  // Replace the localized one instead of deep-merging into it, which would keep marks, nodes,
  // paragraphs and keys that no longer exist in the source.
  for (const rebuiltFieldPath of rebuiltFieldPaths) {
    set(updateEntry, rebuiltFieldPath, cloneDeep(get(createEntry, rebuiltFieldPath)));
  }
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
  const filteredFullyPopulatedLocalizedEntry = omitDeep(
    alignLocalizedEntryToSource(allModels, fullyPopulatedLocalizedEntry, baseEntry, model, createEntry),
    [
      // "__component", // do not omit the __component
      'locale',
      'localizations',
      'createdAt',
      'createdBy',
      'updatedAt',
      'updatedBy',
      'publishedAt',
    ]
  );
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
