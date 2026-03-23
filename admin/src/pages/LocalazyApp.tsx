import React from 'react';
import { App } from './App';
import FetchIdentity from '../modules/login/components/FetchIdentity';
import { LocalazyIdentityProvider } from '../state/localazy-identity';

const LocalazyApp = () => (
  <LocalazyIdentityProvider>
    <FetchIdentity />
    <App />
  </LocalazyIdentityProvider>
);

export default LocalazyApp;
