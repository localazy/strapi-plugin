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
import { getStrapiService, getStrapiI18nService, getLocalazyUploadService, getPluginSettingsService } from '../core';
import { JobNotificationServiceType } from './helpers/job-notification-service';

const LocalazyTransferUploadService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async upload({ notificationService }: { notificationService: JobNotificationServiceType }) {
    console.time('upload');
    await notificationService.emit(EventType.UPLOAD, {
      message: 'Upload started',
    });

    let success = true;

    const StrapiService = getStrapiService();
    const StrapiI18nService = getStrapiI18nService();
    const LocalazyUploadService = getLocalazyUploadService();
    const contentTransferSetup = await getPluginSettingsService().getContentTransferSetup();

    /**
     * If the content transfer setup is not set up,
     * finish (skip) the upload process.
     */
    if (!contentTransferSetup.has_setup) {
      const message = 'Content transfer setup is not set up.';
      success = false;
      await notificationService.emit(EventType.UPLOAD_FINISHED, {
        success,
        message,
      });
      strapi.log.info(message);
      return;
    }

    const { setup } = contentTransferSetup;
    const collectionsNames = getCollectionsNames(setup);
    const models = await StrapiService.getModels();

    let pickedFlattenStrapiContent: Record<string, string> = {};
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
        await notificationService.emit(EventType.UPLOAD, {
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
        await notificationService.emit(EventType.UPLOAD, {
          message,
        });
        strapi.log.warn(message);
        continue;
      }

      /**
       * Contains the paths to the fields with the model uid.
       * These paths will be used (selected) from the content and then uploaded to Localazy.
       */
      const pickPathsWithUid = pickPaths.map((pickPath) => `${modelUid}.${pickPath}`);

      // https://docs.strapi.io/dev-docs/api/document-service#examples-1;
      let entries = await strapi.documents(modelUid).findMany({
        // TODO: Resolve pLevel parameter type
        // @ts-expect-error Improve types
        // pLevel: 6,
        locUploadPLevel: 6,
      });

      if (!entries.length) {
        strapi.log.info(`No entries found for model ${modelUid}`);
        continue;
      }

      /*
       * These fields are not omitted during the document service call,
       * even though they are specified in the `getFullPopulateLocalazyUploadObject` function.
       */
      entries = omitDeep(entries, ['locale', 'createdAt', 'updatedAt', 'publishedAt']);

      entries.forEach((entry) => {
        const flatten = flattenObject({
          [modelUid]: entry,
        });
        // get only enabled fields; "__component" will be filtered out inside of the function
        const pickedFlatten = pickEntries(flatten, pickPathsWithUid);
        // TODO: upload some meta data with the content?
        pickedFlattenStrapiContent = {
          ...pickedFlattenStrapiContent,
          ...pickedFlatten,
        };
      });
    }

    const strapiDefaultLocaleCode = await StrapiI18nService.getDefaultLocaleCode();
    const localazyLocaleCode = strapiDefaultLocaleCode
      ? isoStrapiToLocalazy(strapiDefaultLocaleCode)
      : config.default.LOCALAZY_DEFAULT_LOCALE;

    const importFile = LocalazyUploadService.createImportFileRepresentation(
      localazyLocaleCode,
      pickedFlattenStrapiContent
    );
    /**
     * Use :`deprecate: "file"` if there is one chunk of transferred data only (99900 keys)!
     * TODO: parameterize this
     */
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

    await notificationService.emit(EventType.UPLOAD, {
      message: 'Uploading collections to Localazy...',
    });

    await LocalazyUploadService.upload(importFile, uploadConfig);

    strapi.log.info('Upload finished in');

    await notificationService.emit(EventType.UPLOAD_FINISHED, {
      success,
      message: 'Upload finished',
    });
    console.timeEnd('upload');
  },
});

export type LocalazyTransferUploadServiceReturnType = ReturnType<typeof LocalazyTransferUploadService>;

export default LocalazyTransferUploadService;
