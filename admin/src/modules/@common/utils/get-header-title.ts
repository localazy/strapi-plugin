import { useLocation } from "react-router-dom";
import getNav from "./get-nav";
import { PLUGIN_ID } from "../../../pluginId";
import { useTranslation } from 'react-i18next';

export default (location: Pick<Location, "pathname"> | null = null) => {
  const { t } = useTranslation();

  const _location = location || useLocation();

  // segment after pluginId
  const pluginSegment = _location?.pathname.split(`/${PLUGIN_ID}/`)[1];

  if (!pluginSegment) {
    return t("common.localazy_plugin_hand");
  }
  const navigation = getNav();
  const currentNavItem = navigation.find((navItem) =>
    pluginSegment.includes(navItem.id)
  );

  return currentNavItem?.label || t("common.localazy_plugin_hand");
};
