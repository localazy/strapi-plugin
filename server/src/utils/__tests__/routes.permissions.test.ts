import routes from '../../routes';
import { PERMISSION_UIDS } from '../../constants/permissions';

type AdminRoute = {
  method: string;
  path: string;
  handler: string;
  config: { policies: Array<{ name: string; config?: { actions?: string[] } }> };
};

const adminRoutes = routes.admin.routes as unknown as AdminRoute[];
const contentApiRoutes = routes['content-api'].routes as unknown as AdminRoute[];
const publicRoutes = routes.LocalazyPublicTransferRoutes.routes as unknown as Array<
  AdminRoute & { config: { auth?: boolean; middlewares?: string[] } }
>;

// Source-of-truth mapping. Keep aligned with the route → action table in the
// LOC-7 plan; any change here is a breaking change for existing role grants.
const EXPECTED_ROUTE_ACTIONS: Record<string, string> = {
  // strapi-routes
  'GET /strapi/models': PERMISSION_UIDS.READ,
  'GET /strapi/localizable-models': PERMISSION_UIDS.READ,
  'POST /strapi/lifecycle/localazy-webhooks': PERMISSION_UIDS.SETTINGS_UPDATE,
  'GET /strapi/version': PERMISSION_UIDS.READ,
  // localazy-auth-routes
  'GET /auth/generate-keys': PERMISSION_UIDS.SETTINGS_UPDATE,
  'GET /auth/continuous-poll': PERMISSION_UIDS.SETTINGS_UPDATE,
  // localazy-user-routes
  'GET /user': PERMISSION_UIDS.READ,
  'PUT /user': PERMISSION_UIDS.SETTINGS_UPDATE,
  'DELETE /user': PERMISSION_UIDS.SETTINGS_UPDATE,
  // localazy-project-routes
  'GET /project': PERMISSION_UIDS.READ,
  'GET /project/webhooks': PERMISSION_UIDS.READ,
  'POST /project/webhooks/setup': PERMISSION_UIDS.SETTINGS_UPDATE,
  'GET /project/strapi-url': PERMISSION_UIDS.READ,
  // localazy-transfer-routes
  'POST /transfer/upload': PERMISSION_UIDS.TRANSFER,
  'POST /transfer/download': PERMISSION_UIDS.TRANSFER,
  // plugin-settings-routes
  'GET /plugin-settings/content-transfer-setup': PERMISSION_UIDS.SETTINGS_READ,
  'PUT /plugin-settings/content-transfer-setup': PERMISSION_UIDS.SETTINGS_UPDATE,
  'GET /plugin-settings/plugin-settings': PERMISSION_UIDS.READ,
  'PUT /plugin-settings/plugin-settings': PERMISSION_UIDS.SETTINGS_UPDATE,
  'PUT /plugin-settings/ui-prefs': PERMISSION_UIDS.READ,
  'GET /plugin-settings/sync-cursor': PERMISSION_UIDS.READ,
  // entry-exclusion-routes
  'GET /entry-exclusion/:contentType/:documentId': PERMISSION_UIDS.READ,
  'PUT /entry-exclusion/:contentType/:documentId': PERMISSION_UIDS.TRANSFER,
  'GET /entry-exclusion/:contentType': PERMISSION_UIDS.READ,
  // activity-logs-routes
  'GET /activity-logs': PERMISSION_UIDS.READ,
  'GET /activity-logs/export': PERMISSION_UIDS.READ,
  'GET /activity-logs/:sessionId': PERMISSION_UIDS.READ,
  'DELETE /activity-logs': PERMISSION_UIDS.TRANSFER,
  // debug-bundle-routes
  'GET /activity-logs/:sessionId/bundle': PERMISSION_UIDS.READ,
};

const keyOf = (route: AdminRoute) => `${route.method} ${route.path}`;

describe('admin routes — admin::hasPermissions wiring', () => {
  it('declares every admin route in the expected action mapping', () => {
    const declared = adminRoutes.map(keyOf).sort();
    const expected = Object.keys(EXPECTED_ROUTE_ACTIONS).sort();
    // Any new admin route MUST be added to EXPECTED_ROUTE_ACTIONS so reviewers
    // see a deliberate permission choice in the diff.
    expect(declared).toEqual(expected);
  });

  it('gates every admin route with admin::hasPermissions + the expected action UID', () => {
    for (const route of adminRoutes) {
      const key = keyOf(route);
      const expectedAction = EXPECTED_ROUTE_ACTIONS[key];
      const policies = route.config.policies ?? [];
      expect({ key, policies }).toEqual({
        key,
        policies: [
          {
            name: 'admin::hasPermissions',
            config: { actions: [expectedAction] },
          },
        ],
      });
    }
  });
});

describe('content-api routes — left unprotected by admin::hasPermissions', () => {
  it('strips admin policies so API-token callers still work', () => {
    // The route file ships with admin policies, but the content-api group
    // gets a cloned copy with `policies: []` so API-token auth (which has no
    // ctx.state.userAbility) keeps working unchanged.
    for (const route of contentApiRoutes) {
      expect(route.config.policies).toEqual([]);
    }
  });
});

describe('public webhook route — unchanged', () => {
  it('stays signature-verified rather than RBAC-gated', () => {
    expect(publicRoutes).toHaveLength(1);
    const [route] = publicRoutes;
    expect(route.path).toBe('/public/transfer/download');
    expect(route.config.auth).toBe(false);
    expect(route.config.middlewares).toEqual(['plugin::localazy.verifyWebhook']);
    expect(route.config.policies).toEqual([]);
  });
});
