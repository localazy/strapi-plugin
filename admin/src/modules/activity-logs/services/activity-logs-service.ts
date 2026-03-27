import { createStrapiApiAxiosInstance } from '../../@common/api/strapi-api-base';

const BASE_PATH = '/activity-logs';
const axiosInstance = createStrapiApiAxiosInstance();

export default class ActivityLogsService {
  static async getSessions(type?: string) {
    const params = type ? `?type=${type}` : '';
    const result = await axiosInstance.get(`${BASE_PATH}${params}`);

    return result.data;
  }

  static async getSession(sessionId: string) {
    const result = await axiosInstance.get(`${BASE_PATH}/${sessionId}`);

    return result.data;
  }

  static async clearSessions() {
    const result = await axiosInstance.delete(`${BASE_PATH}`);

    return result.data;
  }
}
