import type { Core } from '@strapi/strapi';
import localazyApiClientFactory from '../utils/localazy-api-client-factory';

const LocalazyUploadService = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Upload data to Localazy.
   * Use config to adjust the upload process.
   * Returns status and id of a last chunk
   */
  async upload(file, config = {}) {
    try {
      const LocalazyApi = await localazyApiClientFactory();
      const user = await strapi.plugin('strapi-plugin-v5').service('LocalazyUserService').getUser();

      const result = await LocalazyApi.import.json({
        project: user.project.id,
        json: file,
        ...config,
      });

      return {
        success: true,
        result,
      };
    } catch (e) {
      strapi.log.error(e);
      return {
        success: false,
        message: e.message,
      };
    }
  },

  createImportFileRepresentation(sourceLang, strings) {
    const file = {
      [sourceLang]: {
        ...strings,
      },
    };

    return file;
  },
});

export default LocalazyUploadService;
