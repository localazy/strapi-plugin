/*
 *
 * LoginButton
 *
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@strapi/design-system/Button";
import { useTranslation } from "react-i18next";
import { getOAuthAuthorizationUrl } from "@localazy/generic-connector-client";
import LocalazyLoginService from "../../services/localazy-login-service";
import { getStrapiDefaultLocale } from "../../../@common/utils/get-default-locale";
import { isoStrapiToLocalazy } from "../../../@common/utils/iso-locales-utils";
import config from "../../../../config";

function LoginButton(props) {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const login = async () => {
    setIsLoading(true);

    const strapiDefaultLocale = await getStrapiDefaultLocale();
    const localazyFormatLocaleCode = isoStrapiToLocalazy(strapiDefaultLocale.code);
    const keys = await LocalazyLoginService.generateKeys();
    const url = getOAuthAuthorizationUrl({
      clientId: config.LOCALAZY_OAUTH_APP_CLIENT_ID,
      customId: keys.writeKey,
      allowCreate: true,
      createLocale: localazyFormatLocaleCode,
    }, config.LOCALAZY_OAUTH_URL);
    window.open(url);

    const pollResult = await LocalazyLoginService.continuousPoll(keys.readKey);

    setIsLoading(false);

    props.onResultFetched(pollResult);
  };

  return (
    <div>
      <Button variant="default" size="L" loading={isLoading} onClick={login}>
        {t("login.login_with_localazy")}
      </Button>
    </div>
  );
}

LoginButton.propTypes = {
  onResultFetched: PropTypes.func.isRequired,
};

export default LoginButton;
