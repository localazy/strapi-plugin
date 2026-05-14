import { useState } from 'react';
import { Button, Tooltip } from '@strapi/design-system';
import { useTranslation } from 'react-i18next';
import { SignOut } from '@strapi/icons';
import { useRBAC } from '@strapi/strapi/admin';
import LocalazyUserService from '../../user/services/localazy-user-service';
import { useLocalazyIdentity } from '../../../state/localazy-identity';
import { emptyIdentity } from '../../user/model/localazy-identity';
import { PERMISSIONS } from '../../../constants/permissions';

interface LogoutButtonProps {
  onResultFetched: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = (props) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { setIdentity } = useLocalazyIdentity();
  // useRBAC derives action names from the last dotted segment of the UID,
  // so `plugin::localazy.settings.update` resolves to `canUpdate`.
  const { allowedActions } = useRBAC(PERMISSIONS.SETTINGS_UPDATE);
  const canDisconnect = !!allowedActions.canUpdate;

  const logout = async () => {
    setIsLoading(true);

    // delete identity from db
    // delete identity from app state
    void LocalazyUserService.deleteIdentity();
    setIdentity(emptyIdentity);

    setIsLoading(false);

    props.onResultFetched();
  };

  const button = (
    <Button startIcon={<SignOut />} variant='secondary' loading={isLoading} onClick={logout} disabled={!canDisconnect}>
      {t('login.logout_from_localazy')}
    </Button>
  );

  return (
    <div>
      {canDisconnect ? (
        button
      ) : (
        <Tooltip label={t('login.requires_settings_update_permission')}>
          <span>{button}</span>
        </Tooltip>
      )}
    </div>
  );
};

export { LogoutButton };
