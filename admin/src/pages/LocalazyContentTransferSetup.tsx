import React from 'react';
import { ContentTransferSetup } from './ContentTransferSetup';
import FetchIdentity from '../modules/login/components/FetchIdentity';
import { LocalazyIdentityProvider } from '../state/localazy-identity';
import RequireLocalazyAuth from '../components/RequireLocalazyAuth';

const LocalazyContentTransferSetup = () => (
  <LocalazyIdentityProvider>
    <FetchIdentity />
    <RequireLocalazyAuth>
      <ContentTransferSetup />
    </RequireLocalazyAuth>
  </LocalazyIdentityProvider>
);

export default LocalazyContentTransferSetup;
