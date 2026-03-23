import React from 'react';
import { GlobalSettings } from './GlobalSettings';
import { LocalazyIdentityProvider } from '../state/localazy-identity';
import FetchIdentity from '../modules/login/components/FetchIdentity';
import RequireLocalazyAuth from '../components/RequireLocalazyAuth';

const LocalazyGlobalSettings = () => (
  <LocalazyIdentityProvider>
    <FetchIdentity />
    <RequireLocalazyAuth>
      <GlobalSettings />
    </RequireLocalazyAuth>
  </LocalazyIdentityProvider>
);

export default LocalazyGlobalSettings;
