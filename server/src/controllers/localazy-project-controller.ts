import { Core } from '@strapi/strapi';
import { getLocalazyUserService, getLocalazyPubAPIService } from '../core';

const LocalazyProjectController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getConnectedProject(ctx) {
    const LocalazyUserService = getLocalazyUserService();
    const LocalazyPubAPIService = getLocalazyPubAPIService();

    const user = await LocalazyUserService.getUser();
    const project = await LocalazyPubAPIService.getProject(user.project.id, true, true);

    ctx.body = project;
  },
});

export default LocalazyProjectController;
