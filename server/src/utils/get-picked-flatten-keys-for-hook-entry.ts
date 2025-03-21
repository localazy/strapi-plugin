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
import type { Context } from '@strapi/types/dist/modules/documents/middleware';
import type { HookParams } from '../models/plugin/hook-params';

const shouldProcessEntry = (
  contentTransferSetup: ContentTransferSetup,
  contextModel: UID.ContentType
): boolean | undefined => {
  let key: string;
  const modelContentTransferSetup = contentTransferSetup.setup.find((model) => {
    key = Object.keys(model)[0];
    return key === contextModel;
  });

  // might be undefined as it's called on any Content-Type
  if (!modelContentTransferSetup) {
    return undefined;
  }
  return !!modelContentTransferSetup[key].__model__;
};

const getEventEntries = async (params: HookParams) => {
  const { context, documentId } = params;

  switch (context.action) {
    // must be called AFTER the document is created
    case 'create':
    // must be called AFTER the document is updated
    case 'update':
    // must be called BEFORE the document is deleted
    case 'delete': {
      // must be called BEFORE the document is deleted
      const entry = [
        await strapi.documents(context.contentType.uid).findOne({
          documentId,
          locUploadPLevel: 6,
        }),
      ];
      return entry;
    }
    default: {
      throw new Error('Unhandled event action');
    }
  }
};

const shouldSkipAction = async (context: Context) => {
  const PluginSettingsServiceHelperInstance = new PluginSettingsServiceHelper();
  await PluginSettingsServiceHelperInstance.setup();

  switch (context.action) {
    case 'create': {
      if (!PluginSettingsServiceHelperInstance.shouldAllowAutomatedCreatedTrigger()) {
        strapi.log.info(
          `Localazy Plugin: Skipping ${context.action} hook because automated created trigger is disabled.`
        );
        return true;
      }
      return false;
    }
    case 'update': {
      if (!PluginSettingsServiceHelperInstance.shouldAllowAutomatedUpdatedTrigger()) {
        strapi.log.info(
          `Localazy Plugin: Skipping ${context.action} hook because automated update trigger is disabled.`
        );
        return true;
      }
      return false;
    }
    case 'delete': {
      if (!PluginSettingsServiceHelperInstance.shouldAllowDeprecateOnDeletion()) {
        strapi.log.info(`Localazy Plugin: Skipping ${context.action} hook because deprecate on deletion is disabled.`);
        return true;
      }
      return false;
    }
    default: {
      throw new Error('Unhandled event action');
    }
  }
};

export default async (params: HookParams) => {
  const { context, locale } = params;
  const eventEntryLocale = locale;

  const LocalazyUserService = getLocalazyUserService();
  const LocalazyPubAPIService = getLocalazyPubAPIService();
  const StrapiI18nService = getStrapiI18nService();
  const contentTransferSetup = await getPluginSettingsService().getContentTransferSetup();

  const contextAction = context.action;
  strapi.log.info(`${contextAction} triggered`);

  // Content Transfer Setup not available yet; break execution
  if (!contentTransferSetup.has_setup) {
    strapi.log.warn("Localazy Plugin: Content Transfer Setup is not set up; the operation won't proceed");
    return;
  }

  // entry model not supposed to be processed; break execution
  const contextModel = context.contentType.collectionName as UID.ContentType;
  const shouldProcess = shouldProcessEntry(contentTransferSetup, contextModel);
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

  if (await shouldSkipAction(context)) {
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

  // event entry not in source language; break execution
  if (eventEntryLocale !== '*' && isoStrapiToLocalazy(eventEntryLocale) !== projectSourceLanguageCode) {
    strapi.log.info(
      "Localazy Plugin: Triggered locale is not in Localazy source language; the operation won't proceed"
    );
    return;
  }

  /**
   * Prepare the data structure and upload it to Localazy
   */
  const modelUid = context.contentType.uid;
  const entries = await getEventEntries(params);

  if (entries.length === 0) {
    return;
  }

  /*
   * These fields are not omitted during the document service call,
   * even though they are specified in the `getFullPopulateLocalazyUploadObject` function.
   */
  const reducedEntries = omitDeep(entries, ['locale', 'createdAt', 'updatedAt', 'publishedAt']);

  const transferSetupModel = findSetupModelByCollectionName(contentTransferSetup.setup, contextModel);
  const currentTransferSetupModel = transferSetupModel[contextModel];
  const pickPaths = getPickPaths(currentTransferSetupModel);
  if (!pickPaths.length) {
    strapi.log.warn(`No fields for collection ${contextModel} transfer are enabled.`);
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
    projectSourceLanguageCode,
  };
};
