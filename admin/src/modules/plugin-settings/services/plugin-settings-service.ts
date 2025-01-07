/* eslint-disable no-useless-catch */
import { createStrapiApiAxiosInstance } from "../../@common/api/strapi-api-base";

// TODO: ADD TYPES

const BASE_PATH = "/plugin-settings";
const axiosInstance = createStrapiApiAxiosInstance();

export default class PluginSettingsService {
  static async getContentTransferSetup() {
    try {
      const result = await axiosInstance.get(
        `${BASE_PATH}/content-transfer-setup`
      );

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async updateContentTransferSetup(data: any) {
    try {
      const result = await axiosInstance.put(
        `${BASE_PATH}/content-transfer-setup`,
        data
      );

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async getPluginSettings() {
    try {
      const result = await axiosInstance.get(`${BASE_PATH}/plugin-settings`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async updatePluginSettings(data: any) {
    try {
      const result = await axiosInstance.put(
        `${BASE_PATH}/plugin-settings`,
        data
      );

      return result.data;
    } catch (e) {
      throw e;
    }
  }
}
