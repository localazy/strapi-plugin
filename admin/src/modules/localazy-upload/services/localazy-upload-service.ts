import { createStrapiApiAxiosInstance } from "../../@common/api/strapi-api-base";


const BASE_PATH = "/transfer";

export default class LocalazyUploadService {
  static async upload(data = {}) {
    try {
      const strapiApiInstance = createStrapiApiAxiosInstance();
      const result = await strapiApiInstance.post(`${BASE_PATH}/upload`, data);

      return result.data;
    } catch (e: any) {
      throw e.data;
    }
  }
}
