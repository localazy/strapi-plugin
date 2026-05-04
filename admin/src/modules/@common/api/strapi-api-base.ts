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
  const raw = jwtToken || localStorage.getItem(JWT_TOKEN_NAME) || sessionStorage.getItem(JWT_TOKEN_NAME) || '';
  // Strip surrounding quotes if present (e.g. stored as "\"token\"")
  return raw.replace(/^["']|["']$/g, '');
};

const createStrapiApiAxiosInstance = (baseUrl: string | null = null) => {
  if (baseUrl === null) {
    baseUrl = `${BASE_PLUGIN_PATH}`;
  }

  const instance = axios.create();

  instance.interceptors.request.use(
    async (config) => {
      // Honors a custom admin URL/path so requests are scoped under it (e.g. `/cms/localazy/...`).
      const backendURL = ((window.strapi as { backendURL?: string } | undefined)?.backendURL || '').replace(/\/$/, '');
      config.baseURL = `${backendURL}${baseUrl}`;
      config.headers.set({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Add this header to identify the request as initiated by the plugin
        'X-Localazy-Initiated-By': 'strapi-plugin-localazy',
      });
      const token = getToken();
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
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

export { createStrapiApiAxiosInstance, getToken };
