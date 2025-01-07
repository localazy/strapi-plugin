import {PLUGIN_ID} from "../../../pluginId";

export default (location: Pick<Location, "pathname">, path = "") => {
  if (path) {
    return (
      location.pathname.endsWith(`${PLUGIN_ID}/${path}`) ||
      location.pathname.endsWith(`${PLUGIN_ID}/${path}/`)
    );
  }

  return (
    location.pathname.endsWith(PLUGIN_ID) ||
    location.pathname.endsWith(`${PLUGIN_ID}/`)
  );
};
