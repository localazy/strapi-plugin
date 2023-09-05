"use strict";

const parsedLocalazyEntryToCreateEntry = require("../utils/parsed-localazy-entry-to-create-entry");
const parsedLocalazyEntryToUpdateEntry = require("../utils/parsed-localazy-entry-to-update-entry");
const omitDeep = require("../utils/omit-deep");
const { set, merge } = require("lodash");

module.exports = ({ strapi }) => ({
  async createEntry(
    ctx,
    uid,
    strapiContentTypesModels,
    translatedModel,
    baseEntry,
    isoStrapi,
  ) {
    // * The entry will be created and then updated as the structures differ
    // * It's one extra database call, but the complexity of recursive code to maintain does worth it


    // Strapi i18n Service
    const StrapiI18nService = strapi
      .plugin("localazy")
      .service("strapiI18nService");

    const { createEntry, dynamicZoneComponentKeys } = parsedLocalazyEntryToCreateEntry(
      strapiContentTypesModels,
      translatedModel,
      baseEntry,
      uid,
      isoStrapi,
    );

    // ? TODO do not omit the __component from Dynamic Zones
    const filteredBaseEntry = omitDeep(baseEntry, [
      // "__component", // do not omit the __component
      "locale",
      "localizations",
      "createdAt",
      "createdBy",
      "updatedAt",
      "updatedBy",
      "publishedAt",
    ]);

    let mergedCreateEntry = {};
    merge(mergedCreateEntry, filteredBaseEntry, createEntry);
    mergedCreateEntry = omitDeep(mergedCreateEntry, [
      // "__component",
      "locale",
      "localizations",
      "createdAt",
      "createdBy",
      "updatedAt",
      "updatedBy",
      "publishedAt",
    ]);
    // set dynamic zone compoonent keys again
    // dynamicZoneComponentKeys.forEach((v) => {
    //   set(mergedCreateEntry, v.key, v.component);
    // });

    mergedCreateEntry.locale = isoStrapi;
    const createdEntry =
      await StrapiI18nService.createLocalizationForAnExistingEntry(
        ctx,
        uid,
        baseEntry,
        mergedCreateEntry,
      );

    // await this.updateEntry(
    //   uid,
    //   createdEntry.id,
    //   strapiContentTypesModels,
    //   translatedModel,
    //   baseEntry,
    //   isoStrapi,
    // );

    return createdEntry;
  },

  async updateEntry(
    uid,
    localizedEntryId,
    strapiContentTypesModels,
    translatedModel,
    baseEntry,
    isoStrapi,
  ) {
    // Strapi Service
    const StrapiService = strapi
      .plugin("localazy")
      .service("strapiService");

    // Strapi i18n Service
    const StrapiI18nService = strapi
      .plugin("localazy")
      .service("strapiI18nService");

    const populate = await StrapiService.getPopulateObject(uid);
    const localizedEntry = await strapi.entityService.findOne(
      uid,
      localizedEntryId,
      {
        populate,
      }
    );

    const fullyPopulatedLocalizedEntry = await strapi.entityService.findOne(
      uid,
      localizedEntryId,
      {
        populate: "deep",
      }
    );

    const updateEntry = await parsedLocalazyEntryToUpdateEntry(
      strapiContentTypesModels,
      translatedModel,
      fullyPopulatedLocalizedEntry,
      localizedEntry,
      baseEntry,
      uid,
      isoStrapi
    );

    const updatedEntry = await StrapiI18nService.updateLocalizationForAnExistingEntry(
      uid,
      localizedEntryId,
      updateEntry
    );

    return updatedEntry;
  }
});
