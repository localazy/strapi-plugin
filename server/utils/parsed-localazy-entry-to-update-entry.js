"use strict";

const merge = require("lodash/merge");
const parsedLocalazyEntryToCreateEntry = require("./parsed-localazy-entry-to-create-entry");
const omitDeep = require("./omit-deep");
const populateCreateUpdateEntryWithBaseEntry = require("./populate-create-update-entry-with-base-entry");

const parsedLocalazyEntryToUpdateEntry = async (
  allModels,
  localazyEntry,
  fullyPopulatedLocalizedEntry,
  currentEntry,
  baseEntry,
  uid,
  locale
) => {
  const createEntry = parsedLocalazyEntryToCreateEntry(
    allModels,
    localazyEntry,
    baseEntry,
    uid
  );

  let updateEntry = {};
  merge(updateEntry, currentEntry, createEntry);
  updateEntry = omitDeep(updateEntry, [
    "__component",
    "locale",
    "localizations",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy",
    "publishedAt",
  ]);

  /* TODO:
  * need models
  * updateEntry
  * baseEntry
  * content transfer setup
  * create function where fields will be assigned based on setup
  */

  const filteredBaseEntry = omitDeep(baseEntry, [
    // "__component",
    "locale",
    "localizations",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy",
    "publishedAt",
  ]);
  const filteredFullyPopulatedLocalizedEntry = omitDeep(fullyPopulatedLocalizedEntry, [
    // "__component",
    "locale",
    "localizations",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy",
    "publishedAt",
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

module.exports = parsedLocalazyEntryToUpdateEntry;
