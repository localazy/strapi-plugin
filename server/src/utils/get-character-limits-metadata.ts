/**
 * Extracts character limit metadata from Strapi content type schemas
 * and returns @meta: entries for keys that have maxLength defined.
 *
 * The @meta: prefix is used by the Localazy API to associate metadata
 * (such as character limits) with specific keys during import.
 *
 * @see https://localazy.com/docs/api/import
 */
const getCharacterLimitsMetadata = (
  flattenedContent: Record<string, any>,
  modelUid: string
): Record<string, { limit: number }> => {
  const metadata: Record<string, { limit: number }> = {};

  const model = strapi.contentTypes[modelUid] || strapi.components[modelUid];
  if (!model) {
    return metadata;
  }

  for (const flatKey of Object.keys(flattenedContent)) {
    const maxLength = resolveMaxLength(flatKey, modelUid, model);
    if (maxLength != null) {
      metadata[`@meta:${flatKey}`] = { limit: maxLength };
    }
  }

  return metadata;
};

/**
 * Resolves the maxLength for a field from its flattened key path.
 *
 * Flattened keys have formats like:
 * - `api::article.article.{docId}.title`
 * - `api::article.article.{docId}.seo[id].metaTitle`
 * - `api::article.article.{docId}.content[1;basic.text].text`
 *
 * This function strips the model uid prefix, document id, and bracket segments,
 * then walks the schema through components to find the leaf attribute's maxLength.
 */
const resolveMaxLength = (flatKey: string, modelUid: string, model: any): number | undefined => {
  // Flat keys look like: api::article.article[docId].description
  // or: api::article.article[docId].blocks[1;shared.quote].title
  if (!flatKey.startsWith(`${modelUid}[`)) {
    return undefined;
  }

  // Remove "modelUid[docId]." prefix
  const afterUid = flatKey.substring(modelUid.length);
  const closingBracket = afterUid.indexOf(']');
  if (closingBracket === -1) {
    return undefined;
  }
  const withoutDocId = afterUid.substring(closingBracket + 2); // skip "]."

  if (!withoutDocId) {
    return undefined;
  }

  const allParts = withoutDocId.split('.');
  const fieldPath = parseFieldPath(allParts);

  if (fieldPath.length === 0) {
    return undefined;
  }

  return walkSchemaForMaxLength(fieldPath, model);
};

/**
 * Parses the dot-separated parts into a field path,
 * handling bracket notation for component/array ids and dynamic zones.
 *
 * e.g. ["seo[123]", "metaTitle"] -> [{ name: "seo", componentId: "123" }, { name: "metaTitle" }]
 * e.g. ["content[1;basic.text]", "text"] -> [{ name: "content", dynamicZoneComponent: "basic.text" }, { name: "text" }]
 *
 * Note: dynamic zone component names contain dots (e.g. "basic.text"),
 * but the bracket content is joined back together.
 */
const parseFieldPath = (parts: string[]): FieldPathSegment[] => {
  const segments: FieldPathSegment[] = [];
  let i = 0;

  while (i < parts.length) {
    const part = parts[i];

    // Check for dynamic zone pattern: name[id;component.name] (split across dots)
    const dynamicZoneMatch = part.match(/^([^[]+)\[(\d+);(.+)$/);
    if (dynamicZoneMatch) {
      // The component name continues until we find the closing bracket
      let componentName = dynamicZoneMatch[3];
      i++;
      while (i < parts.length && !parts[i].includes(']')) {
        componentName += '.' + parts[i];
        i++;
      }
      if (i < parts.length && parts[i].includes(']')) {
        componentName += '.' + parts[i].replace(']', '');
        i++;
      }
      segments.push({ name: dynamicZoneMatch[1], dynamicZoneComponent: componentName });
      continue;
    }

    // Check for bracket notation: name[id]
    const bracketMatch = part.match(/^([^[]+)\[/);
    if (bracketMatch) {
      segments.push({ name: bracketMatch[1] });
      i++;
      continue;
    }

    // Simple field name
    segments.push({ name: part });
    i++;
  }

  return segments;
};

interface FieldPathSegment {
  name: string;
  dynamicZoneComponent?: string;
}

/**
 * Walks the content type / component schema tree to find the maxLength
 * of the leaf field.
 */
const walkSchemaForMaxLength = (fieldPath: FieldPathSegment[], model: any): number | undefined => {
  let currentModel = model;

  for (let i = 0; i < fieldPath.length; i++) {
    const segment = fieldPath[i];
    const attribute = currentModel?.attributes?.[segment.name];

    if (!attribute) {
      return undefined;
    }

    // If this is the leaf field, return its maxLength
    if (i === fieldPath.length - 1) {
      return attribute.maxLength;
    }

    // If it's a component, resolve to the component schema
    if (attribute.type === 'component' && attribute.component) {
      currentModel = strapi.components[attribute.component];
      if (!currentModel) {
        return undefined;
      }
      continue;
    }

    // If it's a dynamic zone, resolve to the specific component
    if (attribute.type === 'dynamiczone' && segment.dynamicZoneComponent) {
      currentModel = strapi.components[segment.dynamicZoneComponent];
      if (!currentModel) {
        return undefined;
      }
      continue;
    }

    // Unknown nested structure
    return undefined;
  }

  return undefined;
};

export { getCharacterLimitsMetadata };
