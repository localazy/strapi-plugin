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

type AdminRoute = (typeof StrapiRoutes)[number];

// StrapiRoutes is also exposed under the content-api group (API-token auth, no admin
// userAbility on ctx.state). Strip the admin policies for that copy so existing
// content-api callers keep working unchanged.
const withoutAdminPolicies = (routes: AdminRoute[]): AdminRoute[] =>
  routes.map((route) => ({
    ...route,
    config: { ...route.config, policies: [] },
  }));

export default {
  'content-api': {
    routes: withoutAdminPolicies(StrapiRoutes),
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
