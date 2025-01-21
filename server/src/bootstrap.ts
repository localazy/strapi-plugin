import type { Core } from '@strapi/strapi';
import RequestInitiatorHelper from './utils/request-initiator-helper';
import deepPopulateHook from './lifecycles/deep-populate-hook';

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  // bootstrap phase
  strapi.db.lifecycles.subscribe(async (event) => {
    const requestInitiatorHelper = new RequestInitiatorHelper(strapi);
    const action = event.action;
    switch (action) {
      case 'beforeFindMany':
      case 'beforeFindOne': {
        deepPopulateHook(event);
        break;
      }
      // TODO: add hooks
      // case 'afterCreate':
      // case 'afterUpdate': {
      //   try {
      //     if (requestInitiatorHelper.isInitiatedByLocalazyWebhook() || requestInitiatorHelper.isInitiatedByLocalazyPluginUI()) {
      //       break;
      //     }

      //     uploadEventEntryToLocalazyHook(event).then((result) => {
      //       if (typeof result !== 'undefined') {
      //         strapi.log.info(`${action} hook result: ${JSON.stringify(result)}`);
      //       }
      //     });
      //   } catch (e) {
      //     strapi.log.error(e);
      //   } finally {
      //     break;
      //   }
      // }
      // case 'beforeDeleteMany':
      // case 'beforeDelete': {
      //   try {
      //     if (requestInitiatorHelper.isInitiatedByLocalazyWebhook() || requestInitiatorHelper.isInitiatedByLocalazyPluginUI()) {
      //       break;
      //     }

      //     // have to await here
      //     const result = await deprecateEventEntryInLocalazyHook(event);
      //     if (typeof result !== 'undefined') {
      //       strapi.log.info(`${action} hook result: ${JSON.stringify(result)}`);
      //     }
      //   } catch (e) {
      //     strapi.log.error(e);
      //   } finally {
      //     break;
      //   }
      // }
      default:
        break;
    }
  });

  process.nextTick(async () => {
    // TODO: implement sockets
    // const StrapiIOInstance = await strapio(strapi);
    // console.log('StrapiIOInstance', StrapiIOInstance);
    // strapi.StrapIO = StrapiIOInstance;
  });
};

export default bootstrap;
