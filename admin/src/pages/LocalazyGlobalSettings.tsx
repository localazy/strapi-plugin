import React from 'react';
import { DesignSystemProvider } from '@strapi/design-system';
import { Page, useRBAC } from '@strapi/strapi/admin';
import { GlobalSettings } from './GlobalSettings';
import { LocalazyIdentityProvider } from '../state/localazy-identity';
import FetchIdentity from '../modules/login/components/FetchIdentity';
import RequireLocalazyAuth from '../components/RequireLocalazyAuth';
import { getDefaultTheme } from '../modules/strapi/utils/get-default-theme';
import { HeadingFixGlobalStyle } from '../modules/@common/styles/heading-fix';
import Loader from '../modules/@common/components/PluginPageLoader';
import { PERMISSIONS } from '../constants/permissions';

const LocalazyGlobalSettings = () => {
  // Strapi's `addSettingsLink` permissions only hide the menu entry; the route
  // is still reachable by URL, so gate the page itself the same way App.tsx
  // gates upload/download.
  const {
    allowedActions: { canRead: canReadSettings },
    isLoading: isLoadingPermissions,
  } = useRBAC(PERMISSIONS.SETTINGS_READ);

  return (
    <DesignSystemProvider theme={getDefaultTheme()}>
      <HeadingFixGlobalStyle />
      {isLoadingPermissions ? (
        <Loader />
      ) : !canReadSettings ? (
        <Page.NoPermissions />
      ) : (
        <LocalazyIdentityProvider>
          <FetchIdentity />
          <RequireLocalazyAuth>
            <GlobalSettings />
          </RequireLocalazyAuth>
        </LocalazyIdentityProvider>
      )}
    </DesignSystemProvider>
  );
};

export default LocalazyGlobalSettings;
