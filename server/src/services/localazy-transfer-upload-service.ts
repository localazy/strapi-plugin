import type { Core } from '@strapi/strapi';
import { flattenObject } from '../utils/flatten-object';
import {
  getCollectionsNames,
  findSetupModelByCollectionName,
  isCollectionTransferEnabled,
  getPickPathsWithComponents,
} from '../utils/transfer-setup-utils';
import { pickEntries } from '../utils/pick-entries';
import config from '../config';
import { isoStrapiToLocalazy } from '../utils/iso-locales-utils';
import { omitDeep } from '../utils/omit-deep';
import { EventType } from '../constants/events';

const LocalazyTransferUploadService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async upload(JobNotificationService, ctx) {
    console.time('upload');
    await JobNotificationService.emit(EventType.UPLOAD, {
      message: 'Upload started',
    });

    let success = true;

    // Strapi Service
    const StrapiService = strapi.plugin('strapi-plugin-v5').service('StrapiService');

    // Strapi i18n Service
    const StrapiI18nService = strapi.plugin('strapi-plugin-v5').service('StrapiI18nService');

    // Localazy Upload Service
    const LocalazyUploadService = strapi.plugin('strapi-plugin-v5').service('LocalazyUploadService');

    // get content transfer setup
    const contentTransferSetup = await strapi
      .plugin('strapi-plugin-v5')
      .service('PluginSettingsService')
      .getContentTransferSetup();

    if (!contentTransferSetup.has_setup) {
      const message = 'Content transfer setup is not set up.';
      success = false;
      await JobNotificationService.emit(EventType.UPLOAD_FINISHED, {
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
      const currentModel = models.find((model) => model.collectionName === collectionName);
      const modelUid = currentModel.uid;
      if (!currentModel) {
        strapi.log.warn(`Model with uid ${modelUid} is not found.`);
        continue;
      }

      const transferSetupModel = findSetupModelByCollectionName(setup, collectionName);

      if (!isCollectionTransferEnabled(setup, collectionName)) {
        const message = `Collection ${collectionName} transfer is disabled.`;
        await JobNotificationService.emit(EventType.UPLOAD, {
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
        await JobNotificationService.emit(EventType.UPLOAD, {
          message,
        });
        strapi.log.warn(message);
        continue;
      }
      const pickPathsWithUid = pickPaths.map((pickPath) => `${modelUid}.${pickPath}`);

      // https://docs.strapi.io/dev-docs/api/document-service#examples-1;
      let entries = await strapi.documents(modelUid).findMany({
        // TODO: Resolve pLevel parameter type
        // @ts-expect-error Improve types
        pLevel: 6,
      });
      entries = omitDeep(entries, [
        // "__component",
        'locale',
        'localizations',
        'createdAt',
        'createdBy',
        'updatedAt',
        'updatedBy',
        'publishedAt',
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

    const locale = defaultLocale ? isoStrapiToLocalazy(defaultLocale.code) : config.default.LOCALAZY_DEFAULT_LOCALE;

    const importFile = LocalazyUploadService.createImportFileRepresentation(locale, flattenContent);
    // Use `deprecate: "file"` if there is one chunk of transferred data only (99900 keys)!
    const uploadConfig = {
      contentOptions: {
        type: config.default.LOCALAZY_DEFAULT_FILE_EXTENSION,
      },
      i18nOptions: { deprecate: 'file' },
      fileOptions: {
        name: config.default.LOCALAZY_DEFAULT_FILE_NAME,
        path: config.default.LOCALAZY_DEFAULT_FILE_PATH,
      },
    };
    await JobNotificationService.emit(EventType.UPLOAD, {
      message: 'Uploading collections to Localazy...',
    });
    await LocalazyUploadService.upload(importFile, uploadConfig);
    strapi.log.info('Upload finished in');
    await JobNotificationService.emit(EventType.UPLOAD_FINISHED, {
      success,
      message: 'Upload finished',
    });
    console.timeEnd('upload');
  },
});

export default LocalazyTransferUploadService;
