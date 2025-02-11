import React, { useState, useEffect } from 'react';
import cloneDeep from 'lodash-es/cloneDeep';
import set from 'lodash-es/set';
import { Layouts } from '@strapi/strapi/admin';
import { Box, Button, Alert, Flex, Divider, Typography } from '@strapi/design-system';
import { Download as DownloadIcon } from '@strapi/icons';
import { useTranslation } from 'react-i18next';
import Loader from '../modules/@common/components/PluginPageLoader';
import LocalazyDownloadService from '../modules/localazy-download/services/localazy-download-service';
import areLocalesCompatible from '../modules/@common/utils/are-locales-compatible';
import hasModelChanged from '../modules/plugin-settings/functions/has-model-changed';
import { TransferReport } from '../modules/@common/components/TransferReport';
import { ReadDocsButton } from '../modules/localazy-upload/components/ReadDocsButton';
import ProductAnalyticsService from '../modules/@common/services/product-analytics-service';
import PluginSettingsService from '../modules/plugin-settings/services/plugin-settings-service';
import { PLUGIN_ROUTES } from '../modules/@common/utils/redirect-to-plugin-route';
import { LanguagesSelector } from '../modules/@common/components/LanguagesSelector';
import ProjectService from '../modules/@common/services/project-service';
import DownloadAlertsService from '../modules/localazy-download/services/download-alerts-service';
import { useLocalazyIdentity } from '../state/localazy-identity';

// TODO: ADD TYPES

const downloadAlertsService = new DownloadAlertsService();

export type DownloadProps = {
  title: string;
  subtitle: string;
};

const Download: React.FC<DownloadProps> = (props) => {
  const { t } = useTranslation();
  const { identity } = useLocalazyIdentity();

  /**
   * Component state
   */
  const [isLoading, setIsLoading] = useState(true);
  const [modelChanged, setModelChanged] = useState(false);
  const [localesIncompatible, setLocalesIncompatible] = useState(false);
  const [showDownloadFinishedModal, setshowDownloadFinishedModal] = useState(false);
  const [downloadResult, setDownloadResult] = useState<{
    success: boolean;
    report: any[];
  }>({
    success: false,
    report: [],
  });
  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * Localazy identity / access token
   */
  const onTranslateInLocalazyClick = () => {
    window.open(identity.project.url, '_blank');
  };

  /**
   * Project Languages without default language
   */
  const [projectLanguages, setProjectLanguages] = useState([]);

  /**
   * Global Settings form model
   */
  const [formModel, setFormModel] = useState<any>({});

  const onDownloadLanguagesChange = (languages: any[]) => {
    const newFormModel = cloneDeep(formModel);
    set(newFormModel, 'download.uiLanguages', languages);
    setFormModel(newFormModel);

    try {
      PluginSettingsService.updatePluginSettings(newFormModel);
    } catch (e: any) {
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
    downloadAlertsService.onDownload((data: any) => {
      setDownloadResult((old: any) => ({
        success: data.success,
        report: [...(old.report || []), data.message],
      }));
    });
    downloadAlertsService.onDownloadFinished((data: any) => {
      setDownloadResult((old: any) => ({
        success: data.success,
        report: [...(old.report || []), data.message],
      }));
      setIsDownloading(false);
      setshowDownloadFinishedModal(true);
    });

    // track download
    ProductAnalyticsService.trackDownloadToStrapi(identity.user.id, identity.project, {
      'Target Languages Codes': 'all',
    });
  };

  useEffect(() => {
    async function initComponent() {
      setIsLoading(true);

      downloadAlertsService.subscribe();

      /**
       * Handle alerts onload apperance
       */
      setModelChanged(await hasModelChanged());
      setLocalesIncompatible(!(await areLocalesCompatible()));

      const project = await ProjectService.getConnectedProject();
      const projectLanguagesWithoutDefaultLanguage =
        project?.languages?.filter((language) => language.id !== project.sourceLanguage) || [];
      setProjectLanguages(projectLanguagesWithoutDefaultLanguage as any);

      const globalSettings = await PluginSettingsService.getPluginSettings();
      setFormModel(globalSettings);

      PluginSettingsService.updatePluginSettings({ defaultRoute: PLUGIN_ROUTES.DOWNLOAD });

      setIsLoading(false);
    }
    initComponent();
  }, []);

  return (
    <>
      <Layouts.Header
        title={props.title}
        subtitle={props.subtitle}
        primaryAction={
          <Button
            startIcon={<DownloadIcon />}
            disabled={isLoading || modelChanged || localesIncompatible}
            loading={isDownloading}
            onClick={onDownloadClick}
          >
            {t('download.download_to_strapi')}
          </Button>
        }
        as='h2'
      />
      {isLoading && <Loader />}
      {!isLoading && (
        <Box paddingRight={10} paddingLeft={10}>
          <Box
            background='neutral0'
            paddingTop={6}
            paddingRight={7}
            paddingBottom={6}
            paddingLeft={7}
            hasRadius
            shadow='tableShadow'
          >
            <Typography variant='omega'>{t('download.download_note_a')}</Typography>
            <Typography variant='omega' fontWeight='semiBold'>
              {t('download.download_note_b')}
            </Typography>
            <br />
            <br />
            <Typography variant='omega'>{t('download.make_sure_note_a')}</Typography>
            <Typography variant='omega' fontWeight='semiBold'>
              {t('download.make_sure_note_b')}
            </Typography>
            <Typography variant='omega'>{t('download.make_sure_note_c')}</Typography>
            <Box paddingTop={6}>
              <LanguagesSelector
                preselectedLanguages={formModel?.download?.uiLanguages || []}
                projectLanguages={projectLanguages}
                onChange={(languages) => onDownloadLanguagesChange(languages)}
                label={t('download.ui_languages')}
                hint={t('download.ui_languages_info')}
                placeholder={t('download.ui_languages_placeholder')}
              />
            </Box>
            <Box paddingTop={4} paddingBottom={4}>
              <Divider />
            </Box>
            <Box marginTop={2}>
              <Flex gap='2'>
                <Button variant='secondary' onClick={onTranslateInLocalazyClick}>
                  {t('download.translate_in_localazy')}
                </Button>
                <ReadDocsButton />
              </Flex>
            </Box>
          </Box>
          {showDownloadFinishedModal && (
            <Box marginTop={4} marginBottom={4}>
              <Alert
                onClose={() => setshowDownloadFinishedModal(false)}
                closeLabel={t('download.close')}
                title={t('download.download_result')}
                variant={downloadResult.success ? 'success' : 'danger'}
              >
                {downloadResult.success ? t('download.download_success') : t('download.download_failed')}
              </Alert>
            </Box>
          )}
          {isDownloading && (
            <Box marginTop={4} marginBottom={4}>
              <Alert title={t('download.download_in_progress')} variant='warning'>
                {t('download.to_see_to_progress')}
              </Alert>
            </Box>
          )}
          {localesIncompatible && (
            <Box marginTop={4} marginBottom={4}>
              <Alert
                onClose={() => setLocalesIncompatible(false)}
                closeLabel={t('download.close')}
                title={t('download.languages_incompatible')}
                variant='danger'
              >
                {t('download.languages_incompatible_message')}
              </Alert>
            </Box>
          )}
          {modelChanged && (
            <Box marginTop={4} marginBottom={4}>
              <Alert
                onClose={() => setModelChanged(false)}
                closeLabel={t('download.close')}
                title={t('download.content_types_model_changed')}
                variant='default'
              >
                {t('download.please_update_your_content')}
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
};

export default Download;
