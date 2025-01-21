const ROUTE_PREFIX = '/auth';

const LocalazyAuthRoutes = [
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/generate-keys`,
    handler: 'LocalazyAuthController.generateKeys',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/continuous-poll`,
    handler: 'LocalazyAuthController.continuousPoll',
    config: {
      policies: [],
    },
  },
];

export default LocalazyAuthRoutes;
