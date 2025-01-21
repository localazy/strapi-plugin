import type { Core } from '@strapi/strapi';

import { KEY, emptyIdentity } from '../db/model/localazy-user';
import getStrapiStore from '../db/model/utils/get-strapi-store';

const LocalazyUserService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getUser() {
    const pluginStore = getStrapiStore(strapi);
    const user = await pluginStore.get({ key: KEY });

    return user || emptyIdentity;
  },

  async updateUser(identity) {
    const pluginStore = getStrapiStore(strapi);
    await pluginStore.set({
      key: KEY,
      value: identity,
    });

    return identity;
  },

  async deleteUser() {
    await this.updateUser(emptyIdentity);

    return emptyIdentity;
  },
});

export default LocalazyUserService;
