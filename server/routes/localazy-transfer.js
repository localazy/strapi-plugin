"use strict";

const ROUTE_PREFIX = "/transfer";

module.exports = [
  {
    method: "POST",
    path: `${ROUTE_PREFIX}/upload`,
    handler: "localazyTransferController.upload",
    config: {
      policies: [],
    },
  },
  {
    method: "POST",
    path: `${ROUTE_PREFIX}/download`,
    handler: "localazyTransferController.download",
    config: {
      policies: [],
    },
  },
];
