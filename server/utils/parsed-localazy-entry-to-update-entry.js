"use strict";

const merge = require("lodash/merge");
const parsedLocalazyEntryToCreateEntry = require("./parsed-localazy-entry-to-create-entry");
const omitDeep = require("./omit-deep");
const populateCreateUpdateEntryWithBaseEntry = require("./populate-create-update-entry-with-base-entry");

const parsedLocalazyEntryToUpdateEntry = (
  allModels,
  localazyEntry,
  currentEntry,
  baseEntry,
  uid
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
  // updateEntry.carousel = baseEntry.carousel;
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
  const populatedEntry = populateCreateUpdateEntryWithBaseEntry(
    allModels,
    updateEntry,
    filteredBaseEntry,
    uid
  );

  // return updateEntry;
  return populatedEntry;
};

module.exports = parsedLocalazyEntryToUpdateEntry;
