import type { Core } from '@strapi/strapi';
import { flattenObject } from '../utils/flatten-object';
import {
  getCollectionsNames,
  findSetupModelByCollectionName,
  isCollectionTransferEnabled,
  getPickPathsWithComponents,
} from '../utils/transfer-setup-utils';
import { pickEntries } from '../utils/pick-entries';
import { getCharacterLimitsMetadata } from '../utils/get-character-limits-metadata';
import config from '../config';
import { isoStrapiToLocalazy } from '../utils/iso-locales-utils';
import { omitDeep } from '../utils/omit-deep';
import { EventType } from '../constants/events';
import {
  getStrapiService,
  getStrapiI18nService,
  getLocalazyUploadService,
  getPluginSettingsService,
  getEntryExclusionService,
  getActivityLogsService,
} from '../core';
import { JobNotificationServiceType } from './helpers/job-notification-service';

const LocalazyTransferUploadService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async upload({ notificationService }: { notificationService: JobNotificationServiceType }) {
    console.time('upload');
    await notificationService.emit(EventType.UPLOAD, {
      message: 'Upload started',
    });

    const activityLogsService = getActivityLogsService();
    const sessionId = await activityLogsService.startSession('upload', 'Strapi User');
    await activityLogsService.addEntry(sessionId, 'Upload started');

    let success = true;

    const StrapiService = getStrapiService();
    const StrapiI18nService = getStrapiI18nService();
    const LocalazyUploadService = getLocalazyUploadService();
    const EntryExclusionService = getEntryExclusionService();
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
      await activityLogsService.addEntry(sessionId, message);
      await activityLogsService.finishSession(sessionId, 'failed', message);
      strapi.log.info(message);
      return;
    }

    const { setup } = contentTransferSetup;
    const collectionsNames = getCollectionsNames(setup);
    const models = await StrapiService.getModels();

    let pickedFlattenStrapiContent: Record<string, string | { limit: number }> = {};
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
        await activityLogsService.addEntry(sessionId, message);
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
        await activityLogsService.addEntry(sessionId, message);
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
        locUploadPLevel: 6,
        status: 'draft',
      });

      if (!entries.length) {
        strapi.log.info(`No entries found for model ${modelUid}`);
        continue;
      }

      const excludedEntries = await EntryExclusionService.getContentTypeExclusions(modelUid);

      // Filter out excluded entries
      const filteredEntries = [];
      for (const entry of entries) {
        const isExcluded = excludedEntries.includes(entry.documentId);
        if (!isExcluded) {
          filteredEntries.push(entry);
        }
      }

      entries = filteredEntries;

      if (!entries.length) {
        const message = `All entries for model ${collectionName} are excluded from translation`;
        await notificationService.emit(EventType.UPLOAD, {
          message,
        });
        await activityLogsService.addEntry(sessionId, message);
        strapi.log.info(message);
        continue;
      }

      const message = `Excluding ${excludedEntries.length} entries for model ${collectionName} from upload. Entries to translate: ${entries.length}.`;
      await notificationService.emit(EventType.UPLOAD, {
        message,
      });
      await activityLogsService.addEntry(sessionId, message);
      strapi.log.info(message);

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
        pickedFlattenStrapiContent = {
          ...pickedFlattenStrapiContent,
          ...pickedFlatten,
        };
      });

      // Add character limit metadata for fields that have maxLength defined in the content type schema
      const characterLimitsMetadata = getCharacterLimitsMetadata(pickedFlattenStrapiContent, modelUid);
      pickedFlattenStrapiContent = {
        ...pickedFlattenStrapiContent,
        ...characterLimitsMetadata,
      };
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
    await activityLogsService.addEntry(sessionId, 'Uploading collections to Localazy...');

    try {
      await LocalazyUploadService.upload(importFile, uploadConfig);
    } catch (error) {
      success = false;
      const errorMessage = `Upload to Localazy failed: ${error instanceof Error ? error.message : String(error)}`;
      strapi.log.error(errorMessage);
      await notificationService.emit(EventType.UPLOAD_FINISHED, {
        success,
        message: errorMessage,
      });
      await activityLogsService.addEntry(sessionId, errorMessage);
      await activityLogsService.finishSession(sessionId, 'failed', errorMessage);
      console.timeEnd('upload');
      return;
    }

    strapi.log.info('Upload finished in');

    await notificationService.emit(EventType.UPLOAD_FINISHED, {
      success,
      message: 'Upload finished',
    });
    await activityLogsService.addEntry(sessionId, 'Upload finished');
    await activityLogsService.finishSession(
      sessionId,
      success ? 'completed' : 'failed',
      success ? 'Upload completed successfully' : 'Upload finished with errors'
    );
    console.timeEnd('upload');
  },
});

export type LocalazyTransferUploadServiceReturnType = ReturnType<typeof LocalazyTransferUploadService>;

export default LocalazyTransferUploadService;
