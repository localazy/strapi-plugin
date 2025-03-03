/* eslint-disable no-useless-catch */
import createAxiosInstance from "../../../utils/createAxiosInstance";

const BASE_PATH = "/user";
const axiosInstance = createAxiosInstance();

export default class LocalazyUserService {
  static async getIdentity() {
    try {
      const result = await axiosInstance.get(`${BASE_PATH}`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async updateIdentity(localazyIdentity) {
    try {
      // store in DB plugin settings
      const result = await axiosInstance.put(`${BASE_PATH}`, localazyIdentity);

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async deleteIdentity() {
    try {
      const result = await axiosInstance.delete(`${BASE_PATH}`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }
}
