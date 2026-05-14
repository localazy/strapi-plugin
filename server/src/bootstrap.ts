import type { Core } from '@strapi/strapi';
import { Server } from 'socket.io';
import { WebSocketServer } from 'ws';
import { PLUGIN_NAME } from './config/core/config';
import { LOCALAZY_RBAC_ACTIONS } from './constants/permissions';

const registerRbacActions = async (strapi: Core.Strapi) => {
  try {
    const permissionService = strapi.service('admin::permission') as
      | { actionProvider?: { registerMany?: (actions: unknown[]) => Promise<unknown> } }
      | undefined;
    const actionProvider = permissionService?.actionProvider;

    if (!actionProvider?.registerMany) {
      strapi.log.warn(
        `[${PLUGIN_NAME}] admin::permission.actionProvider unavailable — skipping RBAC action registration`
      );
      return;
    }

    await actionProvider.registerMany(LOCALAZY_RBAC_ACTIONS);
  } catch (error) {
    strapi.log.warn(
      `[${PLUGIN_NAME}] Failed to register RBAC actions: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  await registerRbacActions(strapi);

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
