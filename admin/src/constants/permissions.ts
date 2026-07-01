import { PLUGIN_ID } from '../pluginId';

/**
 * Mirror of `server/src/constants/permissions.ts`. Admin code can't import from
 * `server/`, so any rename must be applied in both files.
 *
 * `useRBAC` derives the boolean it returns under `allowedActions` from the LAST
 * dotted segment of each UID, lowercased and prefixed with `can`:
 *
 *   plugin::localazy.read           → canRead
 *   plugin::localazy.transfer       → canTransfer
 *   plugin::localazy.settings.read  → canRead   (collides with READ above!)
 *   plugin::localazy.settings.update → canUpdate
 *
 * Because `settings.read` and `read` both collapse to `canRead`, never pass
 * both into the same `useRBAC` call — issue separate calls per distinct UID
 * you need to check (one call returns one `canX` boolean per unique segment).
 */
export const PERMISSION_UIDS = {
  READ: `plugin::${PLUGIN_ID}.read`,
  TRANSFER: `plugin::${PLUGIN_ID}.transfer`,
  SETTINGS_READ: `plugin::${PLUGIN_ID}.settings.read`,
  SETTINGS_UPDATE: `plugin::${PLUGIN_ID}.settings.update`,
} as const;

export type PermissionUid = (typeof PERMISSION_UIDS)[keyof typeof PERMISSION_UIDS];

type PermissionDescriptor = { action: PermissionUid; subject: null };

export const PERMISSIONS: Record<keyof typeof PERMISSION_UIDS, PermissionDescriptor[]> = {
  READ: [{ action: PERMISSION_UIDS.READ, subject: null }],
  TRANSFER: [{ action: PERMISSION_UIDS.TRANSFER, subject: null }],
  SETTINGS_READ: [{ action: PERMISSION_UIDS.SETTINGS_READ, subject: null }],
  SETTINGS_UPDATE: [{ action: PERMISSION_UIDS.SETTINGS_UPDATE, subject: null }],
};
