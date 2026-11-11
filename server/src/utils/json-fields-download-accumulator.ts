import { set } from 'lodash-es';

/**
 * Collects the downloaded keys of `json` and `blocks` fields. On upload such a field is flattened
 * into one Localazy key per leaf; on download the leaves are put back together into one value per
 * field, which is then written into the parsed Localazy content at the field's own path.
 *
 * A field is identified by its full path (owner path + field name), so two json/blocks fields of
 * the same entry or component (e.g. a component's `title` and `line`) never share one value, and
 * a field inside a nested component is written at its own level instead of replacing the
 * component it lives in.
 */
export const createJsonFieldsDownloadAccumulator = () => {
  const fields = new Map<string, { fieldKey: string[]; value: Record<string, unknown> }>();

  return {
    /**
     * @param fieldKey path to the field in the parsed content: `[iso, uid, documentId, ...ownerPath, fieldName]`
     * @param valuePath path of this leaf inside the field's value
     */
    add(fieldKey: string[], valuePath: string[], value: unknown) {
      const id = JSON.stringify(fieldKey);
      let field = fields.get(id);
      if (!field) {
        field = { fieldKey, value: {} };
        fields.set(id, field);
      }
      set(field.value, valuePath, value);
    },

    /** Write every collected field value into `parsedContent` at its own path. */
    applyTo(parsedContent: Record<string, any>) {
      for (const { fieldKey, value } of fields.values()) {
        set(parsedContent, fieldKey, value);
      }
    },
  };
};
