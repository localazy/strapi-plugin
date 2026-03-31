import React, { useEffect } from 'react';
import { useLocalazyIdentity } from '../../../state/localazy-identity';
import LocalazyUserService from '../../user/services/localazy-user-service';
import { emptyIdentity } from '../../user/model/localazy-identity';

const FetchIdentity: React.FC = () => {
  const { setIdentity, setIsFetchingIdentity } = useLocalazyIdentity();

  useEffect(() => {
    const fetchIdentity = async () => {
      try {
        setIsFetchingIdentity(true);
        const fetchedIdentity = await LocalazyUserService.getIdentity();
        setIdentity(fetchedIdentity || emptyIdentity);
      } catch (error: any) {
        // 401 is expected when the Strapi session is invalid or token is missing
        if (error?.status !== 401 && error?.response?.status !== 401) {
          console.error('Error fetching identity:', error);
        }
        setIdentity(emptyIdentity);
      } finally {
        setIsFetchingIdentity(false);
      }
    };

    void fetchIdentity();
  }, [setIdentity, setIsFetchingIdentity]);

  return null; // This component doesn't render anything
};

export default FetchIdentity;
