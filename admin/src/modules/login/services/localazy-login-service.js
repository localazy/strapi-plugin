/* eslint-disable no-useless-catch */
import createAxiosInstance from "../../../utils/createAxiosInstance";

const BASE_PATH = "/auth";
const axiosInstance = createAxiosInstance();

export default class LocalazyLoginService {
  static async generateKeys() {
    try {
      const result = await axiosInstance.get(`${BASE_PATH}/generate-keys`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async continuousPoll(readKey) {
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
