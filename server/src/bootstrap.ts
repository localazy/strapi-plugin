import type { Core } from '@strapi/strapi';
import RequestInitiatorHelper from './utils/request-initiator-helper';
import deepPopulateHook, { DeepPopulateHookEvent } from './lifecycles/deep-populate-hook';
import { Server } from 'socket.io';
import { WebSocketServer } from 'ws';
import uploadEventEntryToLocalazyHook from './lifecycles/upload-event-entry-to-localazy-hook';
import deprecateEventEntryInLocalazyHook from './lifecycles/deprecate-event-entry-in-localazy-hook';

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  // bootstrap phase
  strapi.db.lifecycles.subscribe(async (event) => {
    const requestInitiatorHelper = new RequestInitiatorHelper(strapi);
    const action = event.action;
    switch (action) {
      case 'beforeFindMany':
      case 'beforeFindOne': {
        deepPopulateHook(event as DeepPopulateHookEvent);
        break;
      }
      case 'afterCreate':
      case 'afterUpdate': {
        try {
          if (
            requestInitiatorHelper.isInitiatedByLocalazyWebhook() ||
            requestInitiatorHelper.isInitiatedByLocalazyPluginUI()
          ) {
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
      /**
       * 'beforeDeleteMany' won't ever be called in Strapi 5
       * See https://docs.strapi.io/dev-docs/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service#breaking-change-description
       */
      case 'beforeDelete': {
        try {
          if (
            requestInitiatorHelper.isInitiatedByLocalazyWebhook() ||
            requestInitiatorHelper.isInitiatedByLocalazyPluginUI()
          ) {
            break;
          }

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

  process.nextTick(async () => {
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      // this must be a constructor
      wsEngine: WebSocketServer,
    });

    strapi.StrapIO = io;
  });
};

export default bootstrap;
