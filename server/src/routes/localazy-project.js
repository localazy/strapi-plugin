"use strict";

const ROUTE_PREFIX = "/project";

module.exports = [
  {
    method: "GET",
    path: `${ROUTE_PREFIX}`,
    handler: "localazyProjectController.getConnectedProject",
    config: {
      policies: [],
    },
  },
];
