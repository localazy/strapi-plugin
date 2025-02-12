import { parsedLocalazyEntryToCreateEntry } from '../utils/parsed-localazy-entry-to-create-entry';
import { parsedLocalazyEntryToUpdateEntry } from '../utils/parsed-localazy-entry-to-update-entry';
import { omitDeep } from '../utils/omit-deep';
import { merge } from 'lodash-es';
import { Core, UID } from '@strapi/strapi';
import { dropPropertyDeep } from '../utils/drop-property-deep';
import { getStrapiI18nService /*, getStrapiService*/ } from '../core';
// TODO: ADD TYPES

const StrapiLocalazyI18nService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async createEntry(uid: UID.ContentType, strapiContentTypesModels, translatedModel, baseEntry, isoStrapi) {
    // * The entry will be created and then updated as the structures differ
    // * It's one extra database call, but the amount of recursive code's complexity is reduced

    // Strapi i18n Service
    const StrapiI18nService = getStrapiI18nService();

    const { createEntry } = parsedLocalazyEntryToCreateEntry(
      strapiContentTypesModels,
      translatedModel,
      baseEntry,
      uid,
      isoStrapi
    );

    const omitKeys = ['locale', 'localizations', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'publishedAt'];

    let filteredBaseEntry = omitDeep(baseEntry, omitKeys);
    // TODO: Deal with relations - must be omitted
    filteredBaseEntry = dropPropertyDeep(filteredBaseEntry, 'documentId');

    /**
     * Items positioning is done by the `toCreateEntry` function
     * that's why can entry can be merged now
     */
    let mergedCreateEntry: Record<string, any> = {};
    merge(mergedCreateEntry, filteredBaseEntry, createEntry);
    mergedCreateEntry = omitDeep(mergedCreateEntry, omitKeys);

    mergedCreateEntry.locale = isoStrapi;
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

    const filteredUpdateEntry = dropPropertyDeep(updateEntry, 'documentId');

    const updatedEntry = await StrapiI18nService.updateLocalizationForAnExistingEntry(
      uid,
      localizedDocumentId,
      filteredUpdateEntry,
      isoStrapi
    );

    return updatedEntry;
  },
});

export type StrapiLocalazyI18nServiceReturnType = ReturnType<typeof StrapiLocalazyI18nService>;

export default StrapiLocalazyI18nService;
