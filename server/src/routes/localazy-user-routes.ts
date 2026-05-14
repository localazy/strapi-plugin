import { PERMISSION_UIDS } from '../constants/permissions';

const ROUTE_PREFIX = '/user';

const readPolicy = [{ name: 'admin::hasPermissions', config: { actions: [PERMISSION_UIDS.READ] } }];
const settingsUpdatePolicy = [
  { name: 'admin::hasPermissions', config: { actions: [PERMISSION_UIDS.SETTINGS_UPDATE] } },
];

const LocalazyUserRoutes = [
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}`,
    handler: 'LocalazyUserController.getUser',
    config: {
      policies: readPolicy,
    },
  },
  {
    method: 'PUT',
    path: `${ROUTE_PREFIX}`,
    handler: 'LocalazyUserController.updateUser',
    config: {
      policies: settingsUpdatePolicy,
    },
  },
  {
    method: 'DELETE',
    path: `${ROUTE_PREFIX}`,
    handler: 'LocalazyUserController.deleteUser',
    config: {
      policies: settingsUpdatePolicy,
    },
  },
];

export default LocalazyUserRoutes;
