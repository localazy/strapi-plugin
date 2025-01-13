import { Core } from "@strapi/strapi";

const LocalazyProjectController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getConnectedProject(ctx) {
    const LocalazyUserService = strapi
      .plugin("strapi-plugin-v5")
      .service("LocalazyUserService");
    const LocalazyPubAPIService = strapi
      .plugin("strapi-plugin-v5")
      .service("LocalazyPubAPIService");

    const user = await LocalazyUserService.getUser();
    const project = await LocalazyPubAPIService.getProject(
      user.project.id,
      true,
      true
    );

    ctx.body = project;
  },
});

export default LocalazyProjectController;
