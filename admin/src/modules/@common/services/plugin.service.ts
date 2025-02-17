import { createStrapiApiAxiosInstance } from '../api/strapi-api-base';

const strapiApiInstance = createStrapiApiAxiosInstance();

export default class PluginService {
  static async getPluginVersion() {
    try {
      const result = await strapiApiInstance.get('/strapi/version');

      return result.data;
    } catch (e) {
      throw e;
    }
  }
}
