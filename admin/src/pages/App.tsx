import { Routes, Route, Navigate } from 'react-router-dom';
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

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isLoggedIn, isFetchingIdentity } = useLocalazyIdentity();

  if (isFetchingIdentity) {
    return <Loader />;
  }

  if (!isLoggedIn) {
    return <Navigate to={`login`} replace />;
  }

  return children;
};

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
              element={<ProtectedRoute><Overview title={headerTitle} subtitle={headerSubtitle} isLoadingProp={false} /></ProtectedRoute>}
            />
            <Route path={`upload`} element={<ProtectedRoute><Upload title={headerTitle} subtitle={headerSubtitle} /></ProtectedRoute>} />
            <Route path={`download`} element={<ProtectedRoute><Download title={headerTitle} subtitle={headerSubtitle} /></ProtectedRoute>} />
            <Route path='*' element={<Page.Error />} />
          </Routes>
        </Layouts.Root>
      </Box>
    </DesignSystemProvider>
  );
};
export { App };
