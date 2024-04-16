"use strict";

const localazyUserService = require("./localazy-user-service");
const strapiService = require("./strapi-service");
const pluginSettingsService = require("./plugin-settings-service");
const localazyUploadService = require("./localazy-upload-service");
const localazyPubApiService = require("./localazy-pubapi-service");
const strapiI18nService = require("./strapi-i18n-service");
const strapiLocalazyI18nService = require("./strapi-localazy-i18n-service");
const localazyTransferUploadService = require("./localazy-transfer-upload-service");
const localazyTransferDownloadService = require("./localazy-transfer-download-service");

module.exports = {
  localazyUserService,
  strapiService,
  pluginSettingsService,
  localazyUploadService,
  localazyPubApiService,
  strapiI18nService,
  strapiLocalazyI18nService,
  localazyTransferUploadService,
  localazyTransferDownloadService,
};
