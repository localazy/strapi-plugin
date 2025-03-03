import { useLocation } from "react-router-dom";
import getNav from "./get-nav";
import pluginId from "../../../pluginId";
import i18n from "../../../i18n";

const t = i18n.t;

export default (location = null) => {
  if (!location) {
    location = useLocation();
  }
  // segment after pluginId
  const pluginSegment = location.pathname.split(`/${pluginId}/`)[1];

  if (!pluginSegment) {
    return t("common.localazy_plugin_hand");
  }
  const navigation = getNav();
  const currentNavItem = navigation.find((navItem) =>
    pluginSegment.includes(navItem.id)
  );

  return currentNavItem?.label || t("common.localazy_plugin_hand");
};
