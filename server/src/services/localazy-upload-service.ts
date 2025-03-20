import type { Core } from '@strapi/strapi';
import LocalazyApiClientFactory from '../utils/localazy-api-client-factory';
import { getLocalazyUserService } from '../core';

const LocalazyUploadService = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Upload data to Localazy.
   * Use config to adjust the upload process.
   * Returns status and id of a last chunk
   */
  async upload(file, config = {}) {
    try {
      const LocalazyApi = await LocalazyApiClientFactory();
      const user = await getLocalazyUserService().getUser();

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

  createImportFileRepresentation(sourceLang: string, strings: Record<string, any>) {
    const file = {
      [sourceLang]: {
        ...strings,
      },
    };

    return file;
  },
});

export type LocalazyUploadServiceReturnType = ReturnType<typeof LocalazyUploadService>;

export default LocalazyUploadService;
