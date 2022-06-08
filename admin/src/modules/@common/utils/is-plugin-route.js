import pluginId from "../../../pluginId";

export default (location, path = "") => {
  if (path) {
    return (
      location.pathname.endsWith(`${pluginId}/${path}`) ||
      location.pathname.endsWith(`${pluginId}/${path}/`)
    );
  }

  return (
    location.pathname.endsWith(pluginId) ||
    location.pathname.endsWith(`${pluginId}/`)
  );
};
