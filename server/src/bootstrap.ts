import type { Core } from '@strapi/strapi';
import { Server } from 'socket.io';
import { WebSocketServer } from 'ws';
import { PLUGIN_NAME } from './config/core/config';

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {

  if (strapi.plugin(PLUGIN_NAME)?.config('enableSocketIO', true)) {
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
  }
};

export default bootstrap;
