import { useNavigate } from 'react-router-dom';
import { PLUGIN_ID } from '../../../pluginId';

enum PLUGIN_ROUTES {
  ROOT = '',
  LOGIN = 'login',
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
  OVERVIEW = 'overview',
  // settings routes
  CONTENT_TRANSFER_SETUP = 'content-transfer-setup',
}

const useRedirectToPluginRoute = () => {
  const navigate = useNavigate();

  const navigateToPluginRoute = (route: PLUGIN_ROUTES) => {
    if (route === PLUGIN_ROUTES.CONTENT_TRANSFER_SETUP) {
      navigate(`/settings/${PLUGIN_ID}/${route}`);
      return;
    }

    navigate(`/plugins/${PLUGIN_ID}/${route}`);
  };

  return {
    navigateToPluginRoute,
  };
};

export { PLUGIN_ROUTES, useRedirectToPluginRoute };
