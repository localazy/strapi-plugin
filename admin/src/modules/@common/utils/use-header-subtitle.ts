import { useLocation } from 'react-router-dom';
import useNav from './use-nav';
import { PLUGIN_ID } from '../../../pluginId';

const useHeaderSubtitle = () => {
  const location = useLocation();
  const navigation = useNav();

  // segment after pluginId
  const pluginSegment = location?.pathname.split(`/${PLUGIN_ID}/`)[1];

  if (!pluginSegment) {
    return '';
  }
  const currentNavItem = navigation.find((navItem) => pluginSegment.includes(navItem.id));

  return currentNavItem?.description || '';
};

export { useHeaderSubtitle };
