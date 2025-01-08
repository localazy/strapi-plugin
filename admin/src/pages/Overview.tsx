import React, { useEffect, useState } from "react";
import { Layouts } from "@strapi/strapi/admin";
import { Box, Grid, Divider } from "@strapi/design-system";
import { useTranslation } from "react-i18next";
import Loader from "../modules/@common/components/PluginPageLoader";
import LogoutButton from "../modules/login/components/LogoutButton";
import redirectToPluginRoute, {
  PLUGIN_ROUTES,
} from "../modules/@common/utils/redirect-to-plugin-route";
import { getLocalazyIdentity } from "../state/localazy-identity";
import OverviewItem from "../modules/overview/components/OverviewItem";
import OverviewItemLink from "../modules/overview/components/OverviewItemLink";
import PrerequisitiesInfo from "../modules/overview/components/PrerequisitiesInfo";
import ProjectService from "../modules/@common/services/project-service";
import ProductAnalyticsService from "../modules/@common/services/product-analytics-service";
import formatNumber from "../modules/@common/utils/format-number";
import PluginSettingsService from "../modules/plugin-settings/services/plugin-settings-service";
import { Project } from "@localazy/api-client";

interface OverviewProps {
  title: string;
  subtitle: string;
  isLoadingProp: boolean;
}

const Overview: React.FC<OverviewProps> = ({
  title,
  subtitle,
  isLoadingProp = false,
}) => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);

  const localazyIdentity = getLocalazyIdentity();
  const projectUrl = localazyIdentity.project.url;

  const [connectedProject, setConnectedProject] = useState<Project | null>(null);

  useEffect(() => {
    async function initComponent() {
      setIsLoading(true);
      const project = await ProjectService.getConnectedProject();
      setConnectedProject(project);

      PluginSettingsService.updatePluginSettings({ defaultRoute: PLUGIN_ROUTES.OVERVIEW });

      setIsLoading(false);
    }

    initComponent();
  }, []);

  /**
   * On logout action
   */
  const onLoggedOut = () => {
    // track user logout
    ProductAnalyticsService.trackAppDisconnected(
      localazyIdentity.user.id,
      localazyIdentity.project,
    );

    redirectToPluginRoute(PLUGIN_ROUTES.LOGIN);
  };

  return (
    <>
      <Layouts.Header
        title={title}
        subtitle={subtitle}
        primaryAction={<LogoutButton onResultFetched={onLoggedOut} />}
        as="h2"
      />
      {(isLoadingProp || isLoading) && (
        <Loader />
      )}
      {!(isLoadingProp || isLoading) && (
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
          <Grid.Root
            gap={{
              desktop: 5,
              tablet: 2,
              mobile: 1
            }}
          >
            <Grid.Item>
              <OverviewItem
                label={t("overview.connected_user")}
                value={localazyIdentity.user.name}
              />
            </Grid.Item>
            <Grid.Item>
              <OverviewItem
                label={t("overview.connected_project")}
                value={localazyIdentity.project.name}
              />
            </Grid.Item>
            <Grid.Item>
              <OverviewItem
                label={t("overview.remaining_organization_keys")}
                value={
                  formatNumber((connectedProject?.organization?.availableKeys ?? 0) - (connectedProject?.organization?.usedKeys ?? 0))
                }
              />
            </Grid.Item>
            <Grid.Item>
              <OverviewItemLink
                label={t("overview.open_project_in_localazy")}
                to={projectUrl}
              />
            </Grid.Item>
          </Grid.Root>
          <Box
            paddingTop={4}
            paddingBottom={4}
          >
            <Divider />
          </Box>
          <PrerequisitiesInfo />
        </Box>
        </Box>
      )}
    </>
  );
};

export default Overview;
