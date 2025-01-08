

import { House, Upload, Download } from "@strapi/icons";
import { PLUGIN_ID } from "../../../pluginId";
import { useTranslation } from 'react-i18next';

export type NavItem = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  active: boolean;
}

const BASE_PATH = `${process.env.ADMIN_PATH}/plugins/${PLUGIN_ID}`;
const getNav: () => NavItem[] = () => {
  const { t } = useTranslation();
  return [
    {
      id: "overview",
      label: t("common.overview"),
      description: t("overview.description"),
      icon: <House />,
      to: `${BASE_PATH}/overview`,
      active: false,
    },
    {
      id: "upload",
      label: t("common.upload_to_localazy"),
      description: t("upload.description"),
      icon: <Upload />,
      to: `${BASE_PATH}/upload`,
      active: false,
    },
    {
      id: "download",
      label: t("common.download_to_strapi"),
      description: t("download.description"),
      icon: <Download />,
      to: `${BASE_PATH}/download`,
      active: false,
    },
  ];
};

export default getNav;
