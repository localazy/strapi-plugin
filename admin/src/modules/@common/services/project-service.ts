/* eslint-disable no-useless-catch */
import { createStrapiApiAxiosInstance } from "../api/strapi-api-base";

const strapiApiInstance = createStrapiApiAxiosInstance();
export default class ProjectService {
  static async getConnectedProject() {
    try {
      const result = await strapiApiInstance.get(`/project`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }
}
