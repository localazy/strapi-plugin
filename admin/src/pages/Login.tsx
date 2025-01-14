
import {
  Link,
  Box,
  Typography
 } from "@strapi/design-system";
import { useTranslation } from "react-i18next";
import Loader from "../modules/@common/components/PluginPageLoader";
import { useLocalazyIdentity } from "../state/localazy-identity";
import LocalazyUserService from "../modules/user/services/localazy-user-service";
import LoginButton from "../modules/login/components/LoginButton";
import {
  useRedirectToPluginRoute,
  PLUGIN_ROUTES,
} from "../modules/@common/utils/redirect-to-plugin-route";
import ProductAnalyticsService from "../modules/@common/services/product-analytics-service";
import { LocalazyIdentity } from "../modules/user/model/localazy-identity";
import { Layouts } from "@strapi/strapi/admin";

type LoginProps = {
  title: string;
  subtitle: string;
  isLoading: boolean;
}

const Login: React.FC<LoginProps> = ({
  title,
  subtitle,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const { navigateToPluginRoute } = useRedirectToPluginRoute();
  /**
   * Localazy Strapi documentation link
   */
  const localazyStrapiDocsLink = "https://localazy.com/docs/strapi";

  const { setIdentity, identity,isLoggedIn } = useLocalazyIdentity();

  /**
   * Handle fetched identity on login
   * @param result fetched identity
   */
  const onLoginResultFetched = async (result: LocalazyIdentity) => {
    await LocalazyUserService.updateIdentity(result);
    setIdentity(result);

    if (isLoggedIn) {
      // track user login
      ProductAnalyticsService.trackAppConnected(
        identity.user.id,
        identity.project,
      );

      navigateToPluginRoute(PLUGIN_ROUTES.DOWNLOAD);
    }
  };

  return (
    <>
      <Layouts.Header
        title={title}
        subtitle={subtitle}
        as="h1"
      />
      {isLoading && (<Loader />)}
      {!isLoading && (
        <Box
          marginLeft={10}
          marginRight={10}
          background="neutral0"
          paddingTop={6}
          paddingRight={7}
          paddingBottom={6}
          paddingLeft={7}
          hasRadius
          shadow="tableShadow"
        >
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
      )}
    </>
  );
}

export default Login;
