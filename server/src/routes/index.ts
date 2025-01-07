import LocalazyUserRoutes from "./localazy-user";
// import localazyAuthRoutes from "./localazy-auth";
// import pluginSettingsRoutes from "./plugin-settings";
// import strapiRoutes from "./strapi";
// import localazyTransferRoutes from "./localazy-transfer";
// import localazyProjectRoutes from "./localazy-project";
// import localazyPublicTransferRoutes from "./localazy-public-transfer";

export default {
  "content-api": {
    type: "content-api",
    routes: [/*...strapiRoutes*/],
  },
  admin: {
    type: "admin",
    routes: [{
      method: 'GET',
      path: '/pass-data',
      handler: (ctx) => {
        ctx.body = 'You are in the my-plugin-content-type controller!';
      },
      config: {
        policies: [],
        auth: false,
      },
      },
      // ...localazyAuthRoutes,
      ...LocalazyUserRoutes,
      // ...pluginSettingsRoutes,
      // ...strapiRoutes,
      // ...localazyTransferRoutes,
      // ...localazyProjectRoutes,
    ],
  },
  // localazyPublicTransferRoutes,
};
