const ROUTE_PREFIX = '/project';

const LocalazyProjectRoutes = [
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}`,
    handler: 'LocalazyProjectController.getConnectedProject',
    config: {
      policies: [],
    },
  },
];

export default LocalazyProjectRoutes;
