"use strict";

const merge = require("lodash/merge");
const parsedLocalazyEntryToCreateEntry = require("./parsed-localazy-entry-to-create-entry");
const omitDeep = require("./omit-deep");

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
  let updateEntry = merge(currentEntry, createEntry);
  updateEntry = omitDeep(updateEntry, [
    "__component",
    "locale",
    "localizations",
    "createdAt",
    "updatedAt",
    "publishedAt",
  ]);

  return updateEntry;
};

module.exports = parsedLocalazyEntryToUpdateEntry;
