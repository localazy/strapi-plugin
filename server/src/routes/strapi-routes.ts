import { PERMISSION_UIDS } from '../constants/permissions';

const ROUTE_PREFIX = '/strapi';

const readPolicy = [{ name: 'admin::hasPermissions', config: { actions: [PERMISSION_UIDS.READ] } }];
const settingsUpdatePolicy = [
  { name: 'admin::hasPermissions', config: { actions: [PERMISSION_UIDS.SETTINGS_UPDATE] } },
];

const StrapiRoutes = [
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/models`,
    handler: 'StrapiController.getModels',
    config: {
      policies: readPolicy,
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/localizable-models`,
    handler: 'StrapiController.getLocalizableModels',
    config: {
      policies: readPolicy,
    },
  },
  {
    method: 'POST',
    path: `${ROUTE_PREFIX}/lifecycle/localazy-webhooks`,
    handler: 'StrapiController.postLifecycleLocalazyWebhooks',
    config: {
      policies: settingsUpdatePolicy,
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/version`,
    handler: 'StrapiController.getPluginVersion',
    config: {
      policies: readPolicy,
    },
  },
];

export default StrapiRoutes;
