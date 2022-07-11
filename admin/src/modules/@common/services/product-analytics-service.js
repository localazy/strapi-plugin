import AnalyticsService from "../../../plugins/analytics-service";

export default class ProductAnalyticsService {
  static async trackAppConnected(userId, project, params = {}) {
    try {
      const data = this.buildData(userId, "Strapi Connected", project, params);
      await AnalyticsService.trackEvent(data.event, {
        ...data.data,
        userId,
        category: "Project",
      });
    } catch (e) {
      console.warn(e);
    }
  }

  static async trackAppDisconnected(userId, project, params = {}) {
    try {
      const data = this.buildData(userId, "Strapi Disconnected", project, params);
      await AnalyticsService.trackEvent(data.event, {
        ...data.data,
        userId,
        category: "Project",
      });
    } catch (e) {
      console.warn(e);
    }
  }

  static async trackUploadToLocalazy(userId, project, params = {}) {
    try {
      const data = this.buildData(userId, "Strapi Upload", project, params);
      await AnalyticsService.trackEvent(data.event, {
        ...data.data,
        userId,
        category: "Project",
      });
    } catch (e) {
      console.warn(e);
    }
  }

  static async trackDownloadToFigma(userId, project, params = {}) {
    try {
      const data = this.buildData(userId, "Strapi Download", project, params);
      await AnalyticsService.trackEvent(data.event, {
        ...data.data,
        userId,
        category: "Project",
      });
    } catch (e) {
      console.warn(e);
    }
  }

  static buildData(userId, event, project, params) {
    return {
      event,
      data: {
        "User Id": userId,
        "Project Id": project.id,
        "Project Name": project.name,
        ...params,
      },
    };
  }
}
