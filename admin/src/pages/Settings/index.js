import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Loader } from "@strapi/design-system/Loader";
import { HeaderLayout } from "@strapi/design-system/Layout";
import { Box } from "@strapi/design-system/Box";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Grid } from '@strapi/design-system/Grid';
import { Divider } from '@strapi/design-system/Divider';
import LogoutButton from "../../modules/login/components/LogoutButton";
import redirectToPluginRoute, {
  PLUGIN_ROUTES,
} from "../../modules/@common/utils/redirect-to-plugin-route";
import { getLocalazyIdentity } from "../../state/localazy-identity";
import OverviewItem from "../../modules/settings/components/OverviewItem";
import OverviewItemLink from "../../modules/settings/components/OverviewItemLink";
import PrerequisitiesInfo from "../../modules/settings/components/PrerequisitiesInfo";
import ProjectService from "../../modules/@common/services/project-service";

import "../../i18n";

function Settings(props) {
  const history = useHistory();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);

  const [localazyIdentity] = getLocalazyIdentity();
  const projectUrl = localazyIdentity.project.url;

  const [connectedProject, setConnectedProject] = useState({});

  useEffect(() => {
    async function initComponent() {
      setIsLoading(true);
      const project = await ProjectService.getConnectedProject();
      setConnectedProject(project);
      setIsLoading(false);
    }

    initComponent();
  }, []);

  /**
   * On logout action
   */
  const onLoggedOut = () => {
    redirectToPluginRoute(PLUGIN_ROUTES.LOGIN, history);
  };

  return (
    <>
      <HeaderLayout
        title={props.title}
        subtitle={props.subtitle}
        primaryAction={<LogoutButton onResultFetched={onLoggedOut} />}
        as="h2"
      />
      {(props.isLoading || isLoading) && (<Loader>{t("common.loading_content")}</Loader>)}
      {!(props.isLoading || isLoading) && (
        <Box paddingRight={10} paddingLeft={10}>
          <Box
            background="neutral0"
            paddingTop={6}
            paddingRight={7}
            paddingBottom={6}
            paddingLeft={7}
            hasRadius
            shadow="tableShadow"
          >
            <Grid
              gap={{
                desktop: 5,
                tablet: 2,
                mobile: 1
              }}
            >
              <OverviewItem
                label={t("settings.connected_user")}
                value={localazyIdentity.user.name}
              />
              <OverviewItem
                label={t("settings.connected_project")}
                value={localazyIdentity.project.name}
              />
              <OverviewItem
                label={t("settings.remaining_organization_keys")}
                value={
                  connectedProject.organization.availableKeys - connectedProject.organization.usedKeys
                }
              />
              <OverviewItemLink
                label={t("settings.open_project_in_localazy")}
                to={projectUrl}
              />
            </Grid>
            <Box
              paddingTop={4}
              paddingBottom={4}
            >
              <Divider />
            </Box>
            <PrerequisitiesInfo />
          </Box>
        </Box>)}
    </>
  );
}

Settings.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

Settings.defaultProps = {
  isLoading: false,
};

export default Settings;
