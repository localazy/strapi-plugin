/* eslint-disable no-useless-catch */
import createAxiosInstance from "../../../utils/createAxiosInstance";

const axiosInstance = createAxiosInstance();

export default class PluginService {
  static async getPluginVersion() {
    try {
      const result = await axiosInstance.get("/strapi/version");

      return result.data;
    } catch (e) {
      throw e;
    }
  }
}
