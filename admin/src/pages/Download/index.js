import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import cloneDeep from "lodash-es/cloneDeep";
import set from "lodash-es/set";
import { HeaderLayout } from "@strapi/design-system/Layout";
import { Button } from "@strapi/design-system/Button";
import DownloadIcon from "@strapi/icons/Download";
import { Box } from "@strapi/design-system/Box";
import { Alert } from "@strapi/design-system/Alert";
import { useTranslation } from "react-i18next";
import { Flex } from '@strapi/design-system/Flex';
import { Divider } from '@strapi/design-system/Divider';
import { Typography } from "@strapi/design-system/Typography";
import Loader from "../../modules/@common/components/PluginPageLoader";
import LocalazyDownloadService from "../../modules/localazy-download/services/localazy-download-service";
import areLocalesCompatible from "../../modules/@common/utils/are-locales-compatible";
import hasModelChanged from "../../modules/plugin-settings/functions/has-model-changed";
import TransferReport from "../../modules/@common/components/TransferReport";
import ReadDocsButton from "../../modules/localazy-upload/components/ReadDocsButton";
import "../../i18n";
import { getLocalazyIdentity } from "../../state/localazy-identity";
import ProductAnalyticsService from "../../modules/@common/services/product-analytics-service";
import PluginSettingsService from "../../modules/plugin-settings/services/plugin-settings-service";
import { PLUGIN_ROUTES } from "../../modules/@common/utils/redirect-to-plugin-route";
import LanguagesSelector from "../../modules/@common/components/LanguagesSelector";
import ProjectService from "../../modules/@common/services/project-service";
import DownloadAlertsService from "../../modules/localazy-download/services/download-alerts-service";

const downloadAlertsService = new DownloadAlertsService();
downloadAlertsService.subscribe();

function Download(props) {
  const { t } = useTranslation();

  /**
   * Component state
   */
  const [isLoading, setIsLoading] = useState(true);
  const [modelChanged, setModelChanged] = useState(false);
  const [localesIncompatible, setLocalesIncompatible] = useState(false);
  const [showDownloadFinishedModal, setshowDownloadFinishedModal] =
    useState(false);
  const [downloadResult, setDownloadResult] = useState({
    success: false,
    report: [],
  });
  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * Localazy identity / access token
   */
  const [localazyIdentity] = getLocalazyIdentity();
  const onTranslateInLocalazyClick = () => {
    window.open(localazyIdentity.project.url, "_blank");
  }

  /**
   * Project Languages without default language
   */
  const [projectLanguages, setProjectLanguages] = useState([]);

  /**
   * Global Settings form model
   */
  const [formModel, setFormModel] = useState([]);

  const onDownloadLanguagesChange = (languages) => {
    const newFormModel = cloneDeep(formModel);
    set(newFormModel, 'download.uiLanguages', languages);
    setFormModel(newFormModel);

    try {
      PluginSettingsService.updatePluginSettings(newFormModel);
    } catch (e) {
      console.error(e.message);
    }
  };


  const onDownloadClick = async () => {
    setIsDownloading(true);
    setshowDownloadFinishedModal(false);
    setDownloadResult({
      success: false,
      report: [],
    });
    const result = await LocalazyDownloadService.download();
    const { streamIdentifier } = result;
    downloadAlertsService.setStreamIdentifier(streamIdentifier);
    downloadAlertsService.onDownload((data) => {
      setDownloadResult((old) => ({
        success: data.success,
        report: [
          ...old.report || [],
          data.message,
        ],
      }));
    });
    downloadAlertsService.onDownloadFinished((data) => {
      setDownloadResult((old) => ({
        success: data.success,
        report: [
          ...old.report || [],
          data.message,
        ],
      }));
      setIsDownloading(false);
      setshowDownloadFinishedModal(true);
    });

    // track download
    ProductAnalyticsService.trackDownloadToStrapi(
      localazyIdentity.user.id,
      localazyIdentity.project,
      {
        "Target Languages Codes": "all",
      }
    );
  };

  useEffect(() => {
    async function initComponent() {
      setIsLoading(true);

      /**
       * Handle alerts onload apperance
       */
      setModelChanged(await hasModelChanged());
      setLocalesIncompatible(!(await areLocalesCompatible()));

      const project = await ProjectService.getConnectedProject();
      const projectLanguagesWithoutDefaultLanguage =
        project?.languages?.filter(language => language.id !== project.sourceLanguage) || [];
      setProjectLanguages(projectLanguagesWithoutDefaultLanguage);

      const globalSettings = await PluginSettingsService.getPluginSettings();
      setFormModel(globalSettings);

      PluginSettingsService.updatePluginSettings({ defaultRoute: PLUGIN_ROUTES.DOWNLOAD });

      setIsLoading(false);
    }
    initComponent();
  }, []);

  return (
    <>
      <HeaderLayout
        title={props.title}
        subtitle={props.subtitle}
        primaryAction={
          <Button
            startIcon={<DownloadIcon />}
            disabled={isLoading || modelChanged || localesIncompatible}
            loading={isDownloading}
            onClick={onDownloadClick}
          >
            {t("download.download_to_strapi")}
          </Button>
        }
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
            <Typography variant="omega">
              {t("download.download_note_a")}
            </Typography>
            <Typography variant="omega" fontWeight="semiBold">
              {t("download.download_note_b")}
            </Typography>
            <br />
            <br />
            <Typography variant="omega">
              {t("download.make_sure_note_a")}
            </Typography>
            <Typography variant="omega" fontWeight="semiBold">
              {t("download.make_sure_note_b")}
            </Typography>
            <Typography variant="omega">
              {t("download.make_sure_note_c")}
            </Typography>
            <Box
              paddingTop={6}
            >
              <LanguagesSelector
                preselectedLanguages={formModel?.download?.uiLanguages || []}
                projectLanguages={projectLanguages}
                onChange={(languages) => onDownloadLanguagesChange(languages)}
                label={t("download.ui_languages")}
                hint={t("download.ui_languages_info")}
                placeholder={t("download.ui_languages_placeholder")}
              />
            </Box>
            <Box
              paddingTop={4}
              paddingBottom={4}
            >
              <Divider />
            </Box>
            <Box marginTop={2}>
              <Flex gap="2">
                <Button variant="secondary" onClick={onTranslateInLocalazyClick}>
                  {t("download.translate_in_localazy")}
                </Button>
                <ReadDocsButton />
              </Flex>
            </Box>
          </Box>
          {showDownloadFinishedModal && (
            <Box marginTop={4} marginBottom={4}>
              <Alert
                onClose={() => setshowDownloadFinishedModal(false)}
                closeLabel={t("download.close")}
                title={t("download.download_result")}
                variant={downloadResult.success ? "success" : "danger"}
              >
                {downloadResult.success
                  ? t("download.download_success")
                  : t("download.download_failed")}
              </Alert>
            </Box>
          )}
          {isDownloading && (
            <Box marginTop={4} marginBottom={4}>
              <Alert
                title={t("download.download_in_progress")}
                variant="warning"
              >
                {t("download.to_see_to_progress")}
              </Alert>
            </Box>
          )}
          {localesIncompatible && (
            <Box marginTop={4} marginBottom={4}>
              <Alert
                onClose={() => setLocalesIncompatible(false)}
                closeLabel={t("download.close")}
                title={t("download.languages_incompatible")}
                variant="danger"
              >
                {t("download.languages_incompatible_message")}
              </Alert>
            </Box>
          )}
          {modelChanged && (
            <Box marginTop={4} marginBottom={4}>
              <Alert
                onClose={() => setModelChanged(false)}
                closeLabel={t("download.close")}
                title={t("download.content_types_model_changed")}
                variant="default"
              >
                {t("download.please_update_your_content")}
              </Alert>
            </Box>
          )}
          {downloadResult.report && downloadResult.report.length > 0 && (
            <TransferReport report={downloadResult.report} />
          )}
        </Box>
      )}
    </>
  );
}

Download.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default Download;
