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
const { LOCALAZY_PLUGIN_CHANNEL } = require('../constants/channels');
const { UPLOAD_EVENT, UPLOAD_FINISHED_EVENT } = require('../constants/events');

module.exports = ({ strapi }) => ({
  async upload(streamIdentifier, ctx) {
    strapi.StrapIO.emitRaw(LOCALAZY_PLUGIN_CHANNEL, `${UPLOAD_EVENT}:${streamIdentifier}`, {
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
      strapi.StrapIO.emitRaw(LOCALAZY_PLUGIN_CHANNEL, `${UPLOAD_FINISHED_EVENT}:${streamIdentifier}`, {
        success,
        message,
      });
      strapi.log.info(message);
      ctx.body = {
        success,
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
        strapi.StrapIO.emitRaw(LOCALAZY_PLUGIN_CHANNEL, `${UPLOAD_EVENT}:${streamIdentifier}`, {
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
        strapi.StrapIO.emitRaw(LOCALAZY_PLUGIN_CHANNEL, `${UPLOAD_EVENT}:${streamIdentifier}`, {
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

    const chunks = LocalazyUploadService.splitToChunks(flattenContent);
    const importFile = LocalazyUploadService.createImportFileRepresentation(
      config.LOCALAZY_DEFAULT_FILE_NAME,
      config.LOCALAZY_DEFAULT_FILE_PATH,
      config.LOCALAZY_DEFAULT_FILE_EXTENSION,
      locale,
      chunks
    );
    // Use `deprecate: "file"` if there is one chunk of transferred data only!
    const hasMoreTransferFilesChunks = importFile.length > 1;
    const uploadConfig = !hasMoreTransferFilesChunks ? { deprecate: "file" } : {};
    strapi.StrapIO.emitRaw(LOCALAZY_PLUGIN_CHANNEL, `${UPLOAD_EVENT}:${streamIdentifier}`, {
      message: "Uploading collections to Localazy...",
    });
    await LocalazyUploadService.upload(
      importFile,
      uploadConfig
    );
    strapi.StrapIO.emitRaw(LOCALAZY_PLUGIN_CHANNEL, `${UPLOAD_FINISHED_EVENT}:${streamIdentifier}`, {
      success,
      message: "Upload finished",
    });
  },
});
