import { parsedLocalazyEntryToCreateEntry } from '../utils/parsed-localazy-entry-to-create-entry';
import { parsedLocalazyEntryToUpdateEntry } from '../utils/parsed-localazy-entry-to-update-entry';
import { omitDeep } from '../utils/omit-deep';
import { merge } from 'lodash-es';
import { Core } from '@strapi/strapi';

// TODO: ADD TYPES
// TODO: refactor to use the new APIs

const StrapiLocalazyI18nService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async createEntry(ctx, uid, strapiContentTypesModels, translatedModel, baseEntry, isoStrapi) {
    // * The entry will be created and then updated as the structures differ
    // * It's one extra database call, but the amount of recursive code's complexity is reduced

    // Strapi i18n Service
    const StrapiI18nService = strapi.plugin('localazy').service('strapiI18nService');

    const { createEntry } = parsedLocalazyEntryToCreateEntry(
      strapiContentTypesModels,
      translatedModel,
      baseEntry,
      uid,
      isoStrapi
    );

    const filteredBaseEntry = omitDeep(baseEntry, [
      'locale',
      'localizations',
      'createdAt',
      'createdBy',
      'updatedAt',
      'updatedBy',
      'publishedAt',
    ]);

    let mergedCreateEntry: Record<string, any> = {};
    merge(mergedCreateEntry, filteredBaseEntry, createEntry);
    mergedCreateEntry = omitDeep(mergedCreateEntry, [
      'locale',
      'localizations',
      'createdAt',
      'createdBy',
      'updatedAt',
      'updatedBy',
      'publishedAt',
    ]);

    mergedCreateEntry.locale = isoStrapi;
    const createdEntry = await StrapiI18nService.createLocalizationForAnExistingEntry(
      ctx,
      uid,
      baseEntry,
      mergedCreateEntry
    );

    await this.updateEntry(uid, createdEntry.id, strapiContentTypesModels, translatedModel, baseEntry, isoStrapi);

    return createdEntry;
  },

  async updateEntry(uid, localizedEntryId, strapiContentTypesModels, translatedModel, baseEntry, isoStrapi) {
    // Strapi Service
    const StrapiService = strapi.plugin('strapi-plugin-v5').service('StrapiService');

    // Strapi i18n Service
    const StrapiI18nService = strapi.plugin('strapi-plugin-v5').service('StrapiI18nService');

    const populate = await StrapiService.getPopulateObject(uid);
    const localizedEntry = await strapi.documents(uid as any).findOne({
      documentId: localizedEntryId,
      populate,
    });

    const fullyPopulatedLocalizedEntry = await strapi.documents(uid as any).findOne({
      documentId: localizedEntryId,
      // TODO: Resolve pLevel parameter type
      pLevel: 6,
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
      localizedEntryId,
      updateEntry
    );

    return updatedEntry;
  },
});

export default StrapiLocalazyI18nService;
