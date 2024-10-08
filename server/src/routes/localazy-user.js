"use strict";

const ROUTE_PREFIX = "/user";

module.exports = [
  {
    method: "GET",
    path: `${ROUTE_PREFIX}`,
    handler: "localazyUserController.getUser",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: `${ROUTE_PREFIX}`,
    handler: "localazyUserController.updateUser",
    config: {
      policies: [],
    },
  },
  {
    method: "DELETE",
    path: `${ROUTE_PREFIX}`,
    handler: "localazyUserController.deleteUser",
    config: {
      policies: [],
    },
  },
];
