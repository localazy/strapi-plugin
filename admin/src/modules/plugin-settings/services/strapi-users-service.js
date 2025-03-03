/* eslint-disable no-useless-catch */
import createAxiosInstance from "../../../utils/createAxiosInstance";

const axiosInstance = createAxiosInstance("/admin/users");

export default class PluginSettingsService {
  static async getAdminPanelUsers() {
    try {
      // TODO: update to return all users; not just the first 100
      const result = await axiosInstance.get(
        "",
        {
          params: {
            "pageSize": 100,
            "page": 1,
            "sort": "firstname"
          }
        }
      );

      return result.data.data.results;
    } catch (e) {
      throw e;
    }
  }
}
