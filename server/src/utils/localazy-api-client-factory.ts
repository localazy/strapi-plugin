
import {ApiClient} from "@localazy/api-client";
import config from "../config";

const LocalazyApiClientFactory = async () => {
  const user = await strapi
    .plugin("strapi-plugin-v5")
    .service("LocalazyUserService")
    .getUser();

  const { accessToken } = user;
  if (!accessToken) {
    throw new Error("Localazy user is not logged in.");
  }

  const api = new ApiClient({
    authToken: accessToken,
    apiUrl: config.default.LOCALAZY_PUBLIC_API_URL,
  });
  return api;
};

export default LocalazyApiClientFactory;
