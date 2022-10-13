"use strict";

const parsedLocalazyEntryToCreateEntry = require("../utils/parsed-localazy-entry-to-create-entry");
const parsedLocalazyEntryToUpdateEntry = require("../utils/parsed-localazy-entry-to-update-entry");

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

    const createEntry = parsedLocalazyEntryToCreateEntry(
      strapiContentTypesModels,
      translatedModel,
      baseEntry,
      uid,
      isoStrapi,
    );

    const createdEntry =
      await StrapiI18nService.createLocalizationForAnExistingEntry(
        ctx,
        uid,
        baseEntry,
        createEntry,
      );

    await this.updateEntry(
      uid,
      createdEntry.id,
      strapiContentTypesModels,
      translatedModel,
      baseEntry,
      isoStrapi,
    );

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
