"use strict";

const isLocalazyApplicableContentType = require("../utils/is-localazy-applicable-content-type");
const isGenerallyApplicableContentType = require("../utils/is-generally-applicable-content-type");
const buildPopulate = require("../utils/build-populate");

module.exports = ({ strapi }) => ({
  // possible help source https://stackoverflow.com/questions/66180042/is-there-a-way-to-get-a-structure-of-a-strapi-cms-content-type
  async getModels() {
    return strapi.db.config.models.filter((model) =>
      isGenerallyApplicableContentType(model)
    );
  },
  async getLocalizableModels() {
    return strapi.db.config.models.filter((model) =>
      isLocalazyApplicableContentType(model)
    );
  },
  async getPopulateObject(modelUid) {
    const models = strapi.db.config.models;
    return buildPopulate(models, modelUid);
  },
  async getPluginVersion() {
    return require("../../package.json").version;
  }
});
