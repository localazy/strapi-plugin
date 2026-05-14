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
      // Persists destructive Global Settings (webhookConfig, download.*, upload.*).
      // UI-pref-only writes use `PUT /plugin-settings/ui-prefs` (read-gated) below.
      policies: settingsUpdatePolicy,
    },
  },
  {
    method: 'PUT',
    path: `${ROUTE_PREFIX}/ui-prefs`,
    handler: 'PluginSettingsController.updatePluginSettingsUiPrefs',
    config: {
      // Per-user UI state (last visited route, sort prefs). Service-side filters
      // the body to a fixed allowlist so a `read`-only caller cannot reach the
      // destructive fields that share the same plugin-settings store.
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
