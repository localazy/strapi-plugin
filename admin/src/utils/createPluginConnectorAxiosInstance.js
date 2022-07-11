/**
 * axios with plugin connector config.
 */

import axios from "axios";
import { config } from "../../../server";

const BASE_PLUGIN_PATH = config.default.LOCALAZY_PLUGIN_CONNECTOR_API_URL;

const createPluginConnectorAxiosInstance = (baseUrl = null) => {
  if (baseUrl === null) {
    baseUrl = `${BASE_PLUGIN_PATH}`;
  }

  const instance = axios.create({
    baseURL: baseUrl,
  });

  instance.interceptors.request.use(
    async (config) => {
      config.headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        // Strapi plugin id in terms of plugin connector
        "X-Localazy-Plugin-Id": 1,
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
      throw error;
    }
  );

  return instance;
};

export default createPluginConnectorAxiosInstance;
