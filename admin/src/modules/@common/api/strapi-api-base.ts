/**
 * Wrapper around Strapi's `getFetchClient` that preserves the existing
 * `.get / .post / .put / .delete` call shape used by every plugin service.
 *
 * Auth (Authorization header) and the Strapi backend base URL are handled by
 * `getFetchClient` itself; we only prepend the plugin path and attach the
 * plugin-identifying header on every request.
 */

import { getFetchClient } from '@strapi/strapi/admin';
import { PLUGIN_ID } from '../../../pluginId';

const BASE_PLUGIN_PATH = `/${PLUGIN_ID}`;
const LOCALAZY_HEADER = { 'X-Localazy-Initiated-By': 'strapi-plugin-localazy' };

type RequestConfig = {
  params?: any;
  signal?: AbortSignal;
  headers?: Record<string, string>;
  validateStatus?: ((status: number) => boolean) | null;
};

const withPluginHeader = (config?: RequestConfig): RequestConfig => ({
  ...(config ?? {}),
  headers: { ...(config?.headers ?? {}), ...LOCALAZY_HEADER },
});

const createStrapiApiAxiosInstance = (baseUrl: string | null = null) => {
  const prefix = baseUrl ?? BASE_PLUGIN_PATH;
  const buildUrl = (url: string) => `${prefix}${url}`;

  return {
    get: (url: string, config?: RequestConfig) => getFetchClient().get(buildUrl(url), withPluginHeader(config)),
    post: (url: string, data?: any, config?: RequestConfig) =>
      getFetchClient().post(buildUrl(url), data, withPluginHeader(config)),
    put: (url: string, data?: any, config?: RequestConfig) =>
      getFetchClient().put(buildUrl(url), data, withPluginHeader(config)),
    delete: (url: string, config?: RequestConfig) => getFetchClient().del(buildUrl(url), withPluginHeader(config)),
  };
};

export { createStrapiApiAxiosInstance };
