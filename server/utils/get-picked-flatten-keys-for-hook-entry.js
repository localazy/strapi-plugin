"use strict";

const { isoStrapiToLocalazy } = require("./iso-locales-utils");
const config = require("../config").default;
const omitDeep = require("./omit-deep");
const flattenObject = require("./flatten-object");
const pickEntries = require("./pick-entries");
const {
  findSetupModelByCollectionName,
  getPickPaths
} = require("./transfer-setup-utils");
const PluginSettingsServiceHelper = require('../services/helpers/plugin-settings-service-helper');

/**
 *
 * @param {*} contentTransferSetup
 * @param {*} eventModel
 * @returns `undefined` if such model is not model eligible for transfer or `boolean` setup
 */
const shouldProcessEntry = (contentTransferSetup, eventModel) => {
  let key;
  const modelContentTransferSetup = contentTransferSetup.setup
    .find((model) => {
      key = Object.keys(model)[0];
      return key === eventModel;
    });

  // might be undefined as it's called on any Content-Type
  if (!modelContentTransferSetup) {
    return undefined;
  }
  return !!modelContentTransferSetup[key].__model__;
}

const getEventEntries = async (event) => {
  switch (event.action) {
    case 'afterCreate':
    case 'afterUpdate': {
      const entry = [await strapi.entityService.findOne(
        event.model.uid,
        event.result.id,
        {
          populate: "deep",
        })];
      return entry;
    }
    case "beforeDelete": {
      const entry = [await strapi.entityService.findOne(
        event.model.uid,
        event.params.where.id,
        {
          populate: "deep",
        })];
      return entry;
    }
    case "beforeDeleteMany": {
      /**
       * Strapi sets the locale to the default one, so passing the ids won't help (won't fetch the entries in the correct locale)
       * And therefore because of Strapi being Strapi, we need to get one id from the filter and fetch it's language
       * And then pass the locale parameter to the findMany method
       */
      // const entry = await strapi.entityService.findOne(
      //   event.model.uid,
      //   event.params.where.$and[0].id.$in[0],
      //   {
      //     populate: "deep",
      //   });
      // const locale = entry.locale;
      // const entries = await strapi.entityService.findMany(
      //   event.model.uid,
      //   {
      //     filters: {
      //       id: event.params.where.$and[0].id.$in,
      //     },
      //     locale,
      //     populate: "deep",
      //   });

      /**
       * If deletion of other than default locale is requested, `entries` will be an empty array
       * If deletion of default locale is requested, `entries` will contain requested entries, and we can proceed with the deprecation process
       */
      const entries = await strapi.entityService.findMany(
        event.model.uid,
        {
          filters: event.params.where,
          populate: "deep",
        });

      if (entries.length === 0) {
        strapi.log.info(`Localazy Plugin: No entries in source language for ${event.action} found; the operation won't proceed`);
      }
      return entries;
    }
    default: {
      throw new Error("Unhandled event action");
    }
  }
}

const shouldSkipAction = async (event) => {
  const pluginSettingsServiceHelper = new PluginSettingsServiceHelper(strapi);
  await pluginSettingsServiceHelper.setup();

  switch (event.action) {
    case 'afterCreate': {
      if (!pluginSettingsServiceHelper.shouldAllowAutomatedCreatedTrigger()) {
        strapi.log.info(`Localazy Plugin: Skipping ${event.action} hook because automated created trigger is disabled.`)
        return true;
      }
      return false;
    }
    case 'afterUpdate': {
      if (!pluginSettingsServiceHelper.shouldAllowAutomatedUpdatedTrigger()) {
        strapi.log.info(`Localazy Plugin: Skipping ${event.action} hook because automated update trigger is disabled.`)
        return true;
      }
      return false;
    }
    case "beforeDelete":
    case "beforeDeleteMany": {
      if (!pluginSettingsServiceHelper.shouldAllowDeprecateOnDeletion()) {
        strapi.log.info(`Localazy Plugin: Skipping ${event.action} hook because deprecate on deletion is disabled.`)
        return true;
      }
      return false;
    }
    default: {
      throw new Error("Unhandled event action");
    }
  }
}

module.exports = async (event) => {
  // Docs: https://docs.strapi.io/developer-docs/latest/development/backend-customization/models.html#hook-event-object
  // this should respect the content transfer setup
  // there read it and compare with the model property
  const LocalazyUserService = strapi
    .plugin("localazy")
    .service("localazyUserService");
  const LocalazyPubApiService = strapi
    .plugin("localazy")
    .service("localazyPubApiService");
  const StrapiI18nService = strapi
    .plugin("localazy")
    .service("strapiI18nService");
  const contentTransferSetup = await strapi
    .plugin("localazy")
    .service("pluginSettingsService")
    .getContentTransferSetup();

  const eventAction = event.action;
  strapi.log.info(`${eventAction} triggered`);

  // Content Transfer Setup not available yet; break execution
  if (!contentTransferSetup.has_setup) {
    strapi.log.warn("Localazy Plugin: Content Transfer Setup is not set up; the operation won't proceed");
    return;
  }

  // entry model not supposed to be processed; break execution
  const eventModel = event.model.tableName;
  const shouldProcess = shouldProcessEntry(contentTransferSetup, eventModel);
  if (typeof shouldProcess === 'undefined') {
    return;
  }
  if (!shouldProcess) {
    strapi.log.info("Localazy Plugin: The entry collection transfer is disabled");
    return;
  }

  // if project not connected; break execution
  const user = await LocalazyUserService.getUser();
  const { accessToken } = user;
  if (!accessToken) {
    strapi.log.error("Localazy Plugin: Localazy user is not logged in; the operation won't proceed");
    return;
  }

  if (await shouldSkipAction(event)) {
    strapi.log.info("Localazy Plugin: Automated action skipped");
    return;
  }

  const project = await LocalazyPubApiService.getProject(
    user.project.id,
    false,
    true
  );
  const projectLanguages = project.languages;
  const projectSourceLanguageId = project.sourceLanguage;
  const sourceLanguage = projectLanguages.find(
    (language) => language.id === projectSourceLanguageId
  );
  const projectSourceLanguageCode = sourceLanguage.code;

  // Strapi default locale not compatible with project source language
  const strapiLocales = await StrapiI18nService.getLocales();
  const defaultLocale = strapiLocales.find((locale) => locale.isDefault);

  const strapiDefaultLocale = defaultLocale
    ? isoStrapiToLocalazy(defaultLocale.code)
    : config.LOCALAZY_DEFAULT_LOCALE;
  if (strapiDefaultLocale !== projectSourceLanguageCode) {
    strapi.log.warn("Localazy Plugin: Source locales do not match; the operation won't proceed");
    return;
  }

  /**
     * Prepare the data structure and upload it to Localazy
     */
  const modelUid = event.model.uid;
  const entries = await getEventEntries(event);

  if (entries.length === 0) {
    return;
  }

  // ? TODO: will always be valid?
  const eventEntryLocale = entries[0].locale;

  // event entry not in source language; break execution
  if (isoStrapiToLocalazy(eventEntryLocale) !== projectSourceLanguageCode) {
    strapi.log.info("Localazy Plugin: Entry language is not in Localazy source language; the operation won't proceed");
    return;
  }

  const reducedEntries = omitDeep(entries, [
    // "__component",
    "locale",
    "localizations",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy",
    "publishedAt",
  ]);

  const transferSetupModel = findSetupModelByCollectionName(
    contentTransferSetup.setup,
    eventModel
  );
  const currentTransferSetupModel = transferSetupModel[eventModel];
  const pickPaths = getPickPaths(currentTransferSetupModel);
  if (!pickPaths.length) {
    strapi.log.warn(`No fields for collection ${eventModel} transfer are enabled.`);
    return;
  }
  const pickPathsWithUid = pickPaths.map(
    (pickPath) => `${modelUid}.${pickPath}`
  );

  // flatten Strapi content
  let flatten = {};
  for (const reducedEntry of reducedEntries) {
    flatten = {
      ...flatten,
      ...flattenObject({
        [modelUid]: reducedEntry,
      }),
    };
  }
  // get only enabled fields; "__component" will be filtered out inside of the function
  const pickedFlatten = pickEntries(flatten, pickPathsWithUid, currentTransferSetupModel);

  return {
    pickedFlatten,
    eventEntryLocale,
  };
}
