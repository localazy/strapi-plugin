import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { HeaderLayout } from "@strapi/design-system/Layout";
import { useTranslation } from "react-i18next";
import { Grid } from '@strapi/design-system/Grid';
import { Flex } from '@strapi/design-system/Flex';
import { Divider } from '@strapi/design-system/Divider';
import { Button } from "@strapi/design-system/Button";
import UploadIcon from "@strapi/icons/Upload";
import { Box } from "@strapi/design-system/Box";
import { Alert } from "@strapi/design-system/Alert";
import SockerIoClient from "socket.io-client";
import Loader from "../../modules/@common/components/PluginPageLoader";
import LocalazyUploadService from "../../modules/localazy-upload/services/localazy-upload-service";
import areLocalesCompatible from "../../modules/@common/utils/are-locales-compatible";
import { getStrapiDefaultLocale, getLocalazySourceLanguage } from "../../modules/@common/utils/get-default-locale";
import hasModelChanged from "../../modules/plugin-settings/functions/has-model-changed";
import TransferReport from "../../modules/@common/components/TransferReport";
import OverviewItem from "../../modules/settings/components/OverviewItem";
import PrerequisitiesInfo from "../../modules/settings/components/PrerequisitiesInfo";
import ReadDocsButton from "../../modules/localazy-upload/components/ReadDocsButton";
import redirectToPluginRoute, {
  PLUGIN_ROUTES,
} from "../../modules/@common/utils/redirect-to-plugin-route";
import { getLocalazyIdentity } from "../../state/localazy-identity";
import ProductAnalyticsService from "../../modules/@common/services/product-analytics-service";
import PluginSettingsService from "../../modules/plugin-settings/services/plugin-settings-service";

import "../../i18n";

const socket = SockerIoClient.connect("http://localhost:1337");
socket.emit("subscribe", "myroom");
socket.on("create", () => {
  console.log('create');
});

function Upload(props) {
  const { t } = useTranslation();

  /**
   * Component state
   */
  const [isLoading, setIsLoading] = useState(true);
  const [modelChanged, setModelChanged] = useState(false);
  const [localesIncompatible, setLocalesIncompatible] = useState(false);
  const [showUploadFinishedModal, setShowUploadFinishedModal] = useState(false);
  const [uploadResult, setUploadResult] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [strapiDefaultLocale, setStrapiDefaultLocale] = useState(null);
  const [localazySourceLanguage, setLocalazySourceLanguage] = useState(null);
  const [localazyIdentity] = getLocalazyIdentity();

  const onChangeSettingsClick = () => {
    redirectToPluginRoute(PLUGIN_ROUTES.CONTENT_TRANSFER_SETUP);
    // hacky solution, otherwise the route contents won't be instantiated
    window.location.reload();
  };

  const onUploadClick = async () => {
    setIsUploading(true);
    const result = await LocalazyUploadService.upload();
    setUploadResult(result);

    // track upload
    ProductAnalyticsService.trackUploadToLocalazy(
      localazyIdentity.user.id,
      localazyIdentity.project,
      {
        "Source Language Code": localazySourceLanguage.code,
      }
    );

    setIsUploading(false);
    setShowUploadFinishedModal(true);
  };

  useEffect(() => {
    async function initComponent() {
      setIsLoading(true);

      setStrapiDefaultLocale(await getStrapiDefaultLocale());
      setLocalazySourceLanguage(await getLocalazySourceLanguage());

      /**
       * Handle alerts onload apperance
       */
      setModelChanged(await hasModelChanged());
      setLocalesIncompatible(!(await areLocalesCompatible(strapiDefaultLocale, localazySourceLanguage)));

      PluginSettingsService.updatePluginSettings({ defaultRoute: PLUGIN_ROUTES.UPLOAD });

      setIsLoading(false);
    }
    initComponent();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <HeaderLayout
        title={props.title}
        subtitle={props.subtitle}
        primaryAction={<Button
          startIcon={<UploadIcon />}
          disabled={isLoading || modelChanged || localesIncompatible}
          loading={isUploading}
          onClick={onUploadClick}
        >
          {t("upload.upload_to_localazy")}
        </Button>}
        as="h2"
      />
      {isLoading && <Loader>{t("common.loading_content")}</Loader>}
      {!isLoading && (
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
                label={t("upload.default_strapi_language")}
                value={strapiDefaultLocale.name}
              />
              <OverviewItem
                label={t("upload.localazy_source_language")}
                value={localazySourceLanguage.name}
              />
            </Grid>
            <Box
              paddingTop={4}
              paddingBottom={4}
            >
              <Divider />
            </Box>
            <PrerequisitiesInfo />
            <Box marginTop={4}>
              <Flex gap="2">
                <Button variant="secondary" onClick={onChangeSettingsClick}>
                  {t("upload.change_settings")}
                </Button>
                <ReadDocsButton />
              </Flex>
            </Box>
          </Box>
          {showUploadFinishedModal && (
            <Box marginTop={4} marginBottom={4}>
              <Alert
                onClose={() => setShowUploadFinishedModal(false)}
                closeLabel={t("upload.close")}
                title={t("upload.upload_result")}
                variant={uploadResult.success ? "success" : "danger"}
              >
                {uploadResult.success
                  ? t("upload.upload_success")
                  : t("upload.upload_failed")}
              </Alert>
            </Box>
          )}
          {localesIncompatible && (
            <Box marginTop={4} marginBottom={4}>
              <Alert
                onClose={() => setLocalesIncompatible(false)}
                closeLabel={t("upload.close")}
                title={t("upload.languages_incompatible")}
                variant="danger"
              >
                {t("upload.languages_incompatible_message")}
              </Alert>
            </Box>
          )}
          {modelChanged && (
            <Box marginTop={4} marginBottom={4}>
              <Alert
                onClose={() => setModelChanged(false)}
                closeLabel={t("upload.close")}
                title={t("upload.content_types_model_changed")}
                variant="default"
              >
                {t("upload.please_update_your_content")}
              </Alert>
            </Box>
          )}
          {uploadResult.report && uploadResult.report.length > 0 && (
            <TransferReport report={uploadResult.report} />
          )}
        </Box>
      )}
    </>
  );
}

Upload.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default Upload;
