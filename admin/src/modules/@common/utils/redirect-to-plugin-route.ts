import { PLUGIN_ID } from "../../../pluginId";
import history from "./history";

export enum PLUGIN_ROUTES {
  ROOT = "",
  LOGIN = "login",
  UPLOAD = "upload",
  DOWNLOAD = "download",
  OVERVIEW = "overview",
  // settings routes
  CONTENT_TRANSFER_SETUP = "content-transfer-setup",
};

export default (route: PLUGIN_ROUTES) => {
  if (route === PLUGIN_ROUTES.CONTENT_TRANSFER_SETUP) {
    history.push(`${process.env.ADMIN_PATH}/settings/${PLUGIN_ID}/${route}`);

    return;
  }

  history.push(`${process.env.ADMIN_PATH}/plugins/${PLUGIN_ID}/${route}`);
};
