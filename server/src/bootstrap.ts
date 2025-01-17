import type { Core } from '@strapi/strapi';

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  // bootstrap phase
  // TODO: add hooks

  process.nextTick(async () => {
    // const StrapiIOInstance = await strapio(strapi);
    // console.log('StrapiIOInstance', StrapiIOInstance);

    // strapi.StrapIO = StrapiIOInstance;
  });
};

export default bootstrap;
