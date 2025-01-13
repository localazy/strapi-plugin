import { createStrapiApiAxiosInstance } from "../../@common/api/strapi-api-base";

const BASE_PATH = "/strapi";
const strapiApiAxiosInstance = createStrapiApiAxiosInstance();

export default class StrapiModelService {
  static async getModels() {
    try {
      const result = await strapiApiAxiosInstance.get(`${BASE_PATH}/models`);

      return result.data;
    } catch (e: any) {
      throw e.message;
    }
  }

  static async getLocalizableModels() {
    try {
      const result = await strapiApiAxiosInstance.get(`${BASE_PATH}/localizable-models`);

      return result.data;
    } catch (e: any) {
      throw e.message;
    }
  }
}
