"use strict";

const ApiClient = require("@localazy/api-client").ApiClient;
const { LOCALAZY_PUBLIC_API_URL } = require("../config").default;

module.exports = async () => {
  const user = await strapi
    .plugin("localazy")
    .service("localazyUserService")
    .getUser();

  const { accessToken } = user;
  if (!accessToken) {
    throw new Error("Localazy user is not logged in.");
  }

  const api = new ApiClient({
    authToken: accessToken,
    apiUrl: LOCALAZY_PUBLIC_API_URL,
  });
  return api;
};
