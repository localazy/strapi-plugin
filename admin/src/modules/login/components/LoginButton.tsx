import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from '@strapi/design-system';
import { useTranslation } from 'react-i18next';
import { useRBAC } from '@strapi/strapi/admin';
import { getOAuthAuthorizationUrl } from '@localazy/generic-connector-client';
import LocalazyLoginService from '../services/localazy-login-service';
import { getStrapiDefaultLocale } from '../../@common/utils/get-default-locale';
import { isoStrapiToLocalazy } from '../../@common/utils/iso-locales-utils';
import config from '../../../config';
import { LocalazyIdentity } from '../../user/model/localazy-identity';
import { PERMISSIONS } from '../../../constants/permissions';
import { Locales } from '@localazy/api-client';

interface LoginButtonProps {
  onResultFetched: (result: LocalazyIdentity) => void;
}

const LoginButton = (props: LoginButtonProps) => {
  const { t } = useTranslation();
  const { allowedActions } = useRBAC(PERMISSIONS.SETTINGS_UPDATE);
  const canConnect = !!allowedActions.canUpdate;

  const [isLoading, setIsLoading] = useState(false);
  const login = async () => {
    setIsLoading(true);

    const strapiDefaultLocale = await getStrapiDefaultLocale();
    const localazyFormatLocaleCode = isoStrapiToLocalazy(strapiDefaultLocale?.code);
    const keys = await LocalazyLoginService.generateKeys();
    const url = getOAuthAuthorizationUrl(
      {
        clientId: config.LOCALAZY_OAUTH_APP_CLIENT_ID,
        customId: keys.writeKey,
        allowCreate: true,
        createLocale: localazyFormatLocaleCode ? (localazyFormatLocaleCode as Locales) : ('en' as Locales),
      },
      config.LOCALAZY_OAUTH_URL
    );
    window.open(url);

    const pollResult = await LocalazyLoginService.continuousPoll(keys.readKey);

    setIsLoading(false);

    props.onResultFetched(pollResult);
  };

  const button = (
    <Button variant='default' size='L' loading={isLoading} onClick={login} disabled={!canConnect}>
      {t('login.login_with_localazy')}
    </Button>
  );

  return (
    <div>
      {canConnect ? (
        button
      ) : (
        <Tooltip label={t('login.requires_settings_update_permission')}>
          <span>{button}</span>
        </Tooltip>
      )}
    </div>
  );
};

LoginButton.propTypes = {
  onResultFetched: PropTypes.func.isRequired,
};

export default LoginButton;
