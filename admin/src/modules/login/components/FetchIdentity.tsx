import React, { useEffect } from 'react';
import { useLocalazyIdentity } from '../../../state/localazy-identity';
import LocalazyUserService from '../../user/services/localazy-user-service';
import { emptyIdentity } from '../../user/model/localazy-identity';
import { PLUGIN_ROUTES, useRedirectToPluginRoute } from '../../../modules/@common/utils/redirect-to-plugin-route';

const FetchIdentity: React.FC = () => {
  const { setIdentity } = useLocalazyIdentity();
  const { navigateToPluginRoute } = useRedirectToPluginRoute();

  useEffect(() => {
    const fetchIdentity = async () => {
      try {
        const identity = await LocalazyUserService.getIdentity();
        setIdentity(identity || emptyIdentity);

        // redirect to login
        // TODO: replace with `isLoggedIn`
        if (!identity?.accessToken) {
          navigateToPluginRoute(PLUGIN_ROUTES.LOGIN);
        }
      } catch (error) {
        console.error('Error fetching identity:', error);
      }
    };

    fetchIdentity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIdentity]);

  return null; // This component doesn't render anything
};

export default FetchIdentity;
