import type { Core } from '@strapi/strapi';
import { buildDebugBundle, SessionNotFoundError } from '../utils/build-debug-bundle';

const DebugBundleController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getBundle(ctx) {
    const { sessionId } = ctx.params;
    const browserPayloadEncoded = typeof ctx.query.browser === 'string' ? ctx.query.browser : null;

    try {
      const { zipBuffer, filename } = await buildDebugBundle({
        strapi,
        sessionId,
        browserPayloadEncoded,
      });
      ctx.type = 'application/zip';
      ctx.set('Content-Disposition', `attachment; filename="${filename}"`);
      ctx.body = zipBuffer;
    } catch (err) {
      if (err instanceof SessionNotFoundError) {
        return ctx.notFound('Session not found');
      }
      strapi.log.error(`[localazy] failed to build debug bundle: ${err instanceof Error ? err.message : err}`);
      throw err;
    }
  },
});

export default DebugBundleController;
