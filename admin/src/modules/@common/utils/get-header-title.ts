import { useLocation } from 'react-router-dom';
import getNav from './get-nav';
import { PLUGIN_ID } from '../../../pluginId';
import { useTranslation } from 'react-i18next';

const useHeaderTitle = () => {
  const { t } = useTranslation();

  const location = useLocation();

  // segment after pluginId
  const pluginSegment = location?.pathname.split(`/${PLUGIN_ID}/`)[1];

  if (!pluginSegment) {
    return t('common.localazy_plugin_hand');
  }
  const navigation = getNav();
  const currentNavItem = navigation.find((navItem) => pluginSegment.includes(navItem.id));

  return currentNavItem?.label || t('common.localazy_plugin_hand');
};

export { useHeaderTitle };
