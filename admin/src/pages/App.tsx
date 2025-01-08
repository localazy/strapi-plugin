import { Routes, Route, useLocation } from 'react-router-dom';
import {
  DesignSystemProvider,
   lightTheme,
   Box
} from "@strapi/design-system";
import { useEffect, useState } from 'react';
import { getLocalazyIdentity, setLocalazyIdentity } from '../state/localazy-identity';
import LocalazyUserService from '../modules/user/services/localazy-user-service';
import { emptyIdentity } from '../modules/user/model/localazy-identity';
import redirectToPluginRoute, { PLUGIN_ROUTES } from '../modules/@common/utils/redirect-to-plugin-route';
import isPluginRoute from '../modules/@common/utils/is-plugin-route';
import PluginSettingsService from '../modules/plugin-settings/services/plugin-settings-service';
import Loader from "../modules/@common/components/PluginPageLoader";
import { useTranslation } from 'react-i18next';
import getHeaderTitle from '../modules/@common/utils/get-header-title';
import getHeaderSubtitle from '../modules/@common/utils/get-header-subtitle';
import Login from './Login';
import history from "../modules/@common/utils/history";
import { Layouts } from "@strapi/strapi/admin";
import SideNav from '../modules/@common/components/SideNav';
import Overview from './Overview';

// import and load resources
import '../i18n';

const App = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [renderSideNav, setRenderSideNav] = useState(false);
  const [headerTitle, setHeaderTitle] = useState(getHeaderTitle(location));
  const [headerSubtitle, setHeaderSubtitle] = useState(getHeaderSubtitle(location));
  const localazyIdentity = getLocalazyIdentity();
  const hasLocalazyIdentity = () => !!localazyIdentity.accessToken;

  useEffect(() => {
    const unlisten = history.listen((location) => {
      setHeaderTitle(getHeaderTitle(location.location));
      setHeaderSubtitle(getHeaderSubtitle(location.location));
    });

    return unlisten;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingApp(true);

      const identity = await LocalazyUserService.getIdentity();
      setLocalazyIdentity(identity || emptyIdentity);
      setIsLoggedIn(hasLocalazyIdentity());
      setRenderSideNav(hasLocalazyIdentity());

      setIsLoadingApp(false);

      // is root route
      if (isPluginRoute(location)) {
        if (!hasLocalazyIdentity()) {
          redirectToPluginRoute(PLUGIN_ROUTES.LOGIN);
        } else {
          const lastRoute = (await PluginSettingsService.getPluginSettings()).defaultRoute || PLUGIN_ROUTES.UPLOAD;
          redirectToPluginRoute(lastRoute);
        }
      }
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localazyIdentity.accessToken]);

  return (
    <DesignSystemProvider theme={lightTheme}>
      <Box background="neutral100">
        <Layouts.Root sideNav={renderSideNav && <SideNav />}>
      {isLoadingApp && <Loader />}
      {!isLoadingApp && (
      <Routes>
        <Route
          path={`login`}
          element={<Login
          title={headerTitle}
          subtitle={headerSubtitle}
          isLoading={isLoadingApp} />
          }
        />
        <Route
          path={`overview`}
          element={<Overview
          title={headerTitle}
          subtitle={headerSubtitle}
          isLoadingProp={isLoadingApp} />
          }
        />
        {/* <Route path="*" element={<Page.Error />} /> */}
        </Routes>
        )}
      </Layouts.Root>
      </Box>
    </DesignSystemProvider>
  );
};

export { App };
