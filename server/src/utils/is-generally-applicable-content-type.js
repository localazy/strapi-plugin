"use strict";

const SUPPORTED_MODEL_TYPES = ["contentType", "component"];
const UNSUPPORTED_UID_PREFIXES = [
  "strapi::core",
  "plugin::users-permissions.user",
];

module.exports = (model) => {
  for (const prefix of UNSUPPORTED_UID_PREFIXES) {
    if (model.uid.includes(prefix)) {
      return false;
    }
  }

  if (!SUPPORTED_MODEL_TYPES.includes(model.modelType)) {
    return false;
  }

  // is not applicable
  // eslint-disable-next-line no-underscore-dangle
  if (!model.__schema__) {
    return false;
  }

  if (model.pluginOptions) {
    if (model.pluginOptions["content-type-builder"]) {
      return model.pluginOptions["content-type-builder"].visible;
    }
  }

  return true;
};
