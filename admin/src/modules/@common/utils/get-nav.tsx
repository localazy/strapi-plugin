

import { House, Download, Upload } from "@strapi/icons";
import { PLUGIN_ID } from "../../../pluginId";
import { useTranslation } from 'react-i18next';

// TODO: Resolve icons

const BASE_PATH = `${process.env.ADMIN_PATH}plugins/${PLUGIN_ID}`;
const gevNav = () => {
  const { t } = useTranslation();
  return [
    {
      id: "settings",
      label: t("common.settings"),
      description: t("settings.description"),
      // icon: () => (<House />),
      to: `${BASE_PATH}/settings`,
    },
    {
      id: "upload",
      label: t("common.upload_to_localazy"),
      description: t("upload.description"),
      // icon: () => (<Upload />),
      to: `${BASE_PATH}/upload`,
    },
    {
      id: "download",
      label: t("common.download_to_strapi"),
      description: t("download.description"),
      // icon: () => (<Download />),
      to: `${BASE_PATH}/download`,
    },
  ];
};
export default gevNav;
