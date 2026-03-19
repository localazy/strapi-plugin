import React from 'react';
import { GlobalSettings } from './GlobalSettings';
import { LocalazyIdentityProvider } from '../state/localazy-identity';

const LocalazyGlobalSettings = () => (
  <LocalazyIdentityProvider>
    <GlobalSettings />
  </LocalazyIdentityProvider>
);

export default LocalazyGlobalSettings;
