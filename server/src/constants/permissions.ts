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

type PluginsSectionAction = {
  section: 'plugins';
  subCategory?: string;
  pluginName: string;
  displayName: string;
  uid: string;
};

type SettingsSectionAction = {
  section: 'settings';
  category: string;
  subCategory?: string;
  pluginName: string;
  displayName: string;
  uid: string;
};

type ActionRecord = PluginsSectionAction | SettingsSectionAction;

/**
 * Actions registered with `strapi.service('admin::permission').actionProvider.registerMany`
 * during bootstrap. `pluginName` is prepended as `plugin::<pluginName>.` so the resulting
 * UIDs become the ones in `PERMISSION_UIDS` above.
 *
 * Strapi's action validator (@strapi/admin) rejects `category` on `plugins`-section
 * entries and requires it on `settings`-section entries — keep this split intact.
 */
export const LOCALAZY_RBAC_ACTIONS: ActionRecord[] = [
  {
    section: 'plugins',
    pluginName: PLUGIN_NAME,
    displayName: 'Read',
    uid: 'read',
  },
  {
    section: 'plugins',
    pluginName: PLUGIN_NAME,
    displayName: 'Transfer',
    uid: 'transfer',
  },
  {
    section: 'settings',
    category: 'Localazy',
    subCategory: 'Settings',
    pluginName: PLUGIN_NAME,
    displayName: 'Read',
    uid: 'settings.read',
  },
  {
    section: 'settings',
    category: 'Localazy',
    subCategory: 'Settings',
    pluginName: PLUGIN_NAME,
    displayName: 'Update',
    uid: 'settings.update',
  },
];
