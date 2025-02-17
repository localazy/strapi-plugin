import { useState } from 'react';
import { Button } from '@strapi/design-system';
import { useTranslation } from 'react-i18next';
import { SignOut } from '@strapi/icons';
import LocalazyUserService from '../../user/services/localazy-user-service';
import { useLocalazyIdentity } from '../../../state/localazy-identity';
import { emptyIdentity } from '../../user/model/localazy-identity';

interface LogoutButtonProps {
  onResultFetched: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = (props) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { setIdentity } = useLocalazyIdentity();

  const logout = async () => {
    setIsLoading(true);

    // delete identity from db
    // delete identity from app state
    LocalazyUserService.deleteIdentity();
    setIdentity(emptyIdentity);

    setIsLoading(false);

    props.onResultFetched();
  };

  return (
    <div>
      <Button startIcon={<SignOut />} variant='secondary' loading={isLoading} onClick={logout}>
        {t('login.logout_from_localazy')}
      </Button>
    </div>
  );
};

export { LogoutButton };
