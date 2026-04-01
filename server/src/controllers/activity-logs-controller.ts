import { Core } from '@strapi/strapi';
import { getActivityLogsService } from '../core';

const ActivityLogsController = ({ strapi: _strapi }: { strapi: Core.Strapi }) => ({
  async getSessions(ctx) {
    const { type } = ctx.query;
    ctx.body = await getActivityLogsService().getSessions(type);
  },

  async getSession(ctx) {
    const { sessionId } = ctx.params;
    const session = await getActivityLogsService().getSession(sessionId);

    if (!session) {
      return ctx.notFound('Session not found');
    }

    ctx.body = session;
  },

  async exportSessions(ctx) {
    ctx.body = await getActivityLogsService().getAllSessionsWithEntries();
  },

  async clearSessions(ctx) {
    await getActivityLogsService().clearSessions();
    ctx.body = { success: true };
  },
});

export default ActivityLogsController;
