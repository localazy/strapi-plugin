import { cloneDeep, get, isPlainObject } from 'lodash-es';

export const BLOCKS_ATTRIBUTE_TYPE = 'blocks';

type GetModel = (uid: string) => { attributes?: Record<string, any> } | undefined;

/**
 * Upload side. A Blocks value is a rich-text AST: text lives in `text` leaves, everything else
 * (block types, headings, lists, links, marks, images, quotes, code blocks) is structure. We
 * project each blocks field down to a skeleton that keeps only the translatable text leaves in
 * their original positions, so the transfer pipeline emits ONE segment per text node with the
 * formatting carried as structure — never as literal markup inside the string. The dropped
 * structure is restored from the source AST on download (see `overlayBlocksTranslation`). Blocks
 * nested inside components / dynamic zones are reached by walking the schema. The source entry is
 * not mutated.
 */
export const projectBlocksFields = (entry: any, model: any, getModel: GetModel): any => {
  const cloned = cloneDeep(entry);
  walkAndProject(cloned, model, getModel);
  return cloned;
};

const walkAndProject = (value: any, model: any, getModel: GetModel): void => {
  if (!value || !model?.attributes) {
    return;
  }

  for (const [attributeName, attribute] of Object.entries<any>(model.attributes)) {
    const fieldValue = value[attributeName];
    if (fieldValue === undefined || fieldValue === null) {
      continue;
    }

    if (attribute.type === BLOCKS_ATTRIBUTE_TYPE) {
      value[attributeName] = projectBlocksValue(fieldValue);
    } else if (attribute.type === 'component') {
      const componentModel = getModel(attribute.component);
      if (attribute.repeatable && Array.isArray(fieldValue)) {
        fieldValue.forEach((item) => walkAndProject(item, componentModel, getModel));
      } else if (isPlainObject(fieldValue)) {
        walkAndProject(fieldValue, componentModel, getModel);
      }
    } else if (attribute.type === 'dynamiczone' && Array.isArray(fieldValue)) {
      fieldValue.forEach((item) => {
        if (item?.__component) {
          walkAndProject(item, getModel(item.__component), getModel);
        }
      });
    }
  }
};

/**
 * Reduce a blocks AST to a text-only skeleton: every node keeps only its `text` leaf and/or its
 * (recursively projected) `children`. Structural nodes without text (e.g. images, dividers) become
 * empty and contribute no segment. Positions are preserved so download can overlay by path.
 */
export const projectBlocksValue = (nodes: any): any => {
  if (!Array.isArray(nodes)) {
    return nodes;
  }
  return nodes.map(projectNode);
};

const projectNode = (node: any): any => {
  if (!isPlainObject(node)) {
    return {};
  }
  const projected: Record<string, any> = {};
  if (typeof node.text === 'string') {
    projected.text = node.text;
  }
  if (Array.isArray(node.children)) {
    projected.children = node.children.map(projectNode);
  }
  return projected;
};

/**
 * Download side. Rebuild a full blocks AST for the target locale by cloning the source-locale AST
 * and overlaying the translated text onto each text leaf at the matching position. All structure
 * and formatting come from the source, so the result is always a document Strapi accepts, a
 * translation identical to the source round-trips byte-identically, and text nodes left
 * untranslated fall back to the source text. `translated` is the per-node text skeleton
 * reconstructed from the downloaded keys (an array, or an object keyed by numeric position).
 *
 * Returns `undefined` when there is no source AST to overlay onto (nothing safe to write), so the
 * caller can skip the field instead of corrupting it.
 */
export const overlayBlocksTranslation = (sourceAst: any, translated: any): any[] | undefined => {
  if (!Array.isArray(sourceAst)) {
    return undefined;
  }
  return sourceAst.map((node, index) => overlayNode(node, get(translated, [String(index)])));
};

const overlayNode = (node: any, translatedNode: any): any => {
  if (!isPlainObject(node)) {
    return cloneDeep(node);
  }

  if (typeof node.text === 'string') {
    const translatedText = isPlainObject(translatedNode) ? (translatedNode as any).text : undefined;
    return typeof translatedText === 'string' ? { ...node, text: translatedText } : cloneDeep(node);
  }

  if (Array.isArray(node.children)) {
    return {
      ...node,
      children: node.children.map((child: any, index: number) =>
        overlayNode(child, translatedNode ? get(translatedNode, ['children', String(index)]) : undefined)
      ),
    };
  }

  return cloneDeep(node);
};
