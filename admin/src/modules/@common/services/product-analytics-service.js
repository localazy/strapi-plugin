import GenericConnectorClient from "../../../plugins/generic-connector-client";

export default class ProductAnalyticsService {
  static async trackAppConnected(userId, project, params = {}) {
    try {
      const data = this.buildData("Strapi Connected", project, params);
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
      const data = this.buildData("Strapi Disconnected", project, params);
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
      const data = this.buildData("Strapi Upload", project, params);
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
      const data = this.buildData("Strapi Download", project, params);
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

  static buildData(event, project, params) {
    return {
      event,
      data: {
        "Project Id": project.id,
        "Project Name": project.name,
        ...params,
      },
    };
  }
}
