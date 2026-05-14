import { PERMISSION_UIDS } from '../constants/permissions';

const ROUTE_PREFIX = '/project';

const readPolicy = [{ name: 'admin::hasPermissions', config: { actions: [PERMISSION_UIDS.READ] } }];
const settingsUpdatePolicy = [
  { name: 'admin::hasPermissions', config: { actions: [PERMISSION_UIDS.SETTINGS_UPDATE] } },
];

const LocalazyProjectRoutes = [
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}`,
    handler: 'LocalazyProjectController.getConnectedProject',
    config: {
      policies: readPolicy,
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/webhooks`,
    handler: 'LocalazyProjectController.getWebhookStatus',
    config: {
      policies: readPolicy,
    },
  },
  {
    method: 'POST',
    path: `${ROUTE_PREFIX}/webhooks/setup`,
    handler: 'LocalazyProjectController.setupWebhook',
    config: {
      policies: settingsUpdatePolicy,
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/strapi-url`,
    handler: 'LocalazyProjectController.getStrapiUrl',
    config: {
      policies: readPolicy,
    },
  },
];

export default LocalazyProjectRoutes;
