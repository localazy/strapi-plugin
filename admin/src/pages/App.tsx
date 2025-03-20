import { Routes, Route } from 'react-router-dom';
import { DesignSystemProvider, Box } from '@strapi/design-system';
import { useEffect } from 'react';
import { useLocalazyIdentity } from '../state/localazy-identity';
import { PLUGIN_ROUTES, useRedirectToPluginRoute } from '../modules/@common/utils/redirect-to-plugin-route';
import PluginSettingsService from '../modules/plugin-settings/services/plugin-settings-service';
import { useHeaderTitle } from '../modules/@common/utils/use-header-title';
import { useHeaderSubtitle } from '../modules/@common/utils/use-header-subtitle';
import Login from './Login';
import { Layouts, Page } from '@strapi/strapi/admin';
import SideNav from '../modules/@common/components/SideNav';
import Overview from './Overview';
import { getDefaultTheme } from '../modules/strapi/utils/get-default-theme';
import Loader from '../modules/@common/components/PluginPageLoader';

// import and load resources
import '../i18n';
import { Upload } from './Upload';
import Download from './Download';
const App = () => {
  const { navigateToPluginRoute } = useRedirectToPluginRoute();

  const { isLoggedIn, isFetchingIdentity } = useLocalazyIdentity();
  const headerTitle = useHeaderTitle();
  const headerSubtitle = useHeaderSubtitle();

  useEffect(() => {
    const fetchData = async () => {
      if (isFetchingIdentity) {
        return;
      }

      if (!isLoggedIn) {
        navigateToPluginRoute(PLUGIN_ROUTES.LOGIN);
      } else {
        const lastRoute = (await PluginSettingsService.getPluginSettings()).defaultRoute || PLUGIN_ROUTES.UPLOAD;
        navigateToPluginRoute(lastRoute);
      }
    };

    fetchData();
  }, [isLoggedIn, isFetchingIdentity]);

  return (
    <DesignSystemProvider theme={getDefaultTheme()}>
      <Box background='neutral100'>
        <Layouts.Root sideNav={isLoggedIn && <SideNav />}>
          {isFetchingIdentity && <Loader />}
          <Routes>
            <Route path={`login`} element={<Login title={headerTitle} subtitle={headerSubtitle} isLoading={false} />} />
            <Route
              path={`overview`}
              element={<Overview title={headerTitle} subtitle={headerSubtitle} isLoadingProp={false} />}
            />
            <Route path={`upload`} element={<Upload title={headerTitle} subtitle={headerSubtitle} />} />
            <Route path={`download`} element={<Download title={headerTitle} subtitle={headerSubtitle} />} />
            <Route path='*' element={<Page.Error />} />
          </Routes>
        </Layouts.Root>
      </Box>
    </DesignSystemProvider>
  );
};
export { App };
