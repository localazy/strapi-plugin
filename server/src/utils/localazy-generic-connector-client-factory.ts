import { GenericConnectorClient, Services } from '@localazy/generic-connector-client';
import config from '../config/index';

const ROOT_URL = config.default.LOCALAZY_PLUGIN_CONNECTOR_API_URL;
const PLUGIN_ID = config.default.LOCALAZY_PLUGIN_ID;

const LocalazyGenericConnectorClientFactory = async () => {
  const api = new GenericConnectorClient({
    pluginId: PLUGIN_ID as unknown as Services,
    genericConnectorUrl: ROOT_URL,
  });
  return api;
};

export default LocalazyGenericConnectorClientFactory;
