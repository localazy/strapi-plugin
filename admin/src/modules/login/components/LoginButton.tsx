import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@strapi/design-system';
import { useTranslation } from 'react-i18next';
import { getOAuthAuthorizationUrl } from '@localazy/generic-connector-client';
import LocalazyLoginService from '../services/localazy-login-service';
import { getStrapiDefaultLocale } from '../../@common/utils/get-default-locale';
import { isoStrapiToLocalazy } from '../../@common/utils/iso-locales-utils';
import config from '../../../config';
import { LocalazyIdentity } from '../../user/model/localazy-identity';
import { Locales } from '@localazy/api-client';

interface LoginButtonProps {
  onResultFetched: (result: LocalazyIdentity) => void;
}

const LoginButton = (props: LoginButtonProps) => {
  const { t } = useTranslation();

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
        createLocale: localazyFormatLocaleCode ? localazyFormatLocaleCode : ('en' as Locales),
      },
      config.LOCALAZY_OAUTH_URL
    );
    window.open(url);

    const pollResult = await LocalazyLoginService.continuousPoll(keys.readKey);

    setIsLoading(false);

    props.onResultFetched(pollResult);
  };

  return (
    <div>
      <Button variant='default' size='L' loading={isLoading} onClick={login}>
        {t('login.login_with_localazy')}
      </Button>
    </div>
  );
};

LoginButton.propTypes = {
  onResultFetched: PropTypes.func.isRequired,
};

export default LoginButton;
