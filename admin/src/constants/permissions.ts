import { PLUGIN_ID } from '../pluginId';

/**
 * Mirror of `server/src/constants/permissions.ts`. Admin code can't import from
 * `server/`, so any rename must be applied in both files.
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
