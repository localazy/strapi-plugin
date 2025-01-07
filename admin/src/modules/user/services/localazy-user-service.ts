/* eslint-disable no-useless-catch */
import { createStrapiApiAxiosInstance } from "../../@common/api/strapi-api-base";
import { LocalazyIdentity } from "../model/localazy-identity";

const BASE_PATH = "/user";
const strapiApiInstance = createStrapiApiAxiosInstance();

export default class LocalazyUserService {
  static async getIdentity(): Promise<LocalazyIdentity | null> {
    try {
      const result = await strapiApiInstance.get(`${BASE_PATH}`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async updateIdentity(localazyIdentity: LocalazyIdentity) {
    try {
      // store in DB plugin settings
      const result = await strapiApiInstance.put(`${BASE_PATH}`, localazyIdentity);

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async deleteIdentity() {
    try {
      const result = await strapiApiInstance.delete(`${BASE_PATH}`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }
}
