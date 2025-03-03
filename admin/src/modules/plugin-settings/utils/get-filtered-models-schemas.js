import SUPPORTED_CONTENT_TYPE_FIELDS from "../../@common/models/supported-content-type-fields";
import SUPPORTED_CUSTOM_FIELD_PLUGINS from "../../@common/models/supported-custom-field-plugins";

export default (models) => {
  if (!models) {
    return [];
  }

  return models.map((model) => {
    const attributesKeys = Object.keys(model.__schema__.attributes);

    const attributes = attributesKeys.map((attributeKey) => {
      const type = model.__schema__.attributes[attributeKey].type;
      const customField = model.__schema__.attributes[attributeKey].customField;

      if (!(SUPPORTED_CONTENT_TYPE_FIELDS.includes(type.toLowerCase())
        || (type.toLowerCase() === "customfield" && SUPPORTED_CUSTOM_FIELD_PLUGINS.includes(customField)))) {
        return null;
      }

      return attributeKey;
    });

    return {
      modelUid: model.uid,
      collectionName: model.collectionName,
      displayName: model.info.displayName,
      attributes: attributes.filter((attribute) => !!attribute),
    };
  });
};
