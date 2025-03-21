import type { Core } from '@strapi/strapi';
import deepPopulateHook, { DeepPopulateHookEvent } from './lifecycles/deep-populate-hook';
import { Server } from 'socket.io';
import { WebSocketServer } from 'ws';

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  // bootstrap phase
  strapi.db.lifecycles.subscribe(async (event) => {
    const action = event.action;
    switch (action) {
      case 'beforeFindMany':
      case 'beforeFindOne': {
        deepPopulateHook(event as DeepPopulateHookEvent);
        break;
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
