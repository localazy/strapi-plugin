import { createStrapiApiAxiosInstance } from '../../@common/api/strapi-api-base';

const BASE_PATH = '/activity-logs';
const axiosInstance = createStrapiApiAxiosInstance();

export default class ActivityLogsService {
  static async getSessions(type?: string) {
    try {
      const params = type ? `?type=${type}` : '';
      const result = await axiosInstance.get(`${BASE_PATH}${params}`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async getSession(sessionId: string) {
    try {
      const result = await axiosInstance.get(`${BASE_PATH}/${sessionId}`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async clearSessions() {
    try {
      const result = await axiosInstance.delete(`${BASE_PATH}`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }
}
