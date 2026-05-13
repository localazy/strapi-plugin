import LocalazyUserRoutes from './localazy-user-routes';
import LocalazyAuthRoutes from './localazy-auth-routes';
import PluginSettingsRoutes from './plugin-settings-routes';
import StrapiRoutes from './strapi-routes';
import LocalazyTransferRoutes from './localazy-transfer-routes';
import LocalazyProjectRoutes from './localazy-project-routes';
import LocalazyPublicTransferRoutes from './localazy-public-transfer-routes';
import EntryExclusionRoutes from './entry-exclusion-routes';
import ActivityLogsRoutes from './activity-logs-routes';
import DebugBundleRoutes from './debug-bundle-routes';

export default {
  'content-api': {
    routes: [...StrapiRoutes],
  },
  admin: {
    type: 'admin',
    routes: [
      ...LocalazyAuthRoutes,
      ...LocalazyUserRoutes,
      ...PluginSettingsRoutes,
      ...StrapiRoutes,
      ...LocalazyTransferRoutes,
      ...LocalazyProjectRoutes,
      ...EntryExclusionRoutes,
      ...ActivityLogsRoutes,
      ...DebugBundleRoutes,
    ],
  },
  LocalazyPublicTransferRoutes: {
    routes: [...LocalazyPublicTransferRoutes],
  },
};
