import type { Core } from '@strapi/strapi';

import isLocalazyApplicableContentType from "../utils/is-localazy-applicable-content-type";
import isGenerallyApplicableContentType from "../utils/is-generally-applicable-content-type";
import buildPopulate from "../utils/build-populate";

const StrapiService = ({ strapi }: { strapi: Core.Strapi }) => ({
  // possible help source https://stackoverflow.com/questions/66180042/is-there-a-way-to-get-a-structure-of-a-strapi-cms-content-type
  async getModels() {
    return [
      ...Object.values(strapi.contentTypes),
      ...Object.values(strapi.components),
    ].filter((model) =>
      isGenerallyApplicableContentType(model)
    );
  },
  async getLocalizableModels() {
    return [
      ...Object.values(strapi.contentTypes),
      ...Object.values(strapi.components),
    ].filter((model) =>
      isLocalazyApplicableContentType(model)
    );
  },
  async getPopulateObject(modelUid) {
    const models = [
      ...Object.values(strapi.contentTypes),
      ...Object.values(strapi.components),
    ];
    return buildPopulate(models, modelUid);
  },
  async getPluginVersion() {
    return require("../../package.json").version;
  }
});

export default StrapiService;
