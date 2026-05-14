import { PERMISSION_UIDS } from '../constants/permissions';

const ROUTE_PREFIX = '/activity-logs';

const readPolicy = [{ name: 'admin::hasPermissions', config: { actions: [PERMISSION_UIDS.READ] } }];
const transferPolicy = [{ name: 'admin::hasPermissions', config: { actions: [PERMISSION_UIDS.TRANSFER] } }];

const ActivityLogsRoutes = [
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}`,
    handler: 'ActivityLogsController.getSessions',
    config: {
      policies: readPolicy,
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/export`,
    handler: 'ActivityLogsController.exportSessions',
    config: {
      policies: readPolicy,
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/:sessionId`,
    handler: 'ActivityLogsController.getSession',
    config: {
      policies: readPolicy,
    },
  },
  {
    method: 'DELETE',
    path: `${ROUTE_PREFIX}`,
    handler: 'ActivityLogsController.clearSessions',
    config: {
      policies: transferPolicy,
    },
  },
];

export default ActivityLogsRoutes;
