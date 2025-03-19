import LocalazyUserRoutes from './localazy-user-routes';
import LocalazyAuthRoutes from './localazy-auth-routes';
import PluginSettingsRoutes from './plugin-settings-routes';
import StrapiRoutes from './strapi-routes';
import LocalazyTransferRoutes from './localazy-transfer-routes';
import LocalazyProjectRoutes from './localazy-project-routes';
import LocalazyPublicTransferRoutes from './localazy-public-transfer-routes';

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
    ],
  },
  LocalazyPublicTransferRoutes: {
    routes: [...LocalazyPublicTransferRoutes],
  },
};
