import { PERMISSION_UIDS } from '../constants/permissions';

const readPolicy = [{ name: 'admin::hasPermissions', config: { actions: [PERMISSION_UIDS.READ] } }];

const DebugBundleRoutes = [
  {
    method: 'GET',
    path: '/activity-logs/:sessionId/bundle',
    handler: 'DebugBundleController.getBundle',
    config: {
      policies: readPolicy,
    },
  },
];

export default DebugBundleRoutes;
