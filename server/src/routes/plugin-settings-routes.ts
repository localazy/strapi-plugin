import { PERMISSION_UIDS } from '../constants/permissions';

const ROUTE_PREFIX = '/plugin-settings';

const readPolicy = [{ name: 'admin::hasPermissions', config: { actions: [PERMISSION_UIDS.READ] } }];
const settingsReadPolicy = [{ name: 'admin::hasPermissions', config: { actions: [PERMISSION_UIDS.SETTINGS_READ] } }];
const settingsUpdatePolicy = [
  { name: 'admin::hasPermissions', config: { actions: [PERMISSION_UIDS.SETTINGS_UPDATE] } },
];

const PluginSettingsRoutes = [
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/content-transfer-setup`,
    handler: 'PluginSettingsController.getContentTransferSetup',
    config: {
      policies: settingsReadPolicy,
    },
  },
  {
    method: 'PUT',
    path: `${ROUTE_PREFIX}/content-transfer-setup`,
    handler: 'PluginSettingsController.updateContentTransferSetup',
    config: {
      policies: settingsUpdatePolicy,
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/plugin-settings`,
    handler: 'PluginSettingsController.getPluginSettings',
    config: {
      policies: readPolicy,
    },
  },
  {
    method: 'PUT',
    path: `${ROUTE_PREFIX}/plugin-settings`,
    handler: 'PluginSettingsController.updatePluginSettings',
    config: {
      // Stores per-user UI prefs (last visited route). Read-only users still need
      // to persist their own UI state, so this sits behind `read` rather than the
      // destructive `settings.update` grain used by content-transfer-setup.
      policies: readPolicy,
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/sync-cursor`,
    handler: 'PluginSettingsController.getSyncCursor',
    config: {
      policies: readPolicy,
    },
  },
];

export default PluginSettingsRoutes;
