import { PERMISSION_UIDS } from '../constants/permissions';

const ROUTE_PREFIX = '/auth';

const settingsUpdatePolicy = [
  { name: 'admin::hasPermissions', config: { actions: [PERMISSION_UIDS.SETTINGS_UPDATE] } },
];

const LocalazyAuthRoutes = [
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/generate-keys`,
    handler: 'LocalazyAuthController.generateKeys',
    config: {
      policies: settingsUpdatePolicy,
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/continuous-poll`,
    handler: 'LocalazyAuthController.continuousPoll',
    config: {
      policies: settingsUpdatePolicy,
    },
  },
];

export default LocalazyAuthRoutes;
