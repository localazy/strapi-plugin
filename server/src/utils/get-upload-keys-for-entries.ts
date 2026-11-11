import { flattenObject } from './flatten-object';
import { pickEntries } from './pick-entries';
import { projectBlocksFields } from './blocks-to-translatable';
import { getPickPathsWithComponents } from './transfer-setup-utils';

type GetModel = (uid: string) => { attributes?: Record<string, any> } | undefined;

/**
 * The Localazy keys (and source values) of the enabled fields of `entries`, as uploaded by both
 * the manual upload and the automated upload/deprecation on create, update and delete: blocks
 * fields are projected to their text leaves (see `projectBlocksFields`) and dynamic zone fields
 * are picked per component (see `getPickPathsWithComponents`).
 *
 * @param transferSetupModelProps the model's entry of the Content Transfer Setup
 */
export const getUploadKeysForEntries = ({
  entries,
  modelUid,
  transferSetupModelProps,
  getModel,
}: {
  entries: any[];
  modelUid: string;
  transferSetupModelProps: any;
  getModel: GetModel;
}): Record<string, any> => {
  const pickPathsWithUid = getPickPathsWithComponents(transferSetupModelProps).map(
    (pickPath) => `${modelUid}.${pickPath}`
  );

  let uploadKeys: Record<string, any> = {};
  for (const entry of entries) {
    const projectedEntry = projectBlocksFields(entry, getModel(modelUid), getModel);
    const flatten = flattenObject({ [modelUid]: projectedEntry });
    // get only enabled fields; "__component" will be filtered out inside of the function
    uploadKeys = { ...uploadKeys, ...pickEntries(flatten, pickPathsWithUid) };
  }
  return uploadKeys;
};
