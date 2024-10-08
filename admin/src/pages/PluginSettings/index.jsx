import React, { useEffect, useState } from "react";
import { Box } from "@strapi/design-system";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DesignSystemProvider, lightTheme } from "@strapi/design-system";
import { useTranslation } from "react-i18next";
import pluginId from "../../pluginId";
import ContentTransferSetup from "../../modules/plugin-settings/components/ContentTransferSetup";
import GlobalSettings from "../../modules/plugin-settings/components/GlobalSettings";
import LocalazyUserService from "../../modules/user/services/localazy-user-service";
import { setLocalazyIdentity } from "../../state/localazy-identity";
import Loader from "../../modules/@common/components/PluginPageLoader";

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
        <DesignSystemProvider theme={lightTheme}>
          <Box padding={8}>
            <Router>
              <Routes>
                <Route path={`/settings/${pluginId}/content-transfer-setup`} exact>
                  <ContentTransferSetup />
                </Route>
                <Route path={`/settings/${pluginId}/global-settings`} exact>
                  <GlobalSettings />
                </Route>
              </Routes>
            </Router>
          </Box>
        </DesignSystemProvider>
      )}
    </>
  );
}

export default PluginSettings;
