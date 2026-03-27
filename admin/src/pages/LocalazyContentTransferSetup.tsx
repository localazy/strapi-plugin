import React from 'react';
import { DesignSystemProvider } from '@strapi/design-system';
import { ContentTransferSetup } from './ContentTransferSetup';
import FetchIdentity from '../modules/login/components/FetchIdentity';
import { LocalazyIdentityProvider } from '../state/localazy-identity';
import RequireLocalazyAuth from '../components/RequireLocalazyAuth';
import { getDefaultTheme } from '../modules/strapi/utils/get-default-theme';
import { HeadingFixGlobalStyle } from '../modules/@common/styles/heading-fix';

const LocalazyContentTransferSetup = () => (
  <DesignSystemProvider theme={getDefaultTheme()}>
    <HeadingFixGlobalStyle />
    <LocalazyIdentityProvider>
      <FetchIdentity />
      <RequireLocalazyAuth>
        <ContentTransferSetup />
      </RequireLocalazyAuth>
    </LocalazyIdentityProvider>
  </DesignSystemProvider>
);

export default LocalazyContentTransferSetup;
