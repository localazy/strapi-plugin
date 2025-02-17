const ROUTE_PREFIX = '/strapi';

const StrapiRoutes = [
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/models`,
    handler: 'StrapiController.getModels',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/localizable-models`,
    handler: 'StrapiController.getLocalizableModels',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: `${ROUTE_PREFIX}/lifecycle/localazy-webhooks`,
    handler: 'StrapiController.postLifecycleLocalazyWebhooks',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/version`,
    handler: 'StrapiController.getPluginVersion',
    config: {
      policies: [],
    },
  },
];

export default StrapiRoutes;
