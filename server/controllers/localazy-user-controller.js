"use strict";

module.exports = {
  async getUser(ctx) {
    ctx.body = await strapi
      .plugin("localazy")
      .service("localazyUserService")
      .getUser();
  },

  async updateUser(ctx) {
    ctx.body = await strapi
      .plugin("localazy")
      .service("localazyUserService")
      .updateUser(ctx.request.body);
  },

  async deleteUser(ctx) {
    ctx.body = await strapi
      .plugin("localazy")
      .service("localazyUserService")
      .deleteUser();
  },
};
