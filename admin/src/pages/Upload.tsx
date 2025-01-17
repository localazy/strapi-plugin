import React, { useState, useEffect } from "react";
import { Layouts } from "@strapi/strapi/admin";
import { useTranslation } from "react-i18next";
import { Grid, Flex, Divider, Button, Box, Alert } from '@strapi/design-system';
import { Upload as UploadIcon } from "@strapi/icons";
import Loader from "../modules/@common/components/PluginPageLoader";
import LocalazyUploadService from "../modules/localazy-upload/services/localazy-upload-service";
import areLocalesCompatible from "../modules/@common/utils/are-locales-compatible";
import { getStrapiDefaultLocale, getLocalazySourceLanguage } from "../modules/@common/utils/get-default-locale";
import hasModelChanged from "../modules/plugin-settings/functions/has-model-changed";
import { TransferReport } from "../modules/@common/components/TransferReport";
import OverviewItem from "../modules/overview/components/OverviewItem";
import PrerequisitiesInfo from "../modules/overview/components/PrerequisitiesInfo";
import { ReadDocsButton } from "../modules/localazy-upload/components/ReadDocsButton";
import { PLUGIN_ROUTES } from "../modules/@common/utils/redirect-to-plugin-route";
import { useLocalazyIdentity } from "../state/localazy-identity";
import ProductAnalyticsService from "../modules/@common/services/product-analytics-service";
import PluginSettingsService from "../modules/plugin-settings/services/plugin-settings-service";
import UploadAlertsService from "../modules/localazy-upload/services/upload-alerts-service";
import { useRedirectToPluginRoute } from "../modules/@common/utils/redirect-to-plugin-route";

// TODO: ADD TYPES

const uploadAlertsService = new UploadAlertsService();
uploadAlertsService.subscribe();

interface UploadProps {
  title: string;
  subtitle: string;
}

const Upload: React.FC<UploadProps> = (props: UploadProps) => {
  const { t } = useTranslation();
  const {identity} = useLocalazyIdentity();
  const {navigateToPluginRoute} = useRedirectToPluginRoute();
  /**
   * Component state
   */
  const [isLoading, setIsLoading] = useState(true);
  const [modelChanged, setModelChanged] = useState(false);
  const [localesIncompatible, setLocalesIncompatible] = useState(false);
  const [showUploadFinishedModal, setShowUploadFinishedModal] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    report: any[];
  }>({
    success: false,
    report: [],
  });
  const [isUploading, setIsUploading] = useState(false);
  const [strapiDefaultLocale, setStrapiDefaultLocale] = useState<any>(null);
  const [localazySourceLanguage, setLocalazySourceLanguage] = useState<any>(null);

  const onChangeSettingsClick = () => {
    navigateToPluginRoute(PLUGIN_ROUTES.CONTENT_TRANSFER_SETUP);
  };

  const onUploadClick = async () => {
    setIsUploading(true);
    setShowUploadFinishedModal(false);
    setUploadResult({
      success: false,
      report: [],
    });
    const result = await LocalazyUploadService.upload();
    const { streamIdentifier } = result;
    uploadAlertsService.setStreamIdentifier(streamIdentifier);
    uploadAlertsService.onUpload((data: any) => {
      setUploadResult((old: any) => ({
        success: data.success,
        report: [
          ...old.report || [],
          data.message,
        ],
      }));
    });
    uploadAlertsService.onUploadFinished((data: any) => {
      setUploadResult((old: any) => ({
        success: data.success,
        report: [
          ...old.report || [],
          data.message,
        ],
      }));
      setIsUploading(false);
      setShowUploadFinishedModal(true);
    });

    // track upload
    ProductAnalyticsService.trackUploadToLocalazy(
      identity.user.id,
      identity.project,
      {
        "Source Language Code": localazySourceLanguage.code,
      }
    );
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
      <Layouts.Header
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
      {isLoading && <Loader/>}
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
            <Grid.Root
              gap={{
                desktop: 5,
                tablet: 2,
                mobile: 1
              }}
            >
              <Grid.Item>
                <OverviewItem
                  label={t("upload.default_strapi_language")}
                  value={strapiDefaultLocale.name}
                />
              </Grid.Item>
              <Grid.Item>
                <OverviewItem
                  label={t("upload.localazy_source_language")}
                  value={localazySourceLanguage.name}
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
          {isUploading && (
            <Box marginTop={4} marginBottom={4}>
              <Alert
                title={t("upload.upload_in_progress")}
                variant="warning"
              >
                {t("upload.to_see_to_progress")}
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

export { Upload };
