"use strict";

const flattenObject = require("../utils/flatten-object");
const {
  getCollectionsNames,
  findSetupModelByCollectionName,
  findSetupModelByCollectionUid,
  isCollectionTransferEnabled,
  getPickPathsWithComponents,
} = require("../utils/transfer-setup-utils");
const pickEntries = require("../utils/pick-entries");
const config = require("../config").default;
const {
  isoLocalazyToStrapi,
  isoStrapiToLocalazy,
} = require("../utils/iso-locales-utils");
const shouldSetDownloadedProperty = require("../functions/should-set-downloaded-property");
const set = require("lodash/set");
const isEmpty = require("lodash/isEmpty");
const omitDeep = require("../utils/omit-deep");
const RequestInitiatorHelper = require('../utils/request-initiator-helper');
const PluginSettingsServiceHelper = require('../services/helpers/plugin-settings-service-helper');
const generateRandomId = require('../utils/generate-random-id');
const { LOCALAZY_PLUGIN_CHANNEL } = require('../constants/channels');
const { UPLOAD_FINISHED_EVENT } = require('../constants/events');

const getFilteredLanguagesCodesForDownload = async (languagesCodes) => {
  const pluginSettingsServiceHelper = new PluginSettingsServiceHelper(strapi);
  const requestInitiatorHelper = new RequestInitiatorHelper(strapi);
  await pluginSettingsServiceHelper.setup();
  let localLanguagesCodes;
  if (requestInitiatorHelper.isInitiatedByLocalazyWebhook()) {
    // called by a webhook
    localLanguagesCodes = pluginSettingsServiceHelper.getWebhookLanguagesCodes();
  } else if (requestInitiatorHelper.isInitiatedByLocalazyPluginUI()) {
    // called by a user from the UI
    localLanguagesCodes = pluginSettingsServiceHelper.getUiLanguagesCodes();
  } else {
    strapi.log.warn("Called by an unknown initiator.");
    return languagesCodes;
  }

  if (isEmpty(localLanguagesCodes)) {
    return languagesCodes;
  }

  return languagesCodes.filter((code) => localLanguagesCodes.includes(code));
};

module.exports = {
  async upload(ctx) {
    try {
      const streamIdentifier = generateRandomId();

      const LocalazyTransferUploadService = strapi
        .plugin("localazy")
        .service("localazyTransferUploadService");

      /**
       * start executing the function after a delay
       * (to let the client receive and subscribe to the messages stream)
       */
      // TODO: let the client send a message to the server to start the upload (that it's subscribed to the stream )
      setTimeout(() => (LocalazyTransferUploadService.upload(streamIdentifier, ctx)), 1000);

      ctx.body = {
        streamIdentifier,
      };

    } catch (e) {
      strapi.log.error(e.message);
      strapi.StrapIO.emitRaw(LOCALAZY_PLUGIN_CHANNEL, `${UPLOAD_FINISHED_EVENT}:${streamIdentifier}`, {
        success,
        message: e.message,
      });
      ctx.throw(400, e);
    }
  },

  async download(ctx) {
    let success = true;
    const messageReport = [];

    // Strapi service
    const StrapiService = strapi
      .plugin("localazy")
      .service("strapiService");

    // Strapi i18n Service
    const StrapiI18nService = strapi
      .plugin("localazy")
      .service("strapiI18nService");

    const LocalazyUserService = strapi
      .plugin("localazy")
      .service("localazyUserService");
    const LocalazyPubApiService = strapi
      .plugin("localazy")
      .service("localazyPubApiService");
    const LocalazyDownloadService = strapi
      .plugin("localazy")
      .service("localazyDownloadService");
    const strapiLocalazyI18nService = strapi
      .plugin("localazy")
      .service("strapiLocalazyI18nService");

    const contentTransferSetup = await strapi
      .plugin("localazy")
      .service("pluginSettingsService")
      .getContentTransferSetup();

    const user = await LocalazyUserService.getUser();

    /**
     * Get Strapi File
     */
    const strapiFile = await LocalazyPubApiService.getStrapiFile(
      user.project.id
    );
    if (!strapiFile) {
      success = false;
      const message = `File ${config.LOCALAZY_DEFAULT_FILE_NAME} not found`;
      strapi.log.error(message);
      messageReport.push(message);
      ctx.body = {
        success,
        report: messageReport,
      };
      return;
    }

    /**
     * Get Localazy Project (incl. languages)
     */
    const project = await LocalazyPubApiService.getProject(
      user.project.id,
      false,
      true
    );
    if (!project) {
      success = false;
      const message = `Project ${user.project.id} not found`;
      strapi.log.error(message);
      messageReport.push(message);
      ctx.body = {
        success,
        report: messageReport,
      };
      return;
    }

    /**
     * Get Localazy project languages
     */
    const projectLanguages = project.languages;
    const projectSourceLanguageId = project.sourceLanguage;
    const sourceLanguage = project.languages.find(
      (language) => language.id === projectSourceLanguageId
    );

    if (!sourceLanguage) {
      success = false;
      const message = "Source language not found";
      strapi.log.error(message);
      messageReport.push(message);
      ctx.body = {
        success,
        report: messageReport,
      };
      return;
    }

    const projectSourceLanguageCode = sourceLanguage.code;
    const projectLanguagesWithoutSourceLanguage = projectLanguages.filter(
      (language) => language.code !== projectSourceLanguageCode
    );

    if (!projectLanguagesWithoutSourceLanguage.length) {
      const message = "Your Localazy project is not translated to other languages.";
      strapi.log.info(message);
      messageReport.push(message);
      ctx.body = {
        success,
        report: messageReport,
      };
      return;
    }

    /**
     * Get project languages codes
     */
    let languagesCodes = projectLanguagesWithoutSourceLanguage.map(
      (language) => language.code
    );
    // process filtered languages only / keep all if empty!
    languagesCodes = await getFilteredLanguagesCodesForDownload(languagesCodes);

    /**
     * Iterate over languages and create the ones that are not present in Strapi
     */
    const strapiUnsupportedLanguages = []; // do not iterate over these languages later
    const strapiLocales = await StrapiI18nService.getLocales(ctx);
    for (const isoLocalazy of languagesCodes) {
      try {
        const isoStrapi = isoLocalazyToStrapi(isoLocalazy);
        const strapiLocale = strapiLocales.find(
          (locale) => locale.code === isoStrapi
        );
        // skip creating locale if it already exists
        if (strapiLocale) {
          strapi.log.info(`The Localazy locale ${isoLocalazy} already exists.`);
          continue;
        }

        const newLocaleCode = await StrapiI18nService.createStrapiLocale(
          ctx,
          isoLocalazy
        );
        messageReport.push(`Created locale ${newLocaleCode}`);
      } catch (e) {
        strapi.log.error(e.message);
        if (e.name === "ValidationError") {
          // store unsupported language code
          strapiUnsupportedLanguages.push(isoLocalazy);
          messageReport.push(`Language ${isoLocalazy} is not supported by Strapi`);
        } else {
          messageReport.push(e.message);
        }
      }
    }

    /**
     * Download all keys for Strapi-supported languages
     */
    const supportedLanguages = languagesCodes.filter(
      (languageCode) => !strapiUnsupportedLanguages.includes(languageCode)
    );
    const localazyContent = {};
    for (const isoLocalazy of supportedLanguages) {
      const isoStrapi = isoLocalazyToStrapi(isoLocalazy);
      const result = await LocalazyDownloadService.download({
        projectId: user.project.id,
        fileId: strapiFile.id,
        lang: isoStrapi,
      });
      if (!result.success) {
        messageReport.push(result.message);
      }
      const langKeys = result.data;
      localazyContent[isoLocalazy] = langKeys;
    }

    /**
     * Parse Localazy content
     */
    const parsedLocalazyContent = {};
    const strapiContentTypesModels = await StrapiService.getModels();
    for (const [isoLocalazy, keys] of Object.entries(localazyContent)) {
      const isoStrapi = isoLocalazyToStrapi(isoLocalazy);
      if (!isoStrapi) {
        messageReport.push(
          `Language ${isoLocalazy} is not supported by Strapi`
        );
        continue;
      }

      for (const localazyEntry of keys) {
        const key = localazyEntry.key[0];
        const value = localazyEntry.value;

        const parsedKey = StrapiI18nService.parseLocalazyKey(key);

        const modelContentTransferSetup = findSetupModelByCollectionUid(
          contentTransferSetup,
          strapiContentTypesModels,
          parsedKey.uid
        );

        if (typeof modelContentTransferSetup !== "undefined" && shouldSetDownloadedProperty(modelContentTransferSetup, parsedKey.rest)) {
          const parsedKeyRestWithoutComponents = parsedKey.rest;
          const setKey = [
            isoStrapi,
            parsedKey.uid,
            parsedKey.id,
            ...parsedKeyRestWithoutComponents,
          ];

          set(parsedLocalazyContent, setKey, value);
        }
      }
    }

    /**
     * Iterate over parsed Localazy content and insert/update content in Strapi
     */
    for (const [isoStrapi, contentTypes] of Object.entries(
      parsedLocalazyContent
    )) {
      for (const [uid, models] of Object.entries(contentTypes)) {
        /**
         * Model could not exist anymore in Strapi
         */
        const strapiContentTypeModel = strapiContentTypesModels.find(
          (model) => model.uid === uid
        );
        if (!strapiContentTypeModel) {
          strapi.log.info(
            `Model ${uid} not found in Strapi, it has been deleted, skipping...`
          );
          continue;
        }

        for (const [id, translatedModel] of Object.entries(models)) {
          try {
            /**
             * Get original source language entry
             */
            const baseEntry = await strapi.entityService.findOne(uid, id, {
              populate: "deep",
            });

            if (isEmpty(baseEntry)) {
              const message = `Source language entry ${uid}[${id}] does not exist anymore, skipping...`;
              throw new Error(message);
            }

            /**
             * Get current language entry
             */
            const baseEntryLocalizations = baseEntry.localizations;

            if (!Array.isArray(baseEntryLocalizations)) {
              throw new Error(
                `Content type ${uid} does not support localizations, skipping...`
              );
            }

            const baseEntryCurrentLanguageLocalizationInfo =
              baseEntryLocalizations.find(
                (localization) => localization.locale === isoStrapi
              );

            if (!baseEntryCurrentLanguageLocalizationInfo) {
              // create new entry
              try {
                const createdEntry = await strapiLocalazyI18nService.createEntry(
                  ctx,
                  uid,
                  strapiContentTypesModels,
                  translatedModel,
                  baseEntry,
                  isoStrapi,
                );

                messageReport.push(
                  `Created new entry ${uid}[${createdEntry.id}] in language ${isoStrapi}`
                );
                strapi.log.info(`Created new entry ${uid}[${createdEntry.id}] in language ${isoStrapi}`);
              } catch (e) {
                success = false;
                strapi.log.error(e.message);
                strapi.log.error(JSON.stringify(e.details?.errors || {}));
                messageReport.push(
                  `Cannot create an entry in ${isoStrapi} for ${uid}[${baseEntry.id}]: ${e.message}`
                );
              }
            } else {
              // update existing entry
              try {
                const localizedEntryId =
                  baseEntryCurrentLanguageLocalizationInfo.id;

                const updatedEntry = await strapiLocalazyI18nService.updateEntry(
                  uid,
                  localizedEntryId,
                  strapiContentTypesModels,
                  translatedModel,
                  baseEntry,
                  isoStrapi,
                );

                messageReport.push(
                  `Updated ${uid}[${updatedEntry.id}] (${isoStrapi})`
                );
                strapi.log.info(`Updated ${uid}[${updatedEntry.id}] (${isoStrapi})`);
              } catch (e) {
                success = false;
                strapi.log.error(e.message);
                strapi.log.error(JSON.stringify(e.details?.errors || {}));
                messageReport.push(
                  `Cannot update an ${uid}[${baseEntryCurrentLanguageLocalizationInfo.id}] (${isoStrapi}): ${e.message}`
                );
              }
            }
          } catch (e) {
            success = false;
            strapi.log.error(e.message);
            messageReport.push(
              `An error occured while processing download: ${e.message}`
            );
          }
        }
      }
    }

    ctx.body = {
      success,
      report: messageReport,
    };
  },
};
