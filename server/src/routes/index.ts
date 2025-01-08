import LocalazyUserRoutes from "./localazy-user-routes";
import LocalazyAuthRoutes from "./localazy-auth-routes";
import PluginSettingsRoutes from "./plugin-settings";
import StrapiRoutes from "./strapi-routes";
// import localazyTransferRoutes from "./localazy-transfer";
import LocalazyProjectRoutes from "./localazy-project-routes";
// import localazyPublicTransferRoutes from "./localazy-public-transfer";

export default {
  "content-api": {
    type: "content-api",
    routes: [...StrapiRoutes],
  },
  admin: {
    type: "admin",
    routes: [
      ...LocalazyAuthRoutes,
      ...LocalazyUserRoutes,
      ...PluginSettingsRoutes,
      ...StrapiRoutes,
      // ...localazyTransferRoutes,
      ...LocalazyProjectRoutes,
    ],
  },
  // localazyPublicTransferRoutes,
};
