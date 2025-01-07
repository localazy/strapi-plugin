import { GenericConnectorClient, Services } from "@localazy/generic-connector-client";
import config from "../config/index";

const client = new GenericConnectorClient({
  pluginId: Services.STRAPI,
  genericConnectorUrl: config.LOCALAZY_PLUGIN_CONNECTOR_API_URL,
});

export default client;
