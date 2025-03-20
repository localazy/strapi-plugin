import { Core } from '@strapi/strapi';
import LocalazyApiClientFactory from '../utils/localazy-api-client-factory';
import config from '../config';
import { Project } from '@localazy/api-client';

const LocalazyPubAPIService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async listFiles(projectId: string) {
    try {
      const LocalazyApi = await LocalazyApiClientFactory();
      const result = await LocalazyApi.files.list({ project: projectId });

      return result;
    } catch (e) {
      strapi.log.error(e);
      return [];
    }
  },
  async getStrapiFile(projectId: string) {
    const files = await this.listFiles(projectId);
    const strapiFile = files.find(
      (file) =>
        file.type === config.default.LOCALAZY_DEFAULT_FILE_EXTENSION &&
        file.name === config.default.LOCALAZY_DEFAULT_FILE_NAME
    );

    return strapiFile;
  },
  async listProjects(addOrganization = true, addLanguages = true) {
    try {
      const LocalazyApi = await LocalazyApiClientFactory();
      const result = await LocalazyApi.projects.list({
        organization: addOrganization,
        languages: addLanguages,
      });

      return result;
    } catch (e) {
      strapi.log.error(e);
      return [];
    }
  },
  async getProject(projectId: string, addOrganization = true, addLanguages = true): Promise<Project | null> {
    try {
      const projects = await this.listProjects(addOrganization, addLanguages);
      return projects.find((project) => project.id === projectId) || null;
    } catch (e) {
      strapi.log.error(e);
      return null;
    }
  },
  async getWebhooksSecret(projectId: string) {
    try {
      const LocalazyApi = await LocalazyApiClientFactory();
      const result = await LocalazyApi.webhooks.getSecret({ project: projectId });

      return result;
    } catch (e) {
      strapi.log.error(e);
      return null;
    }
  },
});

export type LocalazyPubAPIServiceReturnType = ReturnType<typeof LocalazyPubAPIService>;

export default LocalazyPubAPIService;
