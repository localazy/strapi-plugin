import { createStrapiApiAxiosInstance } from '../../@common/api/strapi-api-base';

export default class PluginSettingsService {
  static async getAdminPanelUsers() {
    try {
      const axiosInstance = createStrapiApiAxiosInstance('/admin/users');

      // TODO: update to return all users; not just the first 100
      const result = await axiosInstance.get('', {
        params: {
          pageSize: 100,
          page: 1,
          sort: 'firstname',
        },
      });

      return result.data.data.results;
    } catch (e) {
      throw e;
    }
  }
}
