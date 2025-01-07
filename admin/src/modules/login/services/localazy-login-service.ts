/* eslint-disable no-useless-catch */
import { createStrapiApiAxiosInstance } from "../../@common/api/strapi-api-base";

const BASE_PATH = "/auth";
const axiosInstance = createStrapiApiAxiosInstance();

export default class LocalazyLoginService {
  static async generateKeys() {
    try {
      const result = await axiosInstance.get(`${BASE_PATH}/generate-keys`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async continuousPoll(readKey: string) {
    try {
      const result = await axiosInstance.get(
        `${BASE_PATH}/continuous-poll?readKey=${readKey}`
      );

      return result.data;
    } catch (e) {
      throw e;
    }
  }
}
