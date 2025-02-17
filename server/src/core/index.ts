import { PLUGIN_NAME } from '../config/core/config';
import { LocalazyUserServiceReturnType } from '../services/localazy-user-service';
import { LocalazyPubAPIServiceReturnType } from '../services/localazy-pubapi-service';
import { LocalazyTransferUploadServiceReturnType } from '../services/localazy-transfer-upload-service';
import { LocalazyTransferDownloadServiceReturnType } from '../services/localazy-transfer-download-service';
import { PluginSettingsServiceReturnType } from '../services/plugin-settings-service';
import { StrapiServiceReturnType } from '../services/strapi-service';
import { StrapiI18nServiceReturnType } from '../services/strapi-i18n-service';
import { StrapiLocalazyI18nServiceReturnType } from '../services/strapi-localazy-i18n-service';
import { LocalazyUploadServiceReturnType } from 'src/services/localazy-upload-service';

export const getLocalazyUserService = () => {
  return strapi.plugin(PLUGIN_NAME).service<LocalazyUserServiceReturnType>('LocalazyUserService');
};

export const getLocalazyPubAPIService = () => {
  return strapi.plugin(PLUGIN_NAME).service<LocalazyPubAPIServiceReturnType>('LocalazyPubAPIService');
};

export const getLocalazyTransferUploadService = () => {
  return strapi.plugin(PLUGIN_NAME).service<LocalazyTransferUploadServiceReturnType>('LocalazyTransferUploadService');
};

export const getLocalazyTransferDownloadService = () => {
  return strapi
    .plugin(PLUGIN_NAME)
    .service<LocalazyTransferDownloadServiceReturnType>('LocalazyTransferDownloadService');
};

export const getPluginSettingsService = () => {
  return strapi.plugin(PLUGIN_NAME).service<PluginSettingsServiceReturnType>('PluginSettingsService');
};

export const getStrapiService = () => {
  return strapi.plugin(PLUGIN_NAME).service<StrapiServiceReturnType>('StrapiService');
};

export const getStrapiI18nService = () => {
  return strapi.plugin(PLUGIN_NAME).service<StrapiI18nServiceReturnType>('StrapiI18nService');
};

export const getStrapiLocalazyI18nService = () => {
  return strapi.plugin(PLUGIN_NAME).service<StrapiLocalazyI18nServiceReturnType>('StrapiLocalazyI18nService');
};

export const getLocalazyUploadService = () => {
  return strapi.plugin(PLUGIN_NAME).service<LocalazyUploadServiceReturnType>('LocalazyUploadService');
};
