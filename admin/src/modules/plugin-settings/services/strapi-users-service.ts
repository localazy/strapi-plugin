import { createStrapiApiAxiosInstance } from '../../@common/api/strapi-api-base';
import { AdminPanelUser } from '../models/admin-panel-user';
export default class PluginSettingsService {
  static async getAdminPanelUsers(): Promise<AdminPanelUser[]> {
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
