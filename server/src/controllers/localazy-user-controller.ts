import type { Core } from '@strapi/strapi';

const LocalazyUserController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getUser(ctx) {
    ctx.body = await strapi
      .plugin("strapi-plugin-v5")
      .service("LocalazyUserService")
      .getUser();
  },

  async updateUser(ctx) {
    ctx.body = await strapi
      .plugin("strapi-plugin-v5")
      .service("LocalazyUserService")
      .updateUser(ctx.request.body);
  },

  async deleteUser(ctx) {
    ctx.body = await strapi
      .plugin("strapi-plugin-v5")
      .service("LocalazyUserService")
      .deleteUser();
  },
});

export default LocalazyUserController;
