/* eslint-disable no-useless-catch */
import createAxiosInstance from "../../../utils/createAxiosInstance";

const BASE_PATH = "/user";
const axiosInstance = createAxiosInstance();
export default class UserService {
  static async generateKeys() {
    try {
      const result = await axiosInstance.get(`${BASE_PATH}/token`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async continuousPoll(token) {
    try {
      const result = await axiosInstance.post(`${BASE_PATH}/token`, {
        token,
      });

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async deleteToken() {
    try {
      const result = await axiosInstance.delete(`${BASE_PATH}/token`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }
}
