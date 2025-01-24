import { Routes, Route, useLocation } from 'react-router-dom';
import { DesignSystemProvider, lightTheme, Box } from '@strapi/design-system';
import { useEffect } from 'react';
import { useLocalazyIdentity } from '../state/localazy-identity';
import { PLUGIN_ROUTES, useRedirectToPluginRoute } from '../modules/@common/utils/redirect-to-plugin-route';
import isPluginRoute from '../modules/@common/utils/is-plugin-route';
import PluginSettingsService from '../modules/plugin-settings/services/plugin-settings-service';
import { useHeaderTitle } from '../modules/@common/utils/use-header-title';
import { useHeaderSubtitle } from '../modules/@common/utils/use-header-subtitle';
import Login from './Login';
import { Layouts } from '@strapi/strapi/admin';
import SideNav from '../modules/@common/components/SideNav';
import Overview from './Overview';

// import and load resources
import '../i18n';
import { Upload } from './Upload';
import Download from './Download';

const App = () => {
  const location = useLocation();
  const { navigateToPluginRoute } = useRedirectToPluginRoute();

  const { setIdentity, isLoggedIn } = useLocalazyIdentity();
  const headerTitle = useHeaderTitle();
  const headerSubtitle = useHeaderSubtitle();

  useEffect(() => {
    const fetchData = async () => {
      // is root route
      if (isPluginRoute(location)) {
        const lastRoute = (await PluginSettingsService.getPluginSettings()).defaultRoute || PLUGIN_ROUTES.UPLOAD;
        navigateToPluginRoute(lastRoute);
      }
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIdentity]);

  return (
    <DesignSystemProvider theme={lightTheme}>
      <Box background='neutral100'>
        <Layouts.Root sideNav={isLoggedIn && <SideNav />}>
          <Routes>
            <Route path={`login`} element={<Login title={headerTitle} subtitle={headerSubtitle} isLoading={false} />} />
            <Route
              path={`overview`}
              element={<Overview title={headerTitle} subtitle={headerSubtitle} isLoadingProp={false} />}
            />
            <Route path={`upload`} element={<Upload title={headerTitle} subtitle={headerSubtitle} />} />
            <Route path={`download`} element={<Download title={headerTitle} subtitle={headerSubtitle} />} />
            {/* <Route path="*" element={<Page.Error />} /> */}
          </Routes>
        </Layouts.Root>
      </Box>
    </DesignSystemProvider>
  );
};
export { App };
