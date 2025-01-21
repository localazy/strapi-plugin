import prodConfig from './production';
import localConfig from './local';
import devConfig from './development';

type Config = {
  LOCALAZY_OAUTH_URL: string;
  LOCALAZY_OAUTH_APP_CLIENT_ID: string;
  LOCALAZY_PLUGIN_CONNECTOR_API_URL: string;
  LOCALAZY_PUBLIC_API_URL: string;
  LOCALAZY_PLUGIN_ID: string;
  LOCALAZY_DEFAULT_FILE_NAME: string;
  LOCALAZY_DEFAULT_FILE_PATH: string;
  LOCALAZY_DEFAULT_FILE_EXTENSION: string;
  LOCALAZY_DEFAULT_LOCALE: string;
  LOCALAZY_API_USER_JWT_COOKIE_NAME: string;
  LOCALAZY_API_USER_COOKIE_EXPIRATION: number;
  LOCALAZY_PUBLIC_API_LIFTED_LIMITS: boolean;
};

const loadConfig = (): Config => {
  // depending on the STRAPI_ADMIN_LOCALAZY_ENV, use the correct config
  let config = prodConfig;

  if (process.env.STRAPI_ADMIN_LOCALAZY_ENV === 'local') {
    config = localConfig;
  }

  if (process.env.STRAPI_ADMIN_LOCALAZY_ENV === 'development') {
    config = devConfig;
  }

  return config as unknown as Config;
};

export default {
  default: {
    // Default plugin configuration, merged with the user configuration
    ...(loadConfig() || {}),
  },
  validator() {},
};
