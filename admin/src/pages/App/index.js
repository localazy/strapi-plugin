/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect, useState } from "react";
import { Switch, Router, Route, useLocation } from "react-router-dom";
import { NotFound } from "@strapi/helper-plugin";
import { ThemeProvider } from "@strapi/design-system/ThemeProvider";
import { lightTheme } from "@strapi/design-system/themes";
import { Box } from "@strapi/design-system/Box";
import { Layout } from "@strapi/design-system/Layout";
import { Loader } from "@strapi/design-system/Loader";
import { useTranslation } from "react-i18next";
import pluginId from "../../pluginId";
import Download from "../Download";
import Settings from "../Settings";
import Upload from "../Upload";
import Login from "../Login";
import SideNav from "../../modules/@common/components/SideNav";
import isPluginRoute from "../../modules/@common/utils/is-plugin-route";
import redirectToPluginRoute, {
  PLUGIN_ROUTES,
} from "../../modules/@common/utils/redirect-to-plugin-route";
import getHeaderTitle from "../../modules/@common/utils/get-header-title";
import getHeaderSubtitle from "../../modules/@common/utils/get-header-subtitle";
import LocalazyUserService from "../../modules/user/services/localazy-user-service";
import {
  setLocalazyIdentity,
  getLocalazyIdentity,
} from "../../state/localazy-identity";
import history from "../../modules/@common/utils/history";

import "../../i18n";

function App() {
  const location = useLocation();
  const { t } = useTranslation();

  /**
   * is processing app loading
   */
  const [isLoadingApp, setIsLoadingApp] = useState(true);

  /**
   * is user logged in
   */
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * side navigation component apperance and title
   */
  const [renderSideNav, setRenderSideNav] = useState(false);
  const [headerTitle, setHeaderTitle] = useState(getHeaderTitle(location));
  const [headerSubtitle, setHeaderSubtitle] = useState(getHeaderSubtitle(location));

  /**
   * localazy identity / access token
   */
  const [localazyIdentity] = getLocalazyIdentity();
  const hasLocalazyIdentity = () => !!localazyIdentity.accessToken;



  useEffect(() => {
    const unlisten = history.listen((location) => {
      setHeaderTitle(getHeaderTitle(location));
      setHeaderSubtitle(getHeaderSubtitle(location));
    });

    return unlisten;
  }, []);

  useEffect(() => {
    async function fetchData() {
      setIsLoadingApp(true);

      const identity = await LocalazyUserService.getIdentity();
      setLocalazyIdentity(identity);
      setIsLoggedIn(hasLocalazyIdentity());
      setRenderSideNav(hasLocalazyIdentity());

      setIsLoadingApp(false);

      // is root route
      if (isPluginRoute(location)) {
        if (!hasLocalazyIdentity()) {
          redirectToPluginRoute(PLUGIN_ROUTES.LOGIN);
        } else {
          redirectToPluginRoute(PLUGIN_ROUTES.DOWNLOAD);
        }
      }
    }
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localazyIdentity.accessToken]);

  return (
    <Router history={history}>
      <ThemeProvider theme={lightTheme}>
        <Box background="neutral100">
          <Layout sideNav={renderSideNav && <SideNav />}>
            {isLoadingApp && <Loader>{t("common.loading_content")}</Loader>}
            {!isLoadingApp && (
              <>
                {!isLoggedIn && (
                  <Switch>
                    <Route path={`/admin/plugins/${pluginId}/login`} exact>
                      <Login
                        title={headerTitle}
                        subtitle={headerSubtitle}
                      />
                    </Route>
                  </Switch>
                )}

                {isLoggedIn && (
                  <Switch>
                    <Route path={`/admin/plugins/${pluginId}/download`} exact>
                      <Download
                        title={headerTitle}
                        subtitle={headerSubtitle}
                      />
                    </Route>
                    <Route path={`/admin/plugins/${pluginId}/upload`} exact>
                      <Upload
                        title={headerTitle}
                        subtitle={headerSubtitle}
                      />
                    </Route>
                    <Route path={`/admin/plugins/${pluginId}/settings`} exact>
                      <Settings
                        title={headerTitle}
                        subtitle={headerSubtitle}
                      />
                    </Route>
                    <Route component={NotFound} />
                  </Switch>
                )}
              </>
            )}
          </Layout>
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;
