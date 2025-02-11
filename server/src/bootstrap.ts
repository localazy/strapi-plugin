import type { Core } from '@strapi/strapi';
// import RequestInitiatorHelper from './utils/request-initiator-helper';
import deepPopulateHook, { DeepPopulateHookEvent } from './lifecycles/deep-populate-hook';
import { Server } from 'socket.io';
import { WebSocketServer } from 'ws';
const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  // bootstrap phase
  strapi.db.lifecycles.subscribe(async (event) => {
    // const requestInitiatorHelper = new RequestInitiatorHelper(strapi);
    const action = event.action;
    switch (action) {
      case 'beforeFindMany':
      case 'beforeFindOne': {
        deepPopulateHook(event as DeepPopulateHookEvent);
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
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      // this must be a constructor
      wsEngine: WebSocketServer,
    });

    strapi.StrapIO = io;

    io.on('connection', (socket) => {
      console.log('New WebSocket connection:', socket.id);

      socket.on('message', (data) => {
        console.log('Received message from client:', data);
        socket.emit('server_response', { message: 'Hello from Strapi!' });
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    console.log('✅ WebSocket server started');
  });
};

export default bootstrap;
