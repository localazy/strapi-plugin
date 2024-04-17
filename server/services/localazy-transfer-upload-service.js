"use strict";

const flattenObject = require("../utils/flatten-object");
const {
  getCollectionsNames,
  findSetupModelByCollectionName,
  isCollectionTransferEnabled,
  getPickPathsWithComponents,
} = require("../utils/transfer-setup-utils");
const pickEntries = require("../utils/pick-entries");
const config = require("../config").default;
const {
  isoStrapiToLocalazy,
} = require("../utils/iso-locales-utils");
const omitDeep = require("../utils/omit-deep");
const { UPLOAD_EVENT, UPLOAD_FINISHED_EVENT } = require('../constants/events');

module.exports = ({ strapi }) => ({
  async upload(JobNotificationService, ctx) {
    console.time("upload");
    await JobNotificationService.emit(UPLOAD_EVENT, {
      message: 'Upload started',
    });

    let success = true;

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
      success = false;
      await JobNotificationService.emit(UPLOAD_FINISHED_EVENT, {
        success,
        message,
      });
      strapi.log.info(message);
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
        await JobNotificationService.emit(UPLOAD_EVENT, {
          message,
        });
        strapi.log.info(message);
        continue;
      }

      // get only enabled fields paths
      const currentTransferSetupModel = transferSetupModel[collectionName];
      const pickPaths = getPickPathsWithComponents(currentTransferSetupModel);
      if (!pickPaths.length) {
        const message = `No fields for collection ${collectionName} transfer are enabled.`;
        await JobNotificationService.emit(UPLOAD_EVENT, {
          message,
        });
        strapi.log.warn(message);
        continue;
      }
      const pickPathsWithUid = pickPaths.map(
        (pickPath) => `${modelUid}.${pickPath}`
      );

      let entries = await strapi.entityService.findMany(modelUid, {
        populate: "deep",
      });
      entries = omitDeep(entries, [
        // "__component",
        "locale",
        "localizations",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
        "publishedAt",
      ]);

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
        // get only enabled fields; "__component" will be filtered out inside of the function
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

    const importFile = LocalazyUploadService.createImportFileRepresentation(
      locale,
      flattenContent
    );
    // Use `deprecate: "file"` if there is one chunk of transferred data only (99900 keys)!
    const uploadConfig = {
      contentOptions: {
        type: config.LOCALAZY_DEFAULT_FILE_EXTENSION,
      },
      i18nOptions: { deprecate: "file" },
      fileOptions: {
        name: config.LOCALAZY_DEFAULT_FILE_NAME,
        path: config.LOCALAZY_DEFAULT_FILE_PATH,
      }
    };
    await JobNotificationService.emit(UPLOAD_EVENT, {
      message: "Uploading collections to Localazy...",
    });
    await LocalazyUploadService.upload(
      importFile,
      uploadConfig
    );
    strapi.log.info("Upload finished in");
    await JobNotificationService.emit(UPLOAD_FINISHED_EVENT, {
      success,
      message: "Upload finished",
    });
    console.timeEnd("upload");
  },
});
