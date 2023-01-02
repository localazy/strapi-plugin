"use strict";

const getLocalazyApi = require("../utils/get-localazy-api");
const config = require("../config").default;

module.exports = ({ strapi }) => ({
  async listFiles(projectId) {
    try {
      const LocalazyApi = await getLocalazyApi();
      const result = await LocalazyApi.listFiles({ projectId });

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
      const LocalazyApi = await getLocalazyApi();
      const result = await LocalazyApi.listProjects({
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
    const LocalazyApi = await getLocalazyApi();
    const result = await LocalazyApi.getWebhooksSecret({ projectId });

    return result;
  }
});
