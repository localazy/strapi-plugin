import { createStrapiApiAxiosInstance } from '../api/strapi-api-base';

const BASE_PATH = '/user';
const strapiApiInstance = createStrapiApiAxiosInstance();
export default class UserService {
  static async generateKeys() {
    try {
      const result = await strapiApiInstance.get(`${BASE_PATH}/token`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async continuousPoll(token: string) {
    try {
      const result = await strapiApiInstance.post(`${BASE_PATH}/token`, {
        token,
      });

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async deleteToken() {
    try {
      const result = await strapiApiInstance.delete(`${BASE_PATH}/token`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }
}
