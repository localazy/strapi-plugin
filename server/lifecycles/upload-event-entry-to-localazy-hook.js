const { isoStrapiToLocalazy } = require("../utils/iso-locales-utils");
const config = require("../config").default;
const omitDeep = require("../utils/omit-deep");
const flattenObject = require("../utils/flatten-object");
const pickEntries = require("../utils/pick-entries");
const {
  findSetupModelByCollectionName,
  getPickPaths
} = require("../utils/transfer-setup-utils");

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
  // Localazy Upload Service
  const LocalazyUploadService = strapi
    .plugin("localazy")
    .service("localazyUploadService");

  const eventAction = event.action;
  strapi.log.info(`${eventAction} triggered`);

  // if project not connected; break execution
  const user = await LocalazyUserService.getUser();
  const { accessToken } = user;
  if (!accessToken) {
    strapi.log.error("Localazy Plugin: Localazy user is not logged in; the operation won't proceed");
    return;
  }

  // TODO: if the operation not allowed in plugin's global settings; break execution

  const contentTransferSetup = await strapi
    .plugin("localazy")
    .service("pluginSettingsService")
    .getContentTransferSetup();

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

  // event entry not in source language; break execution
  const eventEntry = event.result;
  const eventEntryLocale = eventEntry.locale;
  if (isoStrapiToLocalazy(eventEntryLocale) !== projectSourceLanguageCode) {
    strapi.log.info("Localazy Plugin: Entry language is not in Localazy source language; the operation won't proceed");
    return;
  }

  /**
   * Prepare the data structure and upload it to Localazy
   */
  const modelUid = event.model.uid;
  const entry = [await strapi.entityService.findOne(modelUid, eventEntry.id, {
    populate: "deep",
  })];

  const reducedEntryArray = omitDeep(entry, [
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
  const flatten = flattenObject({
    [modelUid]: reducedEntryArray[0],
  });
  // get only enabled fields; "__component" will be filtered out inside of the function
  const pickedFlatten = pickEntries(flatten, pickPathsWithUid, currentTransferSetupModel);

  const chunks = LocalazyUploadService.splitToChunks(pickedFlatten);
  const importFile = LocalazyUploadService.createImportFileRepresentation(
    config.LOCALAZY_DEFAULT_FILE_NAME,
    config.LOCALAZY_DEFAULT_FILE_PATH,
    config.LOCALAZY_DEFAULT_FILE_EXTENSION,
    eventEntryLocale,
    chunks
  );
  const result = await LocalazyUploadService.upload(importFile);
  return result;
}
