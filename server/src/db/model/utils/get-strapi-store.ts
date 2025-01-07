import type { Core } from '@strapi/strapi';

// TODO: define plugin id
const pluginId = "localazy";
const getStrapiStore = (strapi: Core.Strapi) =>
  strapi.store({
    environment: process.env.STRAPI_ADMIN_LOCALAZY_ENV,
    type: "plugin",
    name: pluginId,
  });

export default getStrapiStore;
