"use strict";

const beforeFindHooks = require('./lifecycles/before-find-hooks');
const afterCreateUpdateDelete = require('./lifecycles/after-create-hooks');

module.exports = ({ strapi }) => {
  // bootstrap phase
  // Subscribe to the lifecycles that we are intrested in.
  strapi.db.lifecycles.subscribe(async (event) => {
    switch (event.action) {
      case 'beforeFindMany':
      case 'beforeFindOne': {
        beforeFindHooks(event);
        break;
      }
      case 'afterCreate':
      case 'afterUpdate':
      case 'afterDelete': {
        await afterCreateUpdateDelete(event);
        break;
      }
    }
  });
};
