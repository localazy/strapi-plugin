/**
 * axios with a custom config.
 */

import axios from 'axios';
import { PLUGIN_ID } from '../../../pluginId';

const BASE_PLUGIN_PATH = `/${PLUGIN_ID}`;
const JWT_TOKEN_NAME = 'jwtToken';

const getToken = (): string => {
  const jwtTokenCookie = document.cookie.split('; ').find((row) => row.startsWith(`${JWT_TOKEN_NAME}=`));
  const jwtToken = jwtTokenCookie ? jwtTokenCookie.split('=')[1] : '';
  return jwtToken || localStorage.getItem(JWT_TOKEN_NAME) || sessionStorage.getItem(JWT_TOKEN_NAME) || '';
};

const createStrapiApiAxiosInstance = (baseUrl: string | null = null) => {
  const token = getToken();

  if (baseUrl === null) {
    baseUrl = `${BASE_PLUGIN_PATH}`;
  }

  const instance = axios.create({
    baseURL: `${baseUrl}`,
  });

  instance.interceptors.request.use(
    async (config) => {
      config.headers.set({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Add this header to identify the request as initiated by the plugin
        'X-Localazy-Initiated-By': 'strapi-plugin-localazy',
      });
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }

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
        // TODO: replace auth.clearAppStorage() with a v5 function
        // auth.clearAppStorage();
        // window.location.reload();
      }

      throw error;
    }
  );

  return instance;
};

export { createStrapiApiAxiosInstance, getToken };
