import React from 'react';
import { DesignSystemProvider } from '@strapi/design-system';
import { Page, useRBAC } from '@strapi/strapi/admin';
import { ContentTransferSetup } from './ContentTransferSetup';
import FetchIdentity from '../modules/login/components/FetchIdentity';
import { LocalazyIdentityProvider } from '../state/localazy-identity';
import RequireLocalazyAuth from '../components/RequireLocalazyAuth';
import { getDefaultTheme } from '../modules/strapi/utils/get-default-theme';
import { HeadingFixGlobalStyle } from '../modules/@common/styles/heading-fix';
import Loader from '../modules/@common/components/PluginPageLoader';
import { PERMISSIONS } from '../constants/permissions';

const LocalazyContentTransferSetup = () => {
  // `addSettingsLink` permissions only hide the menu entry, not the route.
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
            <ContentTransferSetup />
          </RequireLocalazyAuth>
        </LocalazyIdentityProvider>
      )}
    </DesignSystemProvider>
  );
};

export default LocalazyContentTransferSetup;
