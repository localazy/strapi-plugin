const ROUTE_PREFIX = "/transfer";

const LocalazyTransferRoutes = [
  {
    method: "POST",
    path: `${ROUTE_PREFIX}/upload`,
    handler: "LocalazyTransferController.upload",
    config: {
      policies: [],
    },
  },
  {
    method: "POST",
    path: `${ROUTE_PREFIX}/download`,
    handler: "LocalazyTransferController.download",
    config: {
      policies: [],
    },
  },
];

export default LocalazyTransferRoutes;
