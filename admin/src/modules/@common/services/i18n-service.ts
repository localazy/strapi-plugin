/* eslint-disable no-useless-catch */
import { createStrapiApiAxiosInstance } from "../api/strapi-api-base";

const strapiApiInstance = createStrapiApiAxiosInstance("/i18n");
export default class I18nService {
  static async getLocales() {
    try {
      const result = await strapiApiInstance.get(`/locales`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }
}
