"use strict";

const deepPopulateHook = require('./lifecycles/deep-populate-hook');
const uploadEventEntryToLocalazyHook = require('./lifecycles/upload-event-entry-to-localazy-hook');
const deprecateEventEntryInLocalazyHook = require('./lifecycles/deprecate-event-entry-in-localazy-hook');

const isTriggeredByLocalazyWebhook = () => {
  const ctx = strapi.requestContext.get();
  if (typeof ctx !== 'undefined') {
    const ctxHeaders = ctx.headers;
    const xLocalazyHmac = ctxHeaders["x-localazy-hmac"];
    const xLocalazyTimestamp = ctxHeaders["x-localazy-timestamp"];
    if (!!xLocalazyHmac && !!xLocalazyTimestamp) {
      return true;
    }
  }
  return false;
}

module.exports = ({ strapi }) => {
  // bootstrap phase
  // Subscribe to the lifecycles that we are interested in.
  strapi.db.lifecycles.subscribe(async (event) => {
    const action = event.action;
    switch (action) {
      case 'beforeFindMany':
      case 'beforeFindOne': {
        deepPopulateHook(event);
        break;
      }
      case 'afterCreate':
      case 'afterUpdate': {
        try {
          if (isTriggeredByLocalazyWebhook()) {
            break;
          }

          uploadEventEntryToLocalazyHook(event).then((result) => {
            if (typeof result !== 'undefined') {
              strapi.log.info(`${action} hook result: ${JSON.stringify(result)}`);
            }
          });
        } catch (e) {
          strapi.log.error(e);
        } finally {
          break;
        }
      }
      case 'beforeDeleteMany':
      case 'beforeDelete': {
        try {
          // have to await here
          const result = await deprecateEventEntryInLocalazyHook(event);
          if (typeof result !== 'undefined') {
            strapi.log.info(`${action} hook result: ${JSON.stringify(result)}`);
          }
        } catch (e) {
          strapi.log.error(e);
        } finally {
          break;
        }
      }
      default:
        break;
    }
  });
};
