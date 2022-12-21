"use strict";

const deepPopulateHook = require('./lifecycles/deep-populate-hook');
const uploadEventEntryToLocalazyHook = require('./lifecycles/upload-event-entry-to-localazy-hook');

module.exports = ({ strapi }) => {
  // bootstrap phase
  // Subscribe to the lifecycles that we are interested in.
  strapi.db.lifecycles.subscribe(async (event) => {
    switch (event.action) {
      case 'beforeFindMany':
      case 'beforeFindOne': {
        deepPopulateHook(event);
        break;
      }
      case 'afterCreate':
      case 'afterUpdate': {
        try {
          uploadEventEntryToLocalazyHook(event).then((result) => {
            if (typeof result !== 'undefined') {
              strapi.log.info(`${event.action} hook result: ${JSON.stringify(result)}`);
            }
          });

        } catch (e) {
          strapi.log.error(e);
        } finally {
          break;
        }
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
