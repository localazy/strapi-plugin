// TODO: ADD TYPES

enum SUPPORTED_MODEL_TYPES {
  contentType = 'contentType',
  component = 'component',
}

enum UNSUPPORTED_UID_PREFIXES {
  strapi = 'strapi::core',
  usersPermissions = 'plugin::users-permissions.user',
}

const isGenerallyApplicableContentType = (model: any) => {
  for (const prefix of Object.values(UNSUPPORTED_UID_PREFIXES)) {
    if (model.uid.includes(prefix)) {
      return false;
    }
  }

  if (!Object.values(SUPPORTED_MODEL_TYPES).includes(model.modelType)) {
    return false;
  }

  // is not applicable

  if (!model.__schema__) {
    return false;
  }

  if (model.pluginOptions) {
    if (model.pluginOptions['content-type-builder']) {
      return model.pluginOptions['content-type-builder'].visible;
    }
  }

  return true;
};

export default isGenerallyApplicableContentType;
