import type { Core } from '@strapi/strapi';

import { KEY, emptyIdentity, Identity } from '../db/model/localazy-user';
import getStrapiStore from '../db/model/utils/get-strapi-store';

const LocalazyUserService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getUser() {
    const pluginStore = getStrapiStore(strapi);
    const user = (await pluginStore.get({ key: KEY })) as Identity;

    return user || emptyIdentity;
  },

  async updateUser(identity: Identity) {
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

export type LocalazyUserServiceReturnType = ReturnType<typeof LocalazyUserService>;
export default LocalazyUserService;
