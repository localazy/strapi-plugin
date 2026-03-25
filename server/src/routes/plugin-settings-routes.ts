const ROUTE_PREFIX = '/plugin-settings';

const PluginSettingsRoutes = [
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/content-transfer-setup`,
    handler: 'PluginSettingsController.getContentTransferSetup',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: `${ROUTE_PREFIX}/content-transfer-setup`,
    handler: 'PluginSettingsController.updateContentTransferSetup',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/plugin-settings`,
    handler: 'PluginSettingsController.getPluginSettings',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: `${ROUTE_PREFIX}/plugin-settings`,
    handler: 'PluginSettingsController.updatePluginSettings',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/sync-cursor`,
    handler: 'PluginSettingsController.getSyncCursor',
    config: {
      policies: [],
    },
  },
];

export default PluginSettingsRoutes;
