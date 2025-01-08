const ROUTE_PREFIX = "/user";

const LocalazyUserRoutes = [
  {
    method: "GET",
    path: `${ROUTE_PREFIX}`,
    handler: "LocalazyUserController.getUser",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: `${ROUTE_PREFIX}`,
    handler: "LocalazyUserController.updateUser",
    config: {
      policies: [],
    },
  },
  {
    method: "DELETE",
    path: `${ROUTE_PREFIX}`,
    handler: "LocalazyUserController.deleteUser",
    config: {
      policies: [],
    },
  },
];

export default LocalazyUserRoutes;
