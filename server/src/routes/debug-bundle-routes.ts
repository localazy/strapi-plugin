const DebugBundleRoutes = [
  {
    method: 'GET',
    path: '/activity-logs/:sessionId/bundle',
    handler: 'DebugBundleController.getBundle',
    config: {
      policies: [],
    },
  },
];

export default DebugBundleRoutes;
