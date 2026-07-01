import { createStrapiApiAxiosInstance } from '../../@common/api/strapi-api-base';

// TODO: ADD TYPES

const BASE_PATH = '/plugin-settings';
const axiosInstance = createStrapiApiAxiosInstance();

export default class PluginSettingsService {
  static async getContentTransferSetup() {
    try {
      const result = await axiosInstance.get(`${BASE_PATH}/content-transfer-setup`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async updateContentTransferSetup(data: any) {
    try {
      const result = await axiosInstance.put(`${BASE_PATH}/content-transfer-setup`, data);

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async getPluginSettings() {
    try {
      const result = await axiosInstance.get(`${BASE_PATH}/plugin-settings`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async updatePluginSettings(data: any) {
    try {
      const result = await axiosInstance.put(`${BASE_PATH}/plugin-settings`, data);

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  // Read-gated counterpart for per-user UI prefs (last visited route, sort
  // prefs). Server filters the body to a fixed allowlist; sending anything else
  // is silently dropped, so callers must only pass UI-pref fields here.
  static async updatePluginSettingsUiPrefs(data: { defaultRoute?: string; activityLogsSort?: any }) {
    try {
      const result = await axiosInstance.put(`${BASE_PATH}/ui-prefs`, data);

      return result.data;
    } catch (e) {
      throw e;
    }
  }

  static async getSyncCursor() {
    try {
      const result = await axiosInstance.get(`${BASE_PATH}/sync-cursor`);

      return result.data;
    } catch (e) {
      throw e;
    }
  }
}
