"use strict";

const { isoLocalazyToStrapi } = require("../utils/iso-locales-utils.js");
const intlDisplayName = require("../utils/intl-display-name.js");
const omitDeep = require("../utils/omit-deep.js");

module.exports = ({ strapi }) => ({
  async getLocales(ctx = {}) {
    await strapi.controller("plugin::i18n.locales").listLocales(ctx);
    return ctx.body;
  },
  async createStrapiLocale(ctx, isoLocalazy) {
    try {
      const isoStrapi = isoLocalazyToStrapi(isoLocalazy);
      let localeName = intlDisplayName(isoStrapi);

      if (!localeName || !isoStrapi) {
        throw new Error("Invalid locale");
      }
      localeName = `${localeName} (${isoStrapi})`;

      const newLocaleCtx = { ...ctx };
      newLocaleCtx.request.body = {
        isDefault: false,
        code: isoStrapi,
        name: localeName.substring(0, 50), // limit name to 50 characters (given by Strapi)
      };

      await strapi
        .controller("plugin::i18n.locales")
        .createLocale(newLocaleCtx);

      return isoStrapi;
    } catch (e) {
      strapi.log.error(e);
      throw e;
    }
  },
  parseLocalazyKey(key) {
    const split = key.split(/\.(?![^[]*])|\[|\]/);
    const filteredSplit = split.filter((item) => item !== "");

    return {
      uid: `${filteredSplit[0]}.${filteredSplit[1]}`,
      id: filteredSplit[2],
      rest: filteredSplit.slice(3),
    };
  },
  async getEntryInLocale(modelUid, baseEntryId, isoStrapi, populate = "*") {
    const StrapiService = strapi.plugin("localazy").service("strapiService");
    const entry = await strapi.entityService.findOne(modelUid, baseEntryId, {
      populate,
    });
    const localizations = entry.localizations;
    if (entry.locale === isoStrapi) {
      return entry;
    }

    if (Array.isArray(localizations)) {
      const localeEntry = localizations.find(
        (locale) => locale.locale === isoStrapi
      );
      if (localeEntry) {
        const populate = await StrapiService.getPopulateObject(modelUid);
        return this.getEntryInLocale(
          modelUid,
          localeEntry.id,
          isoStrapi,
          populate
        );
      }
    }

    return null;
  },
  async createLocalizationForAnExistingEntry(ctx, uid, baseEntry, newEntry) {
    try {
      // this might not be localizable (then method is missing, skip)
      const contentTypeController = strapi.controller(uid);
      const newLocalizationCtx = { ...ctx };
      newLocalizationCtx.is = () => false; // ! else throws an error in createLocalization
      newLocalizationCtx.params.id = baseEntry.id;

      const newEntryLocale = newEntry.locale;
      const filteredNewEntry = omitDeep(newEntry, [
        "locale",
        // "id", // keep id to fill-up for the missing fields in the localized entry
        "createdAt",
        // "publishedAt",
        "updatedAt",
      ]);
      filteredNewEntry.locale = newEntryLocale;
      // * sets as draft (no timestamp)
      // do not completely omit as it won't process the required fields
      filteredNewEntry.publishedAt = null;

      newLocalizationCtx.request.body = filteredNewEntry;

      await contentTypeController.createLocalization(newLocalizationCtx);

      const insertedEntry = await this.getEntryInLocale(
        uid,
        baseEntry.id,
        newEntryLocale
      );

      return insertedEntry
    } catch (e) {
      strapi.log.error(e);
      throw e;
    }
  },
  async updateLocalizationForAnExistingEntry(uid, updateEntryId, data) {
    try {
      const StrapiService = strapi.plugin("localazy").service("strapiService");
      const populate = await StrapiService.getPopulateObject(uid);

      const updatedEntry = await strapi.entityService.update(
        uid,
        updateEntryId,
        {
          data,
          populate,
        }
      );

      return updatedEntry;
    } catch (e) {
      strapi.log.error(e);
      throw e;
    }
  },
});
