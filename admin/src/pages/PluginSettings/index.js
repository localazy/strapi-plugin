import React, { useEffect, useState } from "react";
import { Box } from "@strapi/design-system/Box";
import { Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@strapi/design-system/ThemeProvider";
import { lightTheme } from "@strapi/design-system/themes";
import { useTranslation } from "react-i18next";
import pluginId from "../../pluginId";
import ContentTransferSetup from "../../modules/plugin-settings/components/ContentTransferSetup";
import GlobalSettings from "../../modules/plugin-settings/components/GlobalSettings";
import LocalazyUserService from "../../modules/user/services/localazy-user-service";
import { setLocalazyIdentity } from "../../state/localazy-identity";
import Loader from "../../modules/@common/components/PluginPageLoader";

import "../../i18n";

function PluginSettings() {
  /**
     * Translation function
     */
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      const identity = await LocalazyUserService.getIdentity();
      setLocalazyIdentity(identity);

      setIsLoading(false);
    }

    fetchData();
  }, []);

  return (
    <>
      {isLoading && <Loader>{t("common.loading_content")}</Loader>}
      {!isLoading && (
        <ThemeProvider theme={lightTheme}>
          <Box padding={8}>
            <Switch>
              <Route path={`/settings/${pluginId}/content-transfer-setup`} exact>
                <ContentTransferSetup />
              </Route>
              <Route path={`/settings/${pluginId}/global-settings`} exact>
                <GlobalSettings />
              </Route>
            </Switch>
          </Box>
        </ThemeProvider>
      )}
    </>
  );
}

export default PluginSettings;
