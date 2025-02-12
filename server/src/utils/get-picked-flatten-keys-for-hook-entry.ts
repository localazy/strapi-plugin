import { isoStrapiToLocalazy } from './iso-locales-utils';
import config from '../config';
import { omitDeep } from './omit-deep';
import { flattenObject } from './flatten-object';
import { pickEntries } from './pick-entries';
import { findSetupModelByCollectionName, getPickPaths } from './transfer-setup-utils';
import PluginSettingsServiceHelper from '../services/helpers/plugin-settings-service-helper';
import { ContentTransferSetup } from '../models/plugin/content-transfer-setup';
import { UID } from '@strapi/strapi';
import {
  getPluginSettingsService,
  getStrapiI18nService,
  getLocalazyUserService,
  getLocalazyPubAPIService,
} from '../core';

const shouldProcessEntry = (
  contentTransferSetup: ContentTransferSetup,
  eventModel: UID.ContentType
): boolean | undefined => {
  let key: string;
  const modelContentTransferSetup = contentTransferSetup.setup.find((model) => {
    key = Object.keys(model)[0];
    return key === eventModel;
  });

  // might be undefined as it's called on any Content-Type
  if (!modelContentTransferSetup) {
    return undefined;
  }
  return !!modelContentTransferSetup[key].__model__;
};

const getEventEntries = async (event: any) => {
  switch (event.action) {
    case 'afterCreate':
    case 'afterUpdate': {
      const entry = [
        await strapi.documents(event.model.uid).findOne({
          documentId: event.result.documentId,
          locUploadPLevel: 6,
        }),
      ];
      return entry;
    }
    case 'beforeDelete': {
      const entry = [
        await strapi.documents(event.model.uid).findOne({
          /**
           * TODO: CONTINUE HERE
           * TODO: test this
           * How to get the documentId from the event.params.where? (id only exists event)
           */
          documentId: event.params.where.documentId,
          locUploadPLevel: 6,
        }),
      ];
      return entry;
    }
    /**
     * 'beforeDeleteMany' won't ever be called in Strapi 5
     * See https://docs.strapi.io/dev-docs/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service#breaking-change-description
     */
    default: {
      throw new Error('Unhandled event action');
    }
  }
};

const shouldSkipAction = async (event: any) => {
  const PluginSettingsServiceHelperInstance = new PluginSettingsServiceHelper();
  await PluginSettingsServiceHelperInstance.setup();

  switch (event.action) {
    case 'afterCreate': {
      if (!PluginSettingsServiceHelperInstance.shouldAllowAutomatedCreatedTrigger()) {
        strapi.log.info(
          `Localazy Plugin: Skipping ${event.action} hook because automated created trigger is disabled.`
        );
        return true;
      }
      return false;
    }
    case 'afterUpdate': {
      if (!PluginSettingsServiceHelperInstance.shouldAllowAutomatedUpdatedTrigger()) {
        strapi.log.info(`Localazy Plugin: Skipping ${event.action} hook because automated update trigger is disabled.`);
        return true;
      }
      return false;
    }
    case 'beforeDelete':
    case 'beforeDeleteMany': {
      if (!PluginSettingsServiceHelperInstance.shouldAllowDeprecateOnDeletion()) {
        strapi.log.info(`Localazy Plugin: Skipping ${event.action} hook because deprecate on deletion is disabled.`);
        return true;
      }
      return false;
    }
    default: {
      throw new Error('Unhandled event action');
    }
  }
};

export default async (event: any) => {
  // Docs: https://docs.strapi.io/developer-docs/latest/development/backend-customization/models.html#hook-event-object
  // this should respect the content transfer setup
  // there read it and compare with the model property
  const LocalazyUserService = getLocalazyUserService();
  const LocalazyPubAPIService = getLocalazyPubAPIService();
  const StrapiI18nService = getStrapiI18nService();
  const contentTransferSetup = await getPluginSettingsService().getContentTransferSetup();

  const eventAction = event.action;
  strapi.log.info(`${eventAction} triggered`);

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
    strapi.log.info('Localazy Plugin: The entry collection transfer is disabled');
    return;
  }

  // if project not connected; break execution
  const user = await LocalazyUserService.getUser();
  const { accessToken } = user;
  if (!accessToken) {
    strapi.log.error("Localazy Plugin: Localazy user is not logged in; the operation won't proceed");
    return;
  }

  if (await shouldSkipAction(event)) {
    strapi.log.info('Localazy Plugin: Automated action skipped');
    return;
  }

  const project = await LocalazyPubAPIService.getProject(user.project.id, false, true);
  const projectLanguages = project.languages;
  const projectSourceLanguageId = project.sourceLanguage;
  const sourceLanguage = projectLanguages.find((language) => language.id === projectSourceLanguageId);
  const projectSourceLanguageCode = sourceLanguage.code;

  // Strapi default locale not compatible with project source language
  const strapiLocales = await StrapiI18nService.getLocales();
  const defaultLocale = strapiLocales.find((locale) => locale.isDefault);

  const strapiDefaultLocale = defaultLocale
    ? isoStrapiToLocalazy(defaultLocale.code)
    : config.default.LOCALAZY_DEFAULT_LOCALE;
  if (strapiDefaultLocale !== projectSourceLanguageCode) {
    strapi.log.warn("Localazy Plugin: Source locales do not match; the operation won't proceed");
    return;
  }

  /**
   * Prepare the data structure and upload it to Localazy
   */
  const modelUid = event.model.uid;
  const entries = await getEventEntries(event);

  if (entries.length === 0) {
    return;
  }

  // ? TODO: will always be valid?
  const eventEntryLocale = entries[0].locale;

  // event entry not in source language; break execution
  if (isoStrapiToLocalazy(eventEntryLocale) !== projectSourceLanguageCode) {
    strapi.log.info("Localazy Plugin: Entry language is not in Localazy source language; the operation won't proceed");
    return;
  }

  /*
   * These fields are not omitted during the document service call,
   * even though they are specified in the `getFullPopulateLocalazyUploadObject` function.
   */
  const reducedEntries = omitDeep(entries, ['locale', 'createdAt', 'updatedAt', 'publishedAt']);

  const transferSetupModel = findSetupModelByCollectionName(contentTransferSetup.setup, eventModel);
  const currentTransferSetupModel = transferSetupModel[eventModel];
  const pickPaths = getPickPaths(currentTransferSetupModel);
  if (!pickPaths.length) {
    strapi.log.warn(`No fields for collection ${eventModel} transfer are enabled.`);
    return;
  }
  const pickPathsWithUid = pickPaths.map((pickPath) => `${modelUid}.${pickPath}`);

  // flatten Strapi content
  let flatten = {};
  for (const reducedEntry of reducedEntries) {
    flatten = {
      ...flatten,
      ...flattenObject({
        [modelUid]: reducedEntry,
      }),
    };
  }
  // get only enabled fields; "__component" will be filtered out inside of the function
  const pickedFlatten = pickEntries(flatten, pickPathsWithUid);

  return {
    pickedFlatten,
    eventEntryLocale,
  };
};
