import createAxiosInstance from "../../../utils/createAxiosInstance";

const BASE_PATH = "/strapi";
const axiosInstance = createAxiosInstance();

export default class StrapiModelService {
  static async getModels() {
    try {
      const result = await axiosInstance.get(`${BASE_PATH}/models`);

      return result.data;
    } catch (e) {
      throw e.message;
    }
  }

  static async getLocalizableModels() {
    try {
      const result = await axiosInstance.get(`${BASE_PATH}/localizable-models`);

      return result.data;
    } catch (e) {
      throw e.message;
    }
  }
}
