import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { HeaderLayout } from "@strapi/design-system/Layout";
import { Button } from "@strapi/design-system/Button";
import DownloadIcon from "@strapi/icons/Download";
import { Box } from "@strapi/design-system/Box";
import { Alert } from "@strapi/design-system/Alert";
import { Loader } from "@strapi/design-system/Loader";
import { useTranslation } from "react-i18next";
import { Flex } from '@strapi/design-system/Flex';
import { Divider } from '@strapi/design-system/Divider';
import { Typography } from "@strapi/design-system/Typography";
import LocalazyDownloadService from "../../modules/localazy-download/services/localazy-download-service";
import areLocalesCompatible from "../../modules/@common/utils/are-locales-compatible";
import hasModelChanged from "../../modules/plugin-settings/functions/has-model-changed";
import TransferReport from "../../modules/@common/components/TransferReport";
import ReadDocsButton from "../../modules/localazy-upload/components/ReadDocsButton";
import "../../i18n";
import { getLocalazyIdentity } from "../../state/localazy-identity";

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
  const [downloadResult, setDownloadResult] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);

  /**
     * localazy identity / access token
     */
  const [localazyIdentity] = getLocalazyIdentity();
  const onTranslateInLocalazyClick = () => {
    window.open(localazyIdentity.project.url, "_blank");
  }

  const onDownloadClick = async () => {
    setIsDownloading(true);
    const result = await LocalazyDownloadService.download();
    setDownloadResult(result);
    setIsDownloading(false);
    setshowDownloadFinishedModal(true);
  };

  useEffect(() => {
    async function initComponent() {
      setIsLoading(true);

      /**
       * Handle alerts onload apperance
       */
      setModelChanged(await hasModelChanged());
      setLocalesIncompatible(!(await areLocalesCompatible()));

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
