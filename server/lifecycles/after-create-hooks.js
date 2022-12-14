const getLocalazyApi = require("../utils/get-localazy-api");
const {
  isoLocalazyToStrapi,
  isoStrapiToLocalazy,
} = require("../utils/iso-locales-utils");

const shouldProcessEntry = (contentTransferSetup, eventModel) => {
  const modelContentTransferSetup = contentTransferSetup.setup
    .find((model) => Object.keys(model)[0] === eventModel);

  // might be undefined as it's called on any Content-Type
  if (!modelContentTransferSetup) {
    return false;
  }
  return modelContentTransferSetup.__model__;
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

  const eventAction = event.action;
  strapi.log.info(`${eventAction} triggered`);

  // if project not connected; break execution
  const user = await LocalazyUserService.getUser();
  const { accessToken } = user;
  if (!accessToken) {
    strapi.log.error("Localazy user is not logged in.");
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
  const eventModel = event.model.singularName;
  if (!shouldProcessEntry(contentTransferSetup, eventModel)) {
    return;
  }

  const eventEntry = event.result;

  // event entry not in source language; break execution
  const eventEntryLocale = eventEntry.locale;
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
  if (isoStrapiToLocalazy(eventEntryLocale) !== projectSourceLanguageCode) {
    strapi.log.error("Localazy Plugin: Source languages do not match; the operation won't proceed");
    return;
  }

  // call
}
