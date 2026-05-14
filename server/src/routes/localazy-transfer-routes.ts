import { PERMISSION_UIDS } from '../constants/permissions';

const ROUTE_PREFIX = '/transfer';

const transferPolicy = [{ name: 'admin::hasPermissions', config: { actions: [PERMISSION_UIDS.TRANSFER] } }];

const LocalazyTransferRoutes = [
  {
    method: 'POST',
    path: `${ROUTE_PREFIX}/upload`,
    handler: 'LocalazyTransferController.upload',
    config: {
      policies: transferPolicy,
    },
  },
  {
    method: 'POST',
    path: `${ROUTE_PREFIX}/download`,
    handler: 'LocalazyTransferController.download',
    config: {
      policies: transferPolicy,
    },
  },
];

export default LocalazyTransferRoutes;
