"use strict";

const localazyUserService = require("./localazy-user-service");
const localazyAuthService = require("./localazy-auth-service");
const strapiService = require("./strapi-service");
const pluginSettingsService = require("./plugin-settings-service");
const localazyUploadService = require("./localazy-upload-service");
const localazyDownloadService = require("./localazy-download-service");
const localazyPubApiService = require("./localazy-pubapi-service");
const strapiI18nService = require("./strapi-i18n-service");
const strapiLocalazyI18nService = require("./strapi-localazy-i18n-service");

module.exports = {
  localazyUserService,
  localazyAuthService,
  strapiService,
  pluginSettingsService,
  localazyUploadService,
  localazyDownloadService,
  localazyPubApiService,
  strapiI18nService,
  strapiLocalazyI18nService,
};
