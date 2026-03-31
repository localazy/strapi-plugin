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

  static async getWebhookStatus(): Promise<{ status: string; url?: string }> {
    const result = await strapiApiInstance.get(`/project/webhooks`);
    return result.data;
  }

  static async setupWebhook(url: string) {
    const result = await strapiApiInstance.post(`/project/webhooks/setup`, { url });
    return result.data;
  }

  static async getStrapiUrl(): Promise<{ url: string }> {
    const result = await strapiApiInstance.get(`/project/strapi-url`);
    return result.data;
  }
}
