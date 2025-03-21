import type { Core } from '@strapi/strapi';
import type { Context } from '@strapi/types/dist/modules/documents/middleware';
import uploadEventEntryToLocalazyHook from './lifecycles/upload-event-entry-to-localazy-hook';
import deprecateEventEntryInLocalazyHook from './lifecycles/deprecate-event-entry-in-localazy-hook';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.documents.use(async (context: Context, next) => {
    let result;
    switch (context.action) {
      case 'create':
      case 'update':
        try {
          result = await next();

          const hookResult = await uploadEventEntryToLocalazyHook({
            context,
            documentId: result.documentId,
            locale: context.params.locale || context['locale'],
          });
          if (typeof hookResult !== 'undefined') {
            strapi.log.info(`${context.action} hook result: ${JSON.stringify(hookResult)}`);
          }
        } catch (e) {
          strapi.log.error(e);
        } finally {
          break;
        }
      case 'delete': {
        try {
          const hookResult = await deprecateEventEntryInLocalazyHook({
            context,
            documentId: context.params.documentId,
            locale: context.params.locale || context['locale'],
          });
          if (typeof hookResult !== 'undefined') {
            strapi.log.info(`${context.action} hook result: ${JSON.stringify(hookResult)}`);
          }
          result = await next();
        } catch (e) {
          strapi.log.error(e);
        } finally {
          break;
        }
      }
      default:
        result = await next();
        break;
    }

    // Modify the result as necessary before returning it

    return result;
  });
};

export default register;
