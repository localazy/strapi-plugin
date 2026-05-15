import { PLUGIN_NAME } from '../config/core/config';

/**
 * UIDs as Strapi sees them after `pluginName` is prepended by the action provider.
 * Use these to reference permissions from route policies, admin menu/settings links
 * and `useRBAC` calls. Renaming any UID is a breaking change for existing role grants
 * — bumping a minor version is not enough.
 */
export const PERMISSION_UIDS = {
  READ: `plugin::${PLUGIN_NAME}.read`,
  TRANSFER: `plugin::${PLUGIN_NAME}.transfer`,
  SETTINGS_READ: `plugin::${PLUGIN_NAME}.settings.read`,
  SETTINGS_UPDATE: `plugin::${PLUGIN_NAME}.settings.update`,
} as const;

export type PermissionUid = (typeof PERMISSION_UIDS)[keyof typeof PERMISSION_UIDS];

type ActionRecord = {
  section: 'plugins';
  subCategory: string;
  pluginName: string;
  displayName: string;
  uid: string;
};

/**
 * Actions registered with `strapi.service('admin::permission').actionProvider.registerMany`
 * during bootstrap. `pluginName` is prepended as `plugin::<pluginName>.` so the resulting
 * UIDs become the ones in `PERMISSION_UIDS` above.
 *
 * All four actions live under `section: 'plugins'` so they appear together in the
 * role editor's Plugins tab under "Localazy", grouped by `subCategory`. A previous
 * split (settings-section for the two settings.* actions) caused them to land in a
 * different tab — admins inspecting Plugins → Localazy only saw Read + Transfer and
 * thought the other two were missing.
 *
 * Strapi's @strapi/admin yup validator (a) rejects `category` on `plugins`-section
 * entries — `category` is only valid in `settings` section — and (b) allows
 * `subCategory` on both `plugins` and `settings`. So we use `subCategory` alone for
 * grouping here.
 */
export const LOCALAZY_RBAC_ACTIONS: ActionRecord[] = [
  {
    section: 'plugins',
    subCategory: 'General',
    pluginName: PLUGIN_NAME,
    displayName: 'Read',
    uid: 'read',
  },
  {
    section: 'plugins',
    subCategory: 'General',
    pluginName: PLUGIN_NAME,
    displayName: 'Transfer',
    uid: 'transfer',
  },
  {
    section: 'plugins',
    subCategory: 'Settings',
    pluginName: PLUGIN_NAME,
    displayName: 'Read settings',
    uid: 'settings.read',
  },
  {
    section: 'plugins',
    subCategory: 'Settings',
    pluginName: PLUGIN_NAME,
    displayName: 'Update settings',
    uid: 'settings.update',
  },
];
