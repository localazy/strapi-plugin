"use strict";

const isGenerallyApplicableContentType = require("./is-generally-applicable-content-type");

module.exports = (model) => {
  const isGenerallyApplicable = isGenerallyApplicableContentType(model);
  if (!isGenerallyApplicable) {
    return false;
  }

  // cannot be translatable
  if (!model.pluginOptions) {
    return false;
  }

  // cannot be translatable
  if (!model.pluginOptions) {
    return false;
  }

  if (model.pluginOptions) {
    // cannot be translatable
    if (!model.pluginOptions["i18n"]) {
      return false;
    }

    // decide whether it is translatable
    if (model.pluginOptions["i18n"]) {
      return model.pluginOptions["i18n"].localized
        ? model.pluginOptions["i18n"].localized
        : false;
    }
  }

  return true;
};
