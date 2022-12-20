"use strict";

const deepPopulateHook = require('./lifecycles/deep-populate-hook');
const afterCreateUpdateDelete = require('./lifecycles/after-create-hooks');

module.exports = ({ strapi }) => {
  // bootstrap phase
  // Subscribe to the lifecycles that we are intrested in.
  strapi.db.lifecycles.subscribe(async (event) => {
    switch (event.action) {
      case 'beforeFindMany':
      case 'beforeFindOne': {
        deepPopulateHook(event);
        break;
      }
      case 'afterCreate':
      case 'afterUpdate': {
        await afterCreateUpdateDelete(event);
        break;
      }
      case 'beforeDelete': {
        // TODO: set keys as deprecated
        break;
      }
      default:
        break;
    }
  });
};
