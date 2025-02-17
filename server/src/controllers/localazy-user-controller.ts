import type { Core } from '@strapi/strapi';
import { getLocalazyUserService } from '../core';

const LocalazyUserController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getUser(ctx) {
    ctx.body = await getLocalazyUserService().getUser();
  },

  async updateUser(ctx) {
    ctx.body = await getLocalazyUserService().updateUser(ctx.request.body);
  },

  async deleteUser(ctx) {
    ctx.body = await getLocalazyUserService().deleteUser();
  },
});

export default LocalazyUserController;
