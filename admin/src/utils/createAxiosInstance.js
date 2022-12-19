/**
 * axios with a custom config.
 */

import axios from "axios";
import { auth } from "@strapi/helper-plugin";
import pluginId from "../pluginId";

console.log('process.env', process.env);
const BASE_PLUGIN_PATH = `${process.env.STRAPI_ADMIN_LOCALAZY_PLUGIN_BACKEND_PREFIX}/${pluginId}`;

const createAxiosInstance = (baseUrl = null) => {
  if (baseUrl === null) {
    baseUrl = `${BASE_PLUGIN_PATH}`;
  }

  const instance = axios.create({
    baseURL: baseUrl,
  });

  instance.interceptors.request.use(
    async (config) => {
      config.headers = {
        Authorization: `Bearer ${auth.getToken()}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // whatever you want to do with the error
      if (error.response?.status === 401) {
        // force-logout from the app
        auth.clearAppStorage();
        window.location.reload();
      }

      throw error;
    }
  );

  return instance;
};

export default createAxiosInstance;
