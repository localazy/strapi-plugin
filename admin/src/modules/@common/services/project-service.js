/* eslint-disable no-useless-catch */
import createAxiosInstance from "../../../utils/createAxiosInstance";

const axiosInstance = createAxiosInstance();
export default class ProjectService {
  static async getConnectedProject() {
    try {
      const result = await axiosInstance.get(`/project`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }
}
