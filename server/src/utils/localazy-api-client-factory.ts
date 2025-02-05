import { ApiClient } from '@localazy/api-client';
import config from '../config';
import { getLocalazyUserService } from '../core';

const LocalazyApiClientFactory = async () => {
  const user = await getLocalazyUserService().getUser();

  const { accessToken } = user;
  if (!accessToken) {
    throw new Error('Localazy user is not logged in.');
  }

  const api = new ApiClient({
    authToken: accessToken,
    apiUrl: config.default.LOCALAZY_PUBLIC_API_URL,
  });
  return api;
};

export default LocalazyApiClientFactory;
