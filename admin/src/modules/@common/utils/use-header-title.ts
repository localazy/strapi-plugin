import { useLocation } from 'react-router-dom';
import useNav from './use-nav';
import { PLUGIN_ID } from '../../../pluginId';
import { useTranslation } from 'react-i18next';

const useHeaderTitle = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigation = useNav();

  // segment after pluginId
  const pluginSegment = location?.pathname.split(`/${PLUGIN_ID}/`)[1];

  if (!pluginSegment) {
    return t('common.localazy_plugin_hand');
  }
  const currentNavItem = navigation.find((navItem) => pluginSegment.includes(navItem.id));

  return currentNavItem?.label || t('common.localazy_plugin_hand');
};

export { useHeaderTitle };
