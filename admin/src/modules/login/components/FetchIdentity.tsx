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
      } catch (error) {
        console.error('Error fetching identity:', error);
      } finally {
        setIsFetchingIdentity(false);
      }
    };

    fetchIdentity();
  }, [setIdentity, setIsFetchingIdentity]);

  return null; // This component doesn't render anything
};

export default FetchIdentity;
