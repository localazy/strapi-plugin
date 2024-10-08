"use strict";

const ROUTE_PREFIX = "/auth";

module.exports = [
  {
    method: "GET",
    path: `${ROUTE_PREFIX}/generate-keys`,
    handler: "localazyAuthController.generateKeys",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: `${ROUTE_PREFIX}/continuous-poll`,
    handler: "localazyAuthController.continuousPoll",
    config: {
      policies: [],
    },
  },
];
