import { Core } from "@strapi/strapi";
import LocalazyApiClientFactory from "../utils/localazy-api-client-factory";
import config from "../config";

const LocalazyPubAPIService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async listFiles(projectId) {
    try {
      const LocalazyApi = await LocalazyApiClientFactory();
      const result = await LocalazyApi.files.list({ project: projectId });

      return result;
    } catch (e) {
      // TODO: Is strapi.console -> strapi.log correct?
      strapi.log.error(e);
      return [];
    }
  },
  async getStrapiFile(projectId) {
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
      // TODO: Is strapi.console -> strapi.log correct?
      strapi.log.error(e);
      return [];
    }
  },
  async getProject(projectId, addOrganization = true, addLanguages = true) {
    const projects = await this.listProjects(addOrganization, addLanguages);

    return projects.find((project) => project.id === projectId);
  },
  async getWebhooksSecret(projectId) {
    const LocalazyApi = await LocalazyApiClientFactory();
    const result = await LocalazyApi.webhooks.getSecret({ project: projectId });

    return result;
  }
});

export default LocalazyPubAPIService;
