/* eslint-disable no-useless-catch */
import createAxiosInstance from "../../../utils/createAxiosInstance";

const axiosInstance = createAxiosInstance("/i18n");
export default class I18nService {
  static async getLocales() {
    try {
      const result = await axiosInstance.get(`/locales`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }
}
