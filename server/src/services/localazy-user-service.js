"use strict";

const { KEY, emptyIdentity } = require("../db/model/localazy-user");
const getStrapiStore = require("../db/model/utils/get-strapi-store");

module.exports = ({ strapi }) => ({
  async getUser() {
    const pluginStore = getStrapiStore(strapi);
    const user = await pluginStore.get({ key: KEY });

    return user;
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
