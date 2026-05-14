import { PERMISSION_UIDS } from '../constants/permissions';

const ROUTE_PREFIX = '/entry-exclusion';

const readPolicy = [{ name: 'admin::hasPermissions', config: { actions: [PERMISSION_UIDS.READ] } }];
const transferPolicy = [{ name: 'admin::hasPermissions', config: { actions: [PERMISSION_UIDS.TRANSFER] } }];

const EntryExclusionRoutes = [
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/:contentType/:documentId`,
    handler: 'EntryExclusionController.getEntryExclusion',
    config: {
      policies: readPolicy,
    },
  },
  {
    method: 'PUT',
    path: `${ROUTE_PREFIX}/:contentType/:documentId`,
    handler: 'EntryExclusionController.setEntryExclusion',
    config: {
      policies: transferPolicy,
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/:contentType`,
    handler: 'EntryExclusionController.getContentTypeExclusions',
    config: {
      policies: readPolicy,
    },
  },
];

export default EntryExclusionRoutes;
