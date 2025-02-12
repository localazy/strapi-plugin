import type { Core, UID, Modules } from '@strapi/strapi';
import { intlDisplayName } from '../utils/intl-display-name';
import { isoLocalazyToStrapi } from '../utils/iso-locales-utils.js';
import { omitDeep } from '../utils/omit-deep.js';
// import { getStrapiService } from '../core';
import type { Locale } from '../models/strapi/locale';
// TODO: ADD TYPES

const StrapiI18nService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getLocales(): Promise<Locale[]> {
    return strapi.plugin('i18n').service('locales').find();
  },
  async getDefaultLocaleCode(): Promise<string> {
    return strapi.plugin('i18n').service('locales').getDefaultLocale();
  },
  async createStrapiLocale(isoLocalazy: string): Promise<Locale> {
    try {
      const isoStrapi = isoLocalazyToStrapi(isoLocalazy);
      let localeName = intlDisplayName(isoStrapi);

      if (typeof localeName !== 'string' || typeof isoStrapi !== 'string') {
        throw new Error('Invalid locale');
      }
      localeName = `${localeName} (${isoStrapi})`;
      const strippedLocaleName = localeName.substring(0, 50); // limit name to 50 characters (given by Strapi)

      const newLocale = await strapi.plugin('i18n').service('locales').create({
        name: strippedLocaleName,
        code: isoStrapi,
      });

      return newLocale;
    } catch (e) {
      strapi.log.error(e);
      throw e;
    }
  },
  parseLocalazyKey(key: string) {
    const split = key.split(/\.(?![^[]*])|\[|\]/);
    const filteredSplit = split.filter((item) => item !== '');

    return {
      uid: `${filteredSplit[0]}.${filteredSplit[1]}`,
      id: filteredSplit[2],
      rest: filteredSplit.slice(3),
    };
  },

  async getEntryInLocale(
    modelUid: UID.ContentType,
    documentId: Modules.Documents.AnyDocument['documentId'],
    isoStrapi: string
  ): Promise<Modules.Documents.AnyDocument | null> {
    const entry = await strapi.documents(modelUid).findOne({
      documentId,
      // TODO: resolve populate object build!
      // https://docs.strapi.io/dev-docs/api/document-service/populate
      locDownloadPLevel: 6,
      locale: isoStrapi,
    });

    return entry;
  },
  async createLocalizationForAnExistingEntry(uid: UID.ContentType, baseEntry: any, newEntry: any) {
    try {
      const newEntryLocale = newEntry.locale;
      const filteredNewEntry = omitDeep(newEntry, ['createdAt', 'updatedAt']);
      // * sets as draft (no timestamp)
      // do not completely omit as it won't process the required fields
      // TODO: add correct publish/draft status and createdBy/updatedBy fields
      filteredNewEntry.publishedAt = null;

      delete filteredNewEntry.id;
      await strapi.documents(uid).create({
        locale: newEntryLocale,
        data: filteredNewEntry,
      });

      const insertedEntry = await this.getEntryInLocale(uid, baseEntry.documentId, newEntryLocale);

      return insertedEntry;
    } catch (e) {
      strapi.log.error(e);
      throw e;
    }
  },
  async updateLocalizationForAnExistingEntry(uid, localizedDocumentId, data, locale: string) {
    try {
      const updatedEntry = await strapi.documents(uid as any).update({
        documentId: localizedDocumentId,
        locale,
        data,
      });

      return updatedEntry;
    } catch (e) {
      strapi.log.error(e);
      throw e;
    }
  },
});

export type StrapiI18nServiceReturnType = ReturnType<typeof StrapiI18nService>;

export default StrapiI18nService;
