const ROUTE_PREFIX = '/activity-logs';

const ActivityLogsRoutes = [
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}`,
    handler: 'ActivityLogsController.getSessions',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/export`,
    handler: 'ActivityLogsController.exportSessions',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/:sessionId`,
    handler: 'ActivityLogsController.getSession',
    config: {
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: `${ROUTE_PREFIX}`,
    handler: 'ActivityLogsController.clearSessions',
    config: {
      policies: [],
    },
  },
];

export default ActivityLogsRoutes;
