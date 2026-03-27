import React from 'react';
import { DesignSystemProvider } from '@strapi/design-system';
import { GlobalSettings } from './GlobalSettings';
import { LocalazyIdentityProvider } from '../state/localazy-identity';
import FetchIdentity from '../modules/login/components/FetchIdentity';
import RequireLocalazyAuth from '../components/RequireLocalazyAuth';
import { getDefaultTheme } from '../modules/strapi/utils/get-default-theme';
import { HeadingFixGlobalStyle } from '../modules/@common/styles/heading-fix';

const LocalazyGlobalSettings = () => (
  <DesignSystemProvider theme={getDefaultTheme()}>
    <HeadingFixGlobalStyle />
    <LocalazyIdentityProvider>
      <FetchIdentity />
      <RequireLocalazyAuth>
        <GlobalSettings />
      </RequireLocalazyAuth>
    </LocalazyIdentityProvider>
  </DesignSystemProvider>
);

export default LocalazyGlobalSettings;
