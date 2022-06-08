import pluginId from "../../../pluginId";
import history from "./history";

export const PLUGIN_ROUTES = {
  ROOT: "",
  LOGIN: "login",
  UPLOAD: "upload",
  DOWNLOAD: "download",
  SETTINGS: "settings",
  // settings routes
  CONTENT_TRANSFER_SETUP: "content-transfer-setup",
};

export default (route) => {
  if (route === PLUGIN_ROUTES.CONTENT_TRANSFER_SETUP) {
    history.push(`/admin/settings/${pluginId}/${route}`);

    return;
  }

  history.push(`/admin/plugins/${pluginId}/${route}`);
};
