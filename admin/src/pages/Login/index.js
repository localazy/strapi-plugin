/*
 *
 * Login
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { Loader } from "@strapi/design-system/Loader";
import { Link } from "@strapi/design-system/Link";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HeaderLayout } from "@strapi/design-system/Layout";
import { Box } from "@strapi/design-system/Box";
import { Typography } from "@strapi/design-system/Typography";
import { setLocalazyIdentity } from "../../state/localazy-identity";
import LocalazyUserService from "../../modules/user/services/localazy-user-service";
import LoginButton from "../../modules/login/components/LoginButton";
import redirectToPluginRoute, {
  PLUGIN_ROUTES,
} from "../../modules/@common/utils/redirect-to-plugin-route";

import "../../i18n";

function Login(props) {
  const history = useHistory();
  const { t } = useTranslation();

  /**
   * Localazy Strapi documentation link
   */
  const localazyStrapiDocsLink = "https://localazy.com/docs/strapi";

  /**
   * Handle fetched identity on login
   * @param result fetched identity
   */
  const onLoginResultFetched = async (result) => {
    await LocalazyUserService.updateIdentity(result);
    setLocalazyIdentity(result);

    if (result.accessToken) {
      redirectToPluginRoute(PLUGIN_ROUTES.DOWNLOAD, history);
    }
  };

  return (
    <>
      <HeaderLayout
        title={props.title}
        subtitle={props.subtitle}
        as="h2"
      />
      {props.isLoading && (<Loader>{t("common.loading_content")}</Loader>)}
      {!props.isLoading && (
        <Box paddingLeft={10}>
          <Box>
            <Typography variant="epsilon" textColor="neutral600">
              {t("common.localazy_plugin_description")}
              <br />
              {t("login.login_and_start_translating_your_project")}
              <br />
              <br />
              {t("login.you_have_to_own_account_for_the_plugin_to_work_properly")}
            </Typography>
          </Box>
          <Box paddingTop={6}>
            <LoginButton onResultFetched={onLoginResultFetched} />
          </Box>
          <Box paddingTop={6}>
            <Link href={localazyStrapiDocsLink} isExternal>
              <Typography variant="sigma" textColor="primary600">
                {t("login.read_the_documentation")}
              </Typography>
            </Link>
          </Box>
        </Box>
      )
      }
    </>
  );
}

Login.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

Login.defaultProps = {
  isLoading: false,
};

export default Login;
