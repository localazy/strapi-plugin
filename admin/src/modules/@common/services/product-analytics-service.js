import GenericConnectorClient from "../../../plugins/generic-connector-client";
import PluginService from "./plugin.service";

export default class ProductAnalyticsService {
  static async trackAppConnected(userId, project, params = {}) {
    try {
      const data = await this.buildData("Strapi Connected", project, params);
      await GenericConnectorClient.analytics.track({
        event: data.event,
        data: {
          ...data.data,
          userId,
          orgId: project.orgId,
          category: "Project",
        }
      });
    } catch (e) {
      console.warn(e);
    }
  }

  static async trackAppDisconnected(userId, project, params = {}) {
    try {
      const data = await this.buildData("Strapi Disconnected", project, params);
      await GenericConnectorClient.analytics.track({
        event: data.event,
        data: {
          ...data.data,
          userId,
          orgId: project.orgId,
          category: "Project",
        }
      });
    } catch (e) {
      console.warn(e);
    }
  }

  static async trackUploadToLocalazy(userId, project, params = {}) {
    try {
      const data = await this.buildData("Strapi Upload", project, params);
      await GenericConnectorClient.analytics.track({
        event: data.event,
        data: {
          ...data.data,
          userId,
          orgId: project.orgId,
          category: "Project",
        }
      });
    } catch (e) {
      console.warn(e);
    }
  }

  static async trackDownloadToStrapi(userId, project, params = {}) {
    try {
      const data = await this.buildData("Strapi Download", project, params);
      await GenericConnectorClient.analytics.track({
        event: data.event,
        data: {
          ...data.data,
          userId,
          orgId: project.orgId,
          category: "Project",
        }
      });
    } catch (e) {
      console.warn(e);
    }
  }

  static async buildData(event, project, params) {
    const { version } = await PluginService.getPluginVersion();

    return {
      event,
      data: {
        "Project Id": project.id,
        "Project Name": project.name,
        version,
        ...params,
      },
    };
  }
}
