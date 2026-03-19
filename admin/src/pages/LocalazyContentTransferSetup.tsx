import React from 'react';
import { ContentTransferSetup } from './ContentTransferSetup';
import FetchIdentity from '../modules/login/components/FetchIdentity';
import { LocalazyIdentityProvider } from '../state/localazy-identity';

const LocalazyContentTransferSetup = () => (
  <LocalazyIdentityProvider>
    <FetchIdentity />
    <ContentTransferSetup />
  </LocalazyIdentityProvider>
);

export default LocalazyContentTransferSetup;
