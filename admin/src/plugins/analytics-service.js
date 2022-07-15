import createPluginConnectorAxiosInstance from "../utils/createPluginConnectorAxiosInstance";

const ANALYTICS_PATH = "/analytics";
const axiosInstance = createPluginConnectorAxiosInstance();
export default class AnalyticsService {
  static async trackEvent(event, data) {
    const result = await axiosInstance.post(`${ANALYTICS_PATH}/track`, {
      event,
      ...data,
    });

    return result.data;
  }
}
