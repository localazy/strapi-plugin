"use strict";

const localazyApiClientFactory = require("../utils/localazy-api-client-factory");
const config = require("../config").default;

module.exports = ({ strapi }) => ({
  async listFiles(projectId) {
    try {
      const LocalazyApi = await localazyApiClientFactory();
      const result = await LocalazyApi.files.list({ project: projectId });

      return result;
    } catch (e) {
      strapi.console.error(e);
      return [];
    }
  },
  async getStrapiFile(projectId) {
    const files = await this.listFiles(projectId);
    const strapiFile = files.find(
      (file) =>
        file.type === config.LOCALAZY_DEFAULT_FILE_EXTENSION &&
        file.name === config.LOCALAZY_DEFAULT_FILE_NAME
    );

    return strapiFile;
  },
  async listProjects(addOrganization = true, addLanguages = true) {
    try {
      const LocalazyApi = await localazyApiClientFactory();
      const result = await LocalazyApi.projects.list({
        organization: addOrganization,
        languages: addLanguages,
      });

      return result;
    } catch (e) {
      strapi.console.error(e);
      return [];
    }
  },
  async getProject(projectId, addOrganization = true, addLanguages = true) {
    const projects = await this.listProjects(addOrganization, addLanguages);

    return projects.find((project) => project.id === projectId);
  },
  async getWebhooksSecret(projectId) {
    const LocalazyApi = await localazyApiClientFactory();
    const result = await LocalazyApi.webhooks.getSecret({ project: projectId });

    return result;
  }
});
