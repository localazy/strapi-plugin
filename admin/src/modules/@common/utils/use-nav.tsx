import { House, Upload, Download, ClockCounterClockwise } from '@strapi/icons';
import { PLUGIN_ID } from '../../../pluginId';
import { useTranslation } from 'react-i18next';

export type NavItem = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  active: boolean;
};

const useNav: () => NavItem[] = () => {
  const { t } = useTranslation();
  return [
    {
      id: 'overview',
      label: t('common.overview'),
      description: t('overview.description'),
      icon: <House />,
      to: `/plugins/${PLUGIN_ID}/overview`,
      active: false,
    },
    {
      id: 'upload',
      label: t('common.upload_to_localazy'),
      description: t('upload.description'),
      icon: <Upload />,
      to: `/plugins/${PLUGIN_ID}/upload`,
      active: false,
    },
    {
      id: 'download',
      label: t('common.download_to_strapi'),
      description: t('download.description'),
      icon: <Download />,
      to: `/plugins/${PLUGIN_ID}/download`,
      active: false,
    },
    {
      id: 'activity-logs',
      label: t('common.activity_logs'),
      description: t('activity_logs.description'),
      icon: <ClockCounterClockwise />,
      to: `/plugins/${PLUGIN_ID}/activity-logs`,
      active: false,
    },
  ];
};

export default useNav;
