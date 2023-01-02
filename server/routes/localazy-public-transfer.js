"use strict";

const ROUTE_PREFIX = "/public/transfer";

module.exports = {
  routes: [
    {
      method: "POST",
      path: `${ROUTE_PREFIX}/download`,
      handler: "localazyTransferController.download",
      config: {
        policies: [],
        auth: false, // make the route public
        middlewares: [
          "plugin::localazy.verifyWebhook"
        ]
      },
    },
  ]
};
