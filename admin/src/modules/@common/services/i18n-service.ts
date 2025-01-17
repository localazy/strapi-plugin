/* eslint-disable no-useless-catch */
import { createStrapiApiAxiosInstance } from "../api/strapi-api-base";

// TODO: ADD TYPES

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
