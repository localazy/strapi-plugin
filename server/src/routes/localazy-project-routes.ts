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
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/webhooks`,
    handler: 'LocalazyProjectController.getWebhookStatus',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: `${ROUTE_PREFIX}/webhooks/setup`,
    handler: 'LocalazyProjectController.setupWebhook',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/strapi-url`,
    handler: 'LocalazyProjectController.getStrapiUrl',
    config: {
      policies: [],
    },
  },
];

export default LocalazyProjectRoutes;
