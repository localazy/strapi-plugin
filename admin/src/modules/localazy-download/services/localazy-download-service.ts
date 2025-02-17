import { createStrapiApiAxiosInstance } from '../../@common/api/strapi-api-base';

const BASE_PATH = '/transfer';

export default class LocalazyDownloadService {
  static async download(data = {}) {
    try {
      const strapiApiInstance = createStrapiApiAxiosInstance();
      const result = await strapiApiInstance.post(`${BASE_PATH}/download`, data);

      return result.data;
    } catch (e: any) {
      throw e.data;
    }
  }
}
