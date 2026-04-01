import { findSetupModelByCollectionUid } from '../utils/transfer-setup-utils';
import config from '../config';
import { isoLocalazyToStrapi } from '../utils/iso-locales-utils';
import {
  shouldSetDownloadedProperty,
  ShouldSetDownloadedPropertyReturnType,
} from '../functions/should-set-downloaded-property';
import { set, get, isEmpty } from 'lodash-es';
import RequestInitiatorHelper from '../utils/request-initiator-helper';
import PluginSettingsServiceHelper from '../services/helpers/plugin-settings-service-helper';
import { EventType } from '../constants/events';
import LocalazyApiClientFactory from '../utils/localazy-api-client-factory';
import { Core, UID } from '@strapi/strapi';

import {
  getStrapiService,
  getStrapiI18nService,
  getLocalazyUserService,
  getLocalazyPubAPIService,
  getStrapiLocalazyI18nService,
  getPluginSettingsService,
  getEntryExclusionService,
  getActivityLogsService,
} from '../core';
import { Language, Locales } from '@localazy/api-client';
import { SyncCursor } from '../db/model/sync-cursor';
import { JobNotificationServiceType } from './helpers/job-notification-service';

const getFilteredLanguagesCodesForDownload = async (languagesCodes: string[]): Promise<string[]> => {
  const pluginSettingsServiceHelper = new PluginSettingsServiceHelper();
  const requestInitiatorHelper = new RequestInitiatorHelper(strapi);
  await pluginSettingsServiceHelper.setup();
  let localLanguagesCodes: string[];
  if (requestInitiatorHelper.isInitiatedByLocalazyWebhook()) {
    // called by a webhook
    localLanguagesCodes = pluginSettingsServiceHelper.getWebhookLanguagesCodes();
  } else if (requestInitiatorHelper.isInitiatedByLocalazyPluginUI()) {
    // called by a user from the UI
    localLanguagesCodes = pluginSettingsServiceHelper.getUiLanguagesCodes();
  } else {
    strapi.log.warn('Called by an unknown initiator.');
    return languagesCodes;
  }

  if (isEmpty(localLanguagesCodes)) {
    return languagesCodes;
  }

  return languagesCodes.filter((code) => localLanguagesCodes.includes(code));
};

const LocalazyTransferDownloadService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async download({
    notificationService,
    fullSync = false,
  }: {
    notificationService: JobNotificationServiceType;
    fullSync?: boolean;
  }) {
    console.time('download');
    const syncMode = fullSync ? 'Full sync' : 'Incremental sync';
    strapi.log.info(`Download started (${syncMode})`);
    await notificationService.emit(EventType.DOWNLOAD, {
      message: `Download started (${syncMode})`,
    });

    const activityLogsService = getActivityLogsService();
    const requestInitiatorHelper = new RequestInitiatorHelper(strapi);
    const isWebhook = requestInitiatorHelper.isInitiatedByLocalazyWebhook();
    const initiatedBy = isWebhook ? 'Webhook' : 'Strapi User';
    const sessionId = await activityLogsService.startSession(isWebhook ? 'webhook' : 'download', initiatedBy);
    await activityLogsService.addEntry(sessionId, `Download started (${syncMode})`);

    let success = true;

    const StrapiService = getStrapiService();
    const StrapiI18nService = getStrapiI18nService();
    const LocalazyUserService = getLocalazyUserService();
    const LocalazyPubAPIService = getLocalazyPubAPIService();
    const StrapiLocalazyI18nService = getStrapiLocalazyI18nService();
    const EntryExclusionService = getEntryExclusionService();

    const contentTransferSetup = await getPluginSettingsService().getContentTransferSetup();

    const user = await LocalazyUserService.getUser();

    /**
     * Get Strapi File
     */
    const strapiFile = await LocalazyPubAPIService.getStrapiFile(user.project.id);
    if (!strapiFile) {
      success = false;
      const message = `File ${config.default.LOCALAZY_DEFAULT_FILE_NAME} not found`;
      strapi.log.error(message);
      await notificationService.emit(EventType.DOWNLOAD_FINISHED, {
        success,
        message,
      });
      await activityLogsService.addEntry(sessionId, message);
      await activityLogsService.finishSession(sessionId, 'failed', message);
      return;
    }

    /**
     * Get Localazy Project (incl. languages)
     */
    const project = await LocalazyPubAPIService.getProject(user.project.id, false, true);
    if (!project) {
      success = false;
      const message = `Project ${user.project.id} not found`;
      strapi.log.error(message);
      await notificationService.emit(EventType.DOWNLOAD_FINISHED, {
        success,
        message,
      });
      await activityLogsService.addEntry(sessionId, message);
      await activityLogsService.finishSession(sessionId, 'failed', message);
      return;
    }

    /**
     * Get Localazy project languages
     */
    const projectLanguages = project.languages;
    const projectSourceLanguageId = project.sourceLanguage;
    const sourceLanguage = project.languages.find((language) => language.id === projectSourceLanguageId);

    if (!sourceLanguage) {
      success = false;
      const message = 'Source language not found';
      strapi.log.error(message);
      await notificationService.emit(EventType.DOWNLOAD_FINISHED, {
        success,
        message,
      });
      await activityLogsService.addEntry(sessionId, message);
      await activityLogsService.finishSession(sessionId, 'failed', message);
      return;
    }

    const projectSourceLanguageCode = sourceLanguage.code;
    const projectLanguagesWithoutSourceLanguage = projectLanguages.filter(
      (language) => language.code !== projectSourceLanguageCode
    );

    if (!projectLanguagesWithoutSourceLanguage.length) {
      const message = 'Your Localazy project is not translated to other languages.';
      strapi.log.info(message);
      await notificationService.emit(EventType.DOWNLOAD_FINISHED, {
        success,
        message,
      });
      await activityLogsService.addEntry(sessionId, message);
      await activityLogsService.finishSession(sessionId, 'completed', message);
      return;
    }

    /**
     * Get project languages codes
     */
    let languagesCodes = projectLanguagesWithoutSourceLanguage.map((language) => language.code);
    // process filtered languages only / keep all if empty!
    languagesCodes = await getFilteredLanguagesCodesForDownload(languagesCodes);

    /**
     * Iterate over languages and create the ones that are not present in Strapi
     */
    const strapiUnsupportedLanguages = []; // do not iterate over these languages later
    const strapiLocales = await StrapiI18nService.getLocales();
    for (const isoLocalazy of languagesCodes) {
      try {
        const isoStrapi = isoLocalazyToStrapi(isoLocalazy);
        const strapiLocale = strapiLocales.find((locale) => locale.code === isoStrapi);
        // skip creating locale if it already exists
        if (strapiLocale) {
          strapi.log.info(`The Localazy locale ${isoLocalazy} already exists.`);
          continue;
        }

        const newLocale = await StrapiI18nService.createStrapiLocale(isoLocalazy);
        await notificationService.emit(EventType.DOWNLOAD, {
          message: `Created locale ${newLocale.code}`,
        });
        await activityLogsService.addEntry(sessionId, `Created locale ${newLocale.code}`);
      } catch (e) {
        strapi.log.error(e.message);
        if (e.name === 'ValidationError') {
          // store unsupported language code
          strapiUnsupportedLanguages.push(isoLocalazy);
          await notificationService.emit(EventType.DOWNLOAD, {
            message: `Language ${isoLocalazy} is not supported by Strapi`,
          });
          await activityLogsService.addEntry(sessionId, `Language ${isoLocalazy} is not supported by Strapi`);
        } else {
          await notificationService.emit(EventType.DOWNLOAD, {
            message: e.message,
          });
          await activityLogsService.addEntry(sessionId, e.message);
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
    const LocalazyApi = await LocalazyApiClientFactory();
    const PluginSettingsService = getPluginSettingsService();
    const syncCursor: SyncCursor = await PluginSettingsService.getSyncCursor();

    // On full sync, reset the processed keys map
    const processedKeys: Record<string, Record<string, number>> = fullSync
      ? {}
      : JSON.parse(JSON.stringify(syncCursor.processedKeys || {}));

    for (const isoLocalazy of supportedLanguages) {
      const isoStrapi = isoLocalazyToStrapi(isoLocalazy);
      const langProcessedKeys = processedKeys[isoStrapi] || {};

      // Fetch all keys with event info; no API-level filtering — we filter locally using the map
      const langKeys = await LocalazyApi.files.listKeys({
        project: user.project.id,
        file: strapiFile.id,
        lang: isoStrapi as Locales,
        event: true,
      });

      if (!langKeys || langKeys.length === 0) {
        await notificationService.emit(EventType.DOWNLOAD, {
          message: `No keys found for language ${isoLocalazy}`,
        });
        await activityLogsService.addEntry(sessionId, `No keys found for language ${isoLocalazy}`);
      } else {
        const newKeys = langKeys.filter((k) => {
          const storedEvent = langProcessedKeys[k.id];
          return storedEvent === undefined || k.event === undefined || k.event > storedEvent;
        });
        await notificationService.emit(EventType.DOWNLOAD, {
          message: `${syncMode}: ${newKeys.length} changed / ${langKeys.length} total keys for language ${isoLocalazy}`,
        });
        await activityLogsService.addEntry(
          sessionId,
          `${syncMode}: ${newKeys.length} changed / ${langKeys.length} total keys for language ${isoLocalazy}`
        );
      }

      localazyContent[isoLocalazy] = langKeys;
    }

    /**
     * Helper: persist updated processedKeys map after each entry write
     */
    const persistCursor = async () => {
      await PluginSettingsService.updateSyncCursor({ processedKeys });
    };

    /**
     * Helper: mark Localazy key IDs as processed (per-language) and persist
     */
    const markKeysProcessed = async (keyIds: Array<{ lang: string; id: string; event: number | undefined }>) => {
      for (const { lang, id, event } of keyIds) {
        if (event !== undefined) {
          if (!processedKeys[lang]) {
            processedKeys[lang] = {};
          }
          processedKeys[lang][id] = event;
        }
      }
      await persistCursor();
    };

    /**
     * Parse Localazy content
     */
    type ParsedLocalazyContent = Record<Language['code'], Record<UID.ContentType, Record<string, any>>>;

    const parsedLocalazyContent: ParsedLocalazyContent = {};
    const strapiContentTypesModels = await StrapiService.getModels();
    const jsonFields = [];

    // Track which Localazy keys contribute to each Strapi entry: "isoStrapi:uid:documentId" → [{lang, id, event}]
    const entryKeySourceMap: Record<string, Array<{ lang: string; id: string; event: number | undefined }>> = {};

    for (const [isoLocalazy, keys] of Object.entries<any>(localazyContent)) {
      const isoStrapi = isoLocalazyToStrapi(isoLocalazy);
      if (!isoStrapi) {
        await notificationService.emit(EventType.DOWNLOAD, {
          message: `Language ${isoLocalazy} is not supported by Strapi`,
        });
        continue;
      }

      for (const localazyEntry of keys) {
        const key = localazyEntry.key[0];
        const value = localazyEntry.value;
        const localazyKeyId: string = localazyEntry.id;
        const localazyKeyEvent: number | undefined = localazyEntry.event;

        // Skip keys already processed at the same or newer event for this language
        const storedEvent = processedKeys[isoStrapi]?.[localazyKeyId];
        if (storedEvent !== undefined && localazyKeyEvent !== undefined && localazyKeyEvent <= storedEvent) {
          continue;
        }

        const parsedKey = StrapiI18nService.parseLocalazyKey(key);

        // Track source key for this entry
        const entryKey = `${isoStrapi}:${parsedKey.uid}:${parsedKey.id}`;
        if (!entryKeySourceMap[entryKey]) {
          entryKeySourceMap[entryKey] = [];
        }
        entryKeySourceMap[entryKey].push({ lang: isoStrapi, id: localazyKeyId, event: localazyKeyEvent });

        const modelContentTransferSetup = findSetupModelByCollectionUid(
          contentTransferSetup,
          strapiContentTypesModels,
          parsedKey.uid
        );

        if (typeof modelContentTransferSetup !== 'undefined') {
          const shouldSetDownloadedPropertyResult = shouldSetDownloadedProperty(
            modelContentTransferSetup,
            parsedKey.rest
          );
          if (shouldSetDownloadedPropertyResult === ShouldSetDownloadedPropertyReturnType.NO) {
            continue;
          }

          let parsedKeyRestWithoutComponents = parsedKey.rest;
          if (shouldSetDownloadedPropertyResult === ShouldSetDownloadedPropertyReturnType.JSON) {
            const setKey = [isoStrapi, parsedKey.uid, parsedKey.id];

            // handle dynamic zones and components here
            let updatedParsedKeyRestWithoutComponents = parsedKeyRestWithoutComponents;
            let segmentsToAdd = [];
            for (const segment of parsedKeyRestWithoutComponents) {
              const hasEntry = get(modelContentTransferSetup, [...segmentsToAdd, segment]);
              const hasEntryNotFinal = hasEntry && typeof hasEntry !== 'boolean';
              // const isDZ = Array.isArray(hasEntry) && hasEntry.every((entry) => entry.__component__);
              // processed till here in iterations and `segment` is numeric
              const isComponent = parseInt(segment) > 0;

              if (hasEntryNotFinal || (!hasEntry && isComponent)) {
                segmentsToAdd.push(segment);
                setKey.push(segment);
                updatedParsedKeyRestWithoutComponents = updatedParsedKeyRestWithoutComponents.slice(1);
              } else {
                break;
              }
            }
            parsedKeyRestWithoutComponents = updatedParsedKeyRestWithoutComponents;

            let foundJsonFieldIndex = jsonFields.findIndex((jsonField) => {
              return jsonField.setKey.join() === setKey.join();
            });
            if (foundJsonFieldIndex === -1) {
              jsonFields.push({
                setKey,
                jsonKey: parsedKeyRestWithoutComponents[0],
                jsonValue: {},
              });
            }

            foundJsonFieldIndex = foundJsonFieldIndex === -1 ? jsonFields.length - 1 : foundJsonFieldIndex;
            const foundJsonField = jsonFields[foundJsonFieldIndex];
            // rest from index 1
            const restSliced = parsedKeyRestWithoutComponents.slice(1);
            set(foundJsonField, ['jsonValue', ...restSliced], value);
            jsonFields[foundJsonFieldIndex] = foundJsonField;
          }

          if (shouldSetDownloadedPropertyResult === ShouldSetDownloadedPropertyReturnType.YES) {
            const setKey = [isoStrapi, parsedKey.uid, parsedKey.id, ...parsedKeyRestWithoutComponents];
            set(parsedLocalazyContent, setKey, value);
          }
        }
      }
    }

    /**
     * Set json fields if applicable
     */
    for (const jsonField of jsonFields) {
      set(parsedLocalazyContent, [...jsonField.setKey, jsonField.jsonKey], jsonField.jsonValue);
    }

    /**
     * Iterate over parsed Localazy content and insert/update content in Strapi
     * Track processed entries and persist cursor every FLUSH_INTERVAL entries
     */
    for (const [isoStrapi, contentTypes] of Object.entries(parsedLocalazyContent)) {
      for (const [uid, models] of Object.entries(contentTypes) as [UID.ContentType, Record<string, any>][]) {
        /**
         * Model could not exist anymore in Strapi
         */
        const strapiContentTypeModel = strapiContentTypesModels.find((model) => model.uid === uid);
        if (!strapiContentTypeModel) {
          strapi.log.info(`Model ${uid} not found in Strapi, it has been deleted, skipping...`);
          continue;
        }

        if (!strapiContentTypeModel.pluginOptions?.i18n?.localized) {
          strapi.log.info(`Content type ${uid} does not support localizations, skipping...`);
          continue;
        }

        const excludedEntries = await EntryExclusionService.getContentTypeExclusions(uid);

        for (const [documentId, translatedModel] of Object.entries(models)) {
          const entryKey = `${isoStrapi}:${uid}:${documentId}`;
          const sourceKeys = entryKeySourceMap[entryKey] || [];

          /**
           * Entry could be excluded from translation after being uploaded to Localazy
           */
          if (excludedEntries.includes(documentId)) {
            strapi.log.info(`Entry ${uid}[${documentId}] is excluded from transfer, skipping...`);
            await markKeysProcessed(sourceKeys);
            continue;
          }

          try {
            /**
             * Get original source language entry
             */
            const baseEntry = await strapi.documents(uid as any).findOne({
              documentId,
              // TODO: Resolve pLevel parameter type
              locDownloadPLevel: 6,
            });

            if (isEmpty(baseEntry)) {
              strapi.log.info(`Source language entry ${uid}[${documentId}] does not exist anymore, skipping...`);
              await markKeysProcessed(sourceKeys);
              continue;
            }

            /**
             * TODO: Convert `documentId` in a key to the correct position in created/updated localization entry
             * e.g.:
             * api::test.test[jy7djs8ejurs3ndd4b0v0h5y].dz[12;test-category.test-component-1].desc
             * api::test.test[jy7djs8ejurs3ndd4b0v0h5y].testcompsingle[11].innercomponent[39].field
             *
             * This must be read from the base (source) language entry.
             * Then, the order of the final structure must be adjusted to match the order of the base entry.
             *
             * 1. Read the base (source) entry with ids
             * 2. Read the existing (target) entry with ids (if exists)
             * 3. Create a structure that matches the base entry ids positioning
             * 4. Deep merge 1. (could be optional in the future; in case user will take care of the required fields himself) -> 2. (could be optional in the future) -> 3.
             */

            /**
             * Get current language entry
             */
            const currentLanguageLocalizedEntry = await strapi.documents(uid as any).findOne({
              documentId,
              locale: isoStrapi,
            });

            // Build content type path for Strapi admin link (e.g. api::article.article -> content-manager/collection-types/api::article.article)
            const strapiAdminEntryUrl = `/admin/content-manager/collection-types/${uid}/${documentId}?plugins[i18n][locale]=${isoStrapi}`;
            const localazySearchUrl = `${user.project.url}/source-language?search=${uid}[${documentId}]`;

            if (isEmpty(currentLanguageLocalizedEntry)) {
              // create new entry
              try {
                await StrapiLocalazyI18nService.createEntry(
                  uid,
                  strapiContentTypesModels,
                  translatedModel,
                  baseEntry,
                  isoStrapi
                );

                const message = `Created entry for ${uid} [${documentId}] in ${isoStrapi}`;
                strapi.log.info(message);
                await notificationService.emit(EventType.DOWNLOAD, {
                  message,
                });
                await activityLogsService.addEntry(sessionId, message);
                await markKeysProcessed(sourceKeys);
              } catch (e) {
                success = false;
                strapi.log.error(e.message);
                strapi.log.error(JSON.stringify(e.details?.errors || {}));
                await notificationService.emit(EventType.DOWNLOAD, {
                  message: `Failed to create ${uid} [${documentId}] in ${isoStrapi}: ${e.message}`,
                  links: {
                    strapi: strapiAdminEntryUrl,
                    localazy: localazySearchUrl,
                  },
                });
                await activityLogsService.addEntry(
                  sessionId,
                  `Failed to create ${uid} [${documentId}] in ${isoStrapi}: ${e.message}`
                );
                // NOT marked — will be retried on next sync
              }
            } else {
              // update existing entry
              try {
                const localizedDocumentId = currentLanguageLocalizedEntry.documentId;

                await StrapiLocalazyI18nService.updateEntry(
                  uid as any,
                  localizedDocumentId,
                  strapiContentTypesModels,
                  translatedModel,
                  baseEntry,
                  isoStrapi
                );

                const message = `Updated ${uid} [${documentId}] in ${isoStrapi}`;
                strapi.log.info(message);
                await notificationService.emit(EventType.DOWNLOAD, {
                  message,
                });
                await activityLogsService.addEntry(sessionId, message);
                await markKeysProcessed(sourceKeys);
              } catch (e) {
                success = false;
                strapi.log.error(e.message);
                strapi.log.error(JSON.stringify(e.details?.errors || {}));
                await notificationService.emit(EventType.DOWNLOAD, {
                  message: `Failed to update ${uid} [${documentId}] in ${isoStrapi}: ${e.message}`,
                  links: {
                    strapi: strapiAdminEntryUrl,
                    localazy: localazySearchUrl,
                  },
                });
                await activityLogsService.addEntry(
                  sessionId,
                  `Failed to update ${uid} [${documentId}] in ${isoStrapi}: ${e.message}`
                );
                // NOT marked — will be retried on next sync
              }
            }
          } catch (e) {
            success = false;
            strapi.log.error(e.message);
            await notificationService.emit(EventType.DOWNLOAD, {
              message: `Error processing ${uid} [${documentId}] in ${isoStrapi}: ${e.message}`,
            });
            await activityLogsService.addEntry(
              sessionId,
              `Error processing ${uid} [${documentId}] in ${isoStrapi}: ${e.message}`
            );
            // NOT marked — will be retried on next sync
          }
        }
      }
    }

    const totalProcessedKeys = Object.values(processedKeys).reduce(
      (sum, langKeys) => sum + Object.keys(langKeys).length,
      0
    );
    strapi.log.info(
      `Download finished. Tracked ${totalProcessedKeys} processed keys across ${Object.keys(processedKeys).length} languages.`
    );
    await notificationService.emit(EventType.DOWNLOAD_FINISHED, {
      success,
      message: 'Download finished',
    });
    const finishMessage = `Download finished. Tracked ${totalProcessedKeys} processed keys across ${Object.keys(processedKeys).length} languages.`;
    await activityLogsService.addEntry(sessionId, finishMessage);
    await activityLogsService.finishSession(
      sessionId,
      success ? 'completed' : 'failed',
      success ? 'Download completed successfully' : 'Download finished with errors'
    );
    console.timeEnd('download');
  },
});

export type LocalazyTransferDownloadServiceReturnType = ReturnType<typeof LocalazyTransferDownloadService>;

export default LocalazyTransferDownloadService;
