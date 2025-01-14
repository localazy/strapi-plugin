// import { useLocation } from "react-router-dom";
import getNav from "./get-nav";
import { PLUGIN_ID } from "../../../pluginId";
import { useLocation } from "react-router-dom";

const useHeaderSubtitle = () => {
  const location = useLocation();

  // segment after pluginId
  const pluginSegment = location?.pathname.split(`/${PLUGIN_ID}/`)[1];

  if (!pluginSegment) {
    return "";
  }
  const navigation = getNav();
  const currentNavItem = navigation.find((navItem) =>
    pluginSegment.includes(navItem.id)
  );

  return currentNavItem?.description || "";
};

export {
  useHeaderSubtitle
}
