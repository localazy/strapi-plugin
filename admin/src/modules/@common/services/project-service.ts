import { createStrapiApiAxiosInstance } from '../api/strapi-api-base';
import { Project } from '@localazy/api-client';

const strapiApiInstance = createStrapiApiAxiosInstance();
export default class ProjectService {
  static async getConnectedProject(): Promise<Project> {
    try {
      const result = await strapiApiInstance.get(`/project`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }
}
