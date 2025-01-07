const ROUTE_PREFIX = "/user";

const LocalazyUserRoutes = [
  {
    method: "GET",
    path: `${ROUTE_PREFIX}`,
    handler: "LocalazyUserController.getUser",
    config: {
      policies: [],
      // auth: false,
    },
  },
  {
    method: "PUT",
    path: `${ROUTE_PREFIX}`,
    handler: "LocalazyUserController.updateUser",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "DELETE",
    path: `${ROUTE_PREFIX}`,
    handler: "LocalazyUserController.deleteUser",
    config: {
      policies: [],
      auth: false,
    },
  },
];

export default LocalazyUserRoutes;
