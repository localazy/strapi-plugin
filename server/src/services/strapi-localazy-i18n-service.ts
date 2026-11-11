import { buildLocalizedCreateEntry } from '../utils/build-localized-create-entry';
import { parsedLocalazyEntryToUpdateEntry } from '../utils/parsed-localazy-entry-to-update-entry';
import { Core, UID } from '@strapi/strapi';
import { getStrapiI18nService /*, getStrapiService*/ } from '../core';
// TODO: ADD TYPES

const StrapiLocalazyI18nService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async createEntry(uid: UID.ContentType, strapiContentTypesModels, translatedModel, baseEntry, isoStrapi) {
    // * The entry will be created and then updated as the structures differ
    // * It's one extra database call, but the amount of recursive code's complexity is reduced

    // Strapi i18n Service
    const StrapiI18nService = getStrapiI18nService();

    const mergedCreateEntry = buildLocalizedCreateEntry(
      strapiContentTypesModels,
      translatedModel,
      baseEntry,
      uid,
      isoStrapi
    );

    const createdEntry = await StrapiI18nService.createLocalizationForAnExistingEntry(
      uid,
      baseEntry,
      mergedCreateEntry
    );

    // await this.updateEntry(uid, createdEntry.id, strapiContentTypesModels, translatedModel, baseEntry, isoStrapi);

    return createdEntry;
  },

  async updateEntry(uid, localizedDocumentId: string, strapiContentTypesModels, translatedModel, baseEntry, isoStrapi) {
    const StrapiI18nService = getStrapiI18nService();
    const localizedEntry = await strapi.documents(uid as any).findOne({
      documentId: localizedDocumentId,
      locale: isoStrapi,
      locUploadPLevel: 6,
    });

    const fullyPopulatedLocalizedEntry = await strapi.documents(uid as any).findOne({
      documentId: localizedDocumentId,
      locale: isoStrapi,
      locDownloadPLevel: 6,
    });

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
      localizedDocumentId,
      updateEntry,
      isoStrapi
    );

    return updatedEntry;
  },
});

export type StrapiLocalazyI18nServiceReturnType = ReturnType<typeof StrapiLocalazyI18nService>;

export default StrapiLocalazyI18nService;
