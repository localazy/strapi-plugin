"use strict";

module.exports = {
  async getConnectedProject(ctx) {
    const LocalazyUserService = strapi
      .plugin("localazy")
      .service("localazyUserService");
    const LocalazyPubApiService = strapi
      .plugin("localazy")
      .service("localazyPubApiService");

    const user = await LocalazyUserService.getUser();
    const project = await LocalazyPubApiService.getProject(
      user.project.id,
      true,
      true
    );

    ctx.body = project;
  },
};
