import { emptyIdentity, LocalazyIdentity } from '../modules/user/model/localazy-identity';
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface LocalazyIdentityContextType {
  identity: LocalazyIdentity;
  setIdentity: React.Dispatch<React.SetStateAction<LocalazyIdentity>>;
  isFetchingIdentity: boolean;
  setIsFetchingIdentity: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
}

const LocalazyIdentityContextType = createContext<LocalazyIdentityContextType | undefined>(undefined);

const LocalazyIdentityProvider = ({ children }: { children: ReactNode }) => {
  const [identity, setIdentity] = useState(emptyIdentity);
  const [isFetchingIdentity, setIsFetchingIdentity] = useState(true);
  const isLoggedIn = useMemo(() => !!identity.accessToken, [identity.accessToken]);

  return (
    <LocalazyIdentityContextType.Provider
      value={{ identity, setIdentity, isLoggedIn, isFetchingIdentity, setIsFetchingIdentity }}
    >
      {children}
    </LocalazyIdentityContextType.Provider>
  );
};

const useLocalazyIdentity = () => {
  const context = useContext(LocalazyIdentityContextType);
  if (context === undefined) {
    throw new Error('useLocalazyIdentity must be used within a LocalazyIdentityProvider');
  }
  return context;
};

export { useLocalazyIdentity, LocalazyIdentityProvider };
