import React from "react";
import House from "@strapi/icons/House";
import Download from "@strapi/icons/Download";
import Upload from "@strapi/icons/Upload";
import pluginId from "../../../pluginId";
import i18n from "../../../i18n";

const BASE_PATH = `/admin/plugins/${pluginId}`;
const t = i18n.t;
const gevNav = () => {
  return [
    {
      id: "settings",
      label: t("common.settings"),
      description: t("settings.description"),
      icon: <House />,
      to: `${BASE_PATH}/settings`,
    },
    {
      id: "upload",
      label: t("common.upload_to_localazy"),
      description: t("upload.description"),
      icon: < Upload />,
      to: `${BASE_PATH}/upload`,
    },
    {
      id: "download",
      label: t("common.download_to_strapi"),
      description: t("download.description"),
      icon: <Download />,
      to: `${BASE_PATH}/download`,
    },
  ];
};
export default gevNav;
