import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Typography, Field, Button, Alert, Link, Loader, Dialog } from '@strapi/design-system';
import { Check, WarningCircle, Link as LinkIcon } from '@strapi/icons';
import ProjectService from '../../@common/services/project-service';

const WEBHOOK_PATH = '/api/localazy/public/transfer/download';
const LOCALAZY_DOCS_URL = 'https://localazy.com/docs/general/webhooks';

type WebhookState = 'loading' | 'configured' | 'not_configured' | 'deleted';

function WebhookSetup() {
  const { t } = useTranslation();

  const [state, setState] = useState<WebhookState>('loading');
  const [configuredUrl, setConfiguredUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const checkStatus = async () => {
    try {
      const [statusResult, strapiUrlResult] = await Promise.all([
        ProjectService.getWebhookStatus(),
        ProjectService.getStrapiUrl(),
      ]);

      setWebhookUrl(`${strapiUrlResult.url}${WEBHOOK_PATH}`);

      if (statusResult.status === 'configured' && statusResult.url) {
        setState('configured');
        setConfiguredUrl(statusResult.url);
      } else {
        // Check if we had a webhook that was deleted
        setState('not_configured');
      }
    } catch {
      setState('not_configured');
    }
  };

  useEffect(() => {
    void checkStatus();
  }, []);

  const handleSetup = async () => {
    setIsSaving(true);
    setError('');
    try {
      await ProjectService.setupWebhook(webhookUrl);
      setState('configured');
      setConfiguredUrl(webhookUrl);
      setShowModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch {
      setError(t('plugin_settings.webhook_setup_error'));
    } finally {
      setIsSaving(false);
    }
  };

  if (state === 'loading') {
    return (
      <Flex alignItems='center' gap={2}>
        <Loader small />
        <Typography textColor='neutral600' variant='omega'>
          {t('plugin_settings.webhook_setup_loading')}
        </Typography>
      </Flex>
    );
  }

  return (
    <Box>
      {showSuccess && (
        <Box marginTop={4} marginBottom={4}>
          <Alert onClose={() => setShowSuccess(false)} closeLabel={t('plugin_settings.close')} variant='success'>
            {t('plugin_settings.webhook_setup_success')}
          </Alert>
        </Box>
      )}

      {state === 'configured' && (
        <Box>
          <Flex alignItems='center' gap={2}>
            <Check fill='success600' width={16} height={16} />
            <Typography textColor='success600' variant='omega' fontWeight='semiBold'>
              {t('plugin_settings.webhook_setup_already_configured')}
            </Typography>
          </Flex>
          <Box marginTop={1}>
            <Typography textColor='neutral500' variant='pi'>
              {configuredUrl}
            </Typography>
          </Box>
          <Box marginTop={3}>
            <Button variant='tertiary' onClick={() => setShowModal(true)}>
              {t('plugin_settings.webhook_setup_reconfigure')}
            </Button>
          </Box>
        </Box>
      )}

      {state === 'not_configured' && (
        <Box>
          <Flex alignItems='center' gap={2} marginBottom={2}>
            <WarningCircle fill='warning600' width={16} height={16} />
            <Typography textColor='neutral800' variant='omega' fontWeight='semiBold'>
              {t('plugin_settings.webhook_setup_not_configured')}
            </Typography>
          </Flex>
          <Typography textColor='neutral600' variant='pi'>
            {t('plugin_settings.webhook_setup_description')}
          </Typography>
          <Flex gap={3} marginTop={3} alignItems='center'>
            <Button onClick={() => setShowModal(true)}>{t('plugin_settings.webhook_setup_button')}</Button>
            <Link href={LOCALAZY_DOCS_URL} isExternal startIcon={<LinkIcon />}>
              {t('plugin_settings.webhook_setup_docs_link')}
            </Link>
          </Flex>
        </Box>
      )}

      <Dialog.Root open={showModal} onOpenChange={setShowModal}>
        <Dialog.Content>
          <Dialog.Header>{t('plugin_settings.webhook_setup_modal_title')}</Dialog.Header>
          <Dialog.Body>
            <Box>
              {/* Step 1 */}
              <Typography variant='omega' fontWeight='semiBold' textColor='neutral800'>
                {t('plugin_settings.webhook_setup_step1_title')}
              </Typography>
              <Box marginTop={1} marginBottom={4}>
                <Typography variant='pi' textColor='neutral600'>
                  {t('plugin_settings.webhook_setup_step1_description')}
                </Typography>
              </Box>

              {/* Step 2 */}
              <Typography variant='omega' fontWeight='semiBold' textColor='neutral800'>
                {t('plugin_settings.webhook_setup_step2_title')}
              </Typography>
              <Box marginTop={2} marginBottom={1}>
                <Field.Root hint={t('plugin_settings.webhook_setup_url_hint')}>
                  <Field.Input
                    value={webhookUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWebhookUrl(e.target.value)}
                  />
                  <Field.Hint />
                </Field.Root>
              </Box>
              <Box marginBottom={4}>
                <Typography variant='pi' textColor='warning600'>
                  {t('plugin_settings.webhook_setup_ngrok_hint')}
                </Typography>
              </Box>

              {/* Step 3 */}
              <Typography variant='omega' fontWeight='semiBold' textColor='neutral800'>
                {t('plugin_settings.webhook_setup_step3_title')}
              </Typography>
              <Box marginTop={1}>
                <Typography variant='pi' textColor='neutral600'>
                  {t('plugin_settings.webhook_setup_step3_description')}
                </Typography>
              </Box>

              {error && (
                <Box marginTop={4}>
                  <Alert onClose={() => setError('')} closeLabel={t('plugin_settings.close')} variant='danger'>
                    {error}
                  </Alert>
                </Box>
              )}
            </Box>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Cancel>
              <Button variant='tertiary'>{t('plugin_settings.cancel')}</Button>
            </Dialog.Cancel>
            <Button
              onClick={() => {
                void handleSetup();
              }}
              loading={isSaving}
              disabled={!webhookUrl}
            >
              {t('plugin_settings.webhook_setup_confirm')}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}

export { WebhookSetup };
