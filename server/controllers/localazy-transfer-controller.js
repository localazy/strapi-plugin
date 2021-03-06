"use strict";

const flattenObject = require("../utils/flatten-object");
const {
  getCollectionsNames,
  findSetupModelByCollectionName,
  isCollectionTransferEnabled,
  getPickPaths,
} = require("../utils/transfer-setup-utils");
const pickEntries = require("../utils/pick-entries");
const config = require("../config").default;
const {
  isoLocalazyToStrapi,
  isoStrapiToLocalazy,
} = require("../utils/iso-locales-utils");
const parsedLocalazyEntryToCreateEntry = require("../utils/parsed-localazy-entry-to-create-entry");
const parsedLocalazyEntryToUpdateEntry = require("../utils/parsed-localazy-entry-to-update-entry");
const set = require("lodash/set");
const merge = require("lodash/merge");

module.exports = {
  async upload(ctx) {
    try {
      let success = true;
      const messageReport = [];

      // Strapi Service
      const StrapiService = strapi
        .plugin("localazy")
        .service("strapiService");

      // Strapi i18n Service
      const StrapiI18nService = strapi
        .plugin("localazy")
        .service("strapiI18nService");

      // Localazy Upload Service
      const LocalazyUploadService = strapi
        .plugin("localazy")
        .service("localazyUploadService");

      // get content transfer setup
      const contentTransferSetup = await strapi
        .plugin("localazy")
        .service("pluginSettingsService")
        .getContentTransferSetup();

      if (!contentTransferSetup.has_setup) {
        const message = "Content transfer setup is not set up.";
        strapi.log.info(message);
        messageReport.push(message);
        success = false;
        ctx.body = {
          success,
          report: messageReport,
        };
        return;
      }

      const { setup } = contentTransferSetup;
      const collectionsNames = getCollectionsNames(setup);
      const models = await StrapiService.getModels();
      // flatten Strapi content
      let flattenContent = {};

      for (const collectionName of collectionsNames) {
        const currentModel = models.find(
          (model) => model.collectionName === collectionName
        );
        const modelUid = currentModel.uid;
        if (!currentModel) {
          strapi.log.warn(`Model with uid ${modelUid} is not found.`);
          continue;
        }

        const transferSetupModel = findSetupModelByCollectionName(
          setup,
          collectionName
        );

        if (!isCollectionTransferEnabled(setup, collectionName)) {
          const message = `Collection ${collectionName} transfer is disabled.`;
          messageReport.push(message);
          strapi.log.info(message);
          continue;
        }

        // get only enabled fields paths
        const pickPaths = getPickPaths(transferSetupModel[collectionName]);
        if (!pickPaths.length) {
          const message = `No fields for collection ${collectionName} transfer are enabled.`;
          messageReport.push(message);
          strapi.log.warn(message);
          continue;
        }
        const pickPathsWithUid = pickPaths.map(
          (pickPath) => `${modelUid}.${pickPath}`
        );

        const populate = await StrapiService.getPopulateObject(modelUid);

        let entries = await strapi.entityService.findMany(modelUid, {
          populate,
        });

        if (!entries) {
          strapi.log.info(`No entries found for model ${modelUid}`);
          continue;
        }

        if (!Array.isArray(entries)) {
          entries = [entries];
        }

        entries.forEach((entry) => {
          const flatten = flattenObject({
            [modelUid]: entry,
          });
          // get only enabled fields
          const pickedFlatten = pickEntries(flatten, pickPathsWithUid);

          flattenContent = {
            ...flattenContent,
            ...pickedFlatten,
          };
        });
      }

      // get Strapi default language and convert it to Localazy language code
      const strapiLocales = await StrapiI18nService.getLocales(ctx);
      const defaultLocale = strapiLocales.find((locale) => locale.isDefault);

      const locale = defaultLocale
        ? isoStrapiToLocalazy(defaultLocale.code)
        : config.LOCALAZY_DEFAULT_LOCALE;

      const chunks = LocalazyUploadService.splitToChunks(flattenContent);
      const importFile = LocalazyUploadService.createImportFileRepresentation(
        config.LOCALAZY_DEFAULT_FILE_NAME,
        config.LOCALAZY_DEFAULT_FILE_PATH,
        config.LOCALAZY_DEFAULT_FILE_EXTENSION,
        locale,
        chunks
      );
      await LocalazyUploadService.upload(importFile);

      ctx.body = {
        success,
        report: messageReport,
      };
    } catch (e) {
      strapi.log.error(e.message);
      ctx.throw(400, e);
    }
  },

  async download(ctx) {
    let success = true;
    const messageReport = [];

    // Strapi service
    const StrapiService = strapi.plugin("localazy").service("strapiService");

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

    const user = await LocalazyUserService.getUser();

    /**
     * Get Strapi File
     */
    const strapiFile = await LocalazyPubApiService.getStrapiFile(
      user.project.id
    );
    if (!strapiFile) {
      strapi.log.error(`File ${config.LOCALAZY_DEFAULT_FILE_NAME} not found`);
      ctx.throw(400, `File ${config.LOCALAZY_DEFAULT_FILE_NAME} not found`);
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
    const languagesCodes = projectLanguagesWithoutSourceLanguage.map(
      (language) => language.code
    );

    /**
     * Iterate over languages and create the ones that are not present in Strapi
     */
    const strapiUnsupportedLanguages = []; // do not iterate over these languages later
    for (const isoLocalazy of languagesCodes) {
      try {
        const newLocaleCode = await StrapiI18nService.createStrapiLocale(
          ctx,
          isoLocalazy
        );
        messageReport.push(`Created locale ${newLocaleCode}`);
      } catch (e) {
        if (
          e.name === "ApplicationError" &&
          e.message === "This locale already exists"
        ) {
          strapi.log.info(`The Localazy locale ${isoLocalazy} already exists.`);
        } else {
          strapi.log.error(e.message);
        }
        if (e.name === "ValidationError") {
          // store unsupported language code
          strapiUnsupportedLanguages.push(isoLocalazy);
          messageReport.push(
            `Language ${isoLocalazy} is not supported by Strapi`
          );
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
      const result = await LocalazyDownloadService.download({
        projectId: user.project.id,
        fileId: strapiFile.id,
        lang: isoLocalazy,
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
        const setKey = [
          isoStrapi,
          parsedKey.uid,
          parsedKey.id,
          ...parsedKey.rest,
        ];

        set(parsedLocalazyContent, setKey, value);
      }
    }

    /**
     * Iterate over parsed Localazy content and insert/update content in Strapi
     */
    const strapiContentTypesModels = await StrapiService.getModels();
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
            const populate = await StrapiService.getPopulateObject(uid);
            const baseEntryDeep = await strapi.entityService.findOne(uid, id, {
              populate,
            });
            let baseEntry = await strapi.entityService.findOne(uid, id, {
              populate: "*",
            });
            baseEntry = merge(baseEntry, baseEntryDeep);

            if (!baseEntry) {
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
                const createEntry = parsedLocalazyEntryToCreateEntry(
                  strapiContentTypesModels,
                  translatedModel,
                  uid,
                  isoStrapi
                );
                const createdEntry =
                  await StrapiI18nService.createLocalizationForAnExistingEntry(
                    ctx,
                    uid,
                    baseEntry,
                    createEntry
                  );
                messageReport.push(
                  `Created new entry ${uid}[${createdEntry.id}] in language ${isoStrapi}`
                );
              } catch (e) {
                success = false;
                strapi.log.error(e.message);
                messageReport.push(
                  `Cannot create an entry in ${isoStrapi} for ${uid}[${baseEntry.id}]: ${e.message}`
                );
              }
            } else {
              // update existing entry
              try {
                const localizedEntryId =
                  baseEntryCurrentLanguageLocalizationInfo.id;
                const populate = await StrapiService.getPopulateObject(uid); // not needed anymore here
                const localizedEntry = await strapi.entityService.findOne(
                  uid,
                  localizedEntryId,
                  {
                    populate,
                  }
                );

                const updateEntry = parsedLocalazyEntryToUpdateEntry(
                  strapiContentTypesModels,
                  translatedModel,
                  localizedEntry,
                  uid
                );

                const updatedEntry =
                  await StrapiI18nService.updateLocalizationForAnExistingEntry(
                    uid,
                    localizedEntryId,
                    updateEntry
                  );
                messageReport.push(
                  `Updated ${uid}[${updatedEntry.id}] (${isoStrapi})`
                );
              } catch (e) {
                success = false;
                strapi.log.error(e.message);
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
