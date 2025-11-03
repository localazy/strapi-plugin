const ROUTE_PREFIX = '/entry-exclusion';

const EntryExclusionRoutes = [
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/:contentType/:documentId`,
    handler: 'EntryExclusionController.getEntryExclusion',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: `${ROUTE_PREFIX}/:contentType/:documentId`,
    handler: 'EntryExclusionController.setEntryExclusion',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: `${ROUTE_PREFIX}/:contentType`,
    handler: 'EntryExclusionController.getContentTypeExclusions',
    config: {
      policies: [],
    },
  },
];

export default EntryExclusionRoutes;
