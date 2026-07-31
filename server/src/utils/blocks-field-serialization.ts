import { cloneDeep, isPlainObject } from 'lodash-es';

export const BLOCKS_ATTRIBUTE_TYPE = 'blocks';

type GetModel = (uid: string) => { attributes?: Record<string, any> } | undefined;

/**
 * A Blocks value is an AST, not translatable text. We serialize the whole field into a single
 * string so the transfer pipeline treats one blocks field as exactly one key ("one story = one
 * key") instead of exploding it into per-node leaves. Nested blocks (inside components / dynamic
 * zones) are handled by walking the schema. The source entry is not mutated.
 */
export const serializeBlocksFields = (entry: any, model: any, getModel: GetModel): any => {
  const cloned = cloneDeep(entry);
  walkAndSerialize(cloned, model, getModel);
  return cloned;
};

const walkAndSerialize = (value: any, model: any, getModel: GetModel): void => {
  if (!value || !model?.attributes) {
    return;
  }

  for (const [attributeName, attribute] of Object.entries<any>(model.attributes)) {
    const fieldValue = value[attributeName];
    if (fieldValue === undefined || fieldValue === null) {
      continue;
    }

    if (attribute.type === BLOCKS_ATTRIBUTE_TYPE) {
      value[attributeName] = JSON.stringify(fieldValue);
    } else if (attribute.type === 'component') {
      const componentModel = getModel(attribute.component);
      if (attribute.repeatable && Array.isArray(fieldValue)) {
        fieldValue.forEach((item) => walkAndSerialize(item, componentModel, getModel));
      } else if (isPlainObject(fieldValue)) {
        walkAndSerialize(fieldValue, componentModel, getModel);
      }
    } else if (attribute.type === 'dynamiczone' && Array.isArray(fieldValue)) {
      fieldValue.forEach((item) => {
        if (item?.__component) {
          walkAndSerialize(item, getModel(item.__component), getModel);
        }
      });
    }
  }
};

/**
 * Inverse of the upload serialization: turn a downloaded blocks key back into the AST that gets
 * stored (and therefore rendered) as-is. Returns undefined when the payload is not a valid blocks
 * AST (always a top-level array) so callers can skip the write instead of corrupting the field.
 */
export const parseBlocksFieldValue = (value: any): any[] | undefined => {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value !== 'string') {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};
