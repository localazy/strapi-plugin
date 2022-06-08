"use strict";

const ROUTE_PREFIX = "/strapi";

module.exports = [
  {
    method: "GET",
    path: `${ROUTE_PREFIX}/models`,
    handler: "strapiController.getModels",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: `${ROUTE_PREFIX}/localizable-models`,
    handler: "strapiController.getLocalizableModels",
    config: {
      policies: [],
    },
  },
];
