import React, { useEffect, useState } from "react";
import { Box } from "@strapi/design-system/Box";
import { Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@strapi/design-system/ThemeProvider";
import { lightTheme } from "@strapi/design-system/themes";
import pluginId from "../../pluginId";
import ContentTransferSetup from "../../modules/plugin-settings/components/ContentTransferSetup";
import LocalazyUserService from "../../modules/user/services/localazy-user-service";
import { setLocalazyIdentity } from "../../state/localazy-identity";

function PluginSettings() {
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
    !isLoading && (
      <ThemeProvider theme={lightTheme}>
        <Box padding={8}>
          <Switch>
            <Route path={`/settings/${pluginId}/content-transfer-setup`} exact>
              <ContentTransferSetup />
            </Route>
          </Switch>
        </Box>
      </ThemeProvider>
    )
  );
}

export default PluginSettings;
