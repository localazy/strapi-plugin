import { PLUGIN_NAME } from '../config/core/config';

const ROUTE_PREFIX = '/public/transfer';

const LocalazyPublicTransferRoutes = [
  {
    method: 'POST',
    path: `${ROUTE_PREFIX}/download`,
    handler: 'LocalazyTransferController.download',
    config: {
      policies: [],
      auth: false, // make the route public
      middlewares: [`plugin::${PLUGIN_NAME}.verifyWebhook`],
    },
  },
];

export default LocalazyPublicTransferRoutes;
