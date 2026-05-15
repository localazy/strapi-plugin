import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cloneDeep from 'lodash-es/cloneDeep';
import { Layouts, useRBAC } from '@strapi/strapi/admin';
import { Check } from '@strapi/icons';
import {
  Field,
  Box,
  Button,
  Toggle,
  MultiSelect,
  MultiSelectOption,
  SingleSelect,
  SingleSelectOption,
  Alert,
  Flex,
  Divider,
  Typography,
} from '@strapi/design-system';
import isEqual from 'lodash-es/isEqual';
import set from 'lodash-es/set';
import { LanguagesSelector } from '../modules/@common/components/LanguagesSelector';
import { WebhookSetup } from '../modules/plugin-settings/components/WebhookSetup';
import PluginSettingsService from '../modules/plugin-settings/services/plugin-settings-service';
import StrapiUsersService from '../modules/plugin-settings/services/strapi-users-service';
import ProjectService from '../modules/@common/services/project-service';
import { AdminPanelUser } from '../modules/plugin-settings/models/admin-panel-user';
import { PERMISSIONS } from '../constants/permissions';
// TODO: ADD TYPES

// import and load resources
import '../i18n';

const GlobalSettings: React.FC = () => {
  /**
   * Translation function
   */
  const { t } = useTranslation();

  /**
   * Settings.update gate — controls are read-only without it.
   */
  const {
    allowedActions: { canUpdate: canUpdateSettings },
  } = useRBAC(PERMISSIONS.SETTINGS_UPDATE);

  /**
   * `admin::users.read` is required to populate the webhook-author dropdown
   * (it powers `/admin/users`). It's a core Strapi permission our plugin
   * can't grant, so we check separately and skip the request when missing.
   * Issued as its own `useRBAC` call because it collapses to `canRead` and
   * would collide with any other `*.read` permission in the same call.
   *
   * `useRBAC` resolves async (it hits `/admin/permissions/check`), so we
   * gate the initial fetch on `isLoading` settling — otherwise the effect
   * would always observe the default `false` and skip the users request.
   */
  const {
    allowedActions: { canRead: canReadAdminUsers },
    isLoading: isLoadingAdminUsersRBAC,
  } = useRBAC([{ action: 'admin::users.read', subject: null }]);

  /**
   * Project Languages without default language
   */
  const [projectLanguages, setProjectLanguages] = useState<any[]>([]);

  /**
   * Component state
   */
  const [isLoading, setIsLoading] = useState(true);
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  /**
   * Admin Panel Users
   */
  const [users, setUsers] = useState<AdminPanelUser[]>([]);

  /**
   * Global Settings form model
   */
  const [originalFormModel, setOriginalFormModel] = useState<any[]>([]);
  const [formModel, setFormModel] = useState<any>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const onCancelClick = () => {
    setFormModel(cloneDeep(originalFormModel));
    setHasUnsavedChanges(false);
  };

  /**
   * Save the Global Settings
   */
  const saveGlobalSettings = async (data: any) => {
    try {
      await PluginSettingsService.updatePluginSettings(data);
      setOriginalFormModel(cloneDeep(data));
      setHasUnsavedChanges(false);
      setShowSavedAlert(true);
    } catch (e: any) {
      throw e.data;
    }
  };

  /**
   * Patch Form Model
   */
  const patchFormModel = (key: any, value: any) => {
    const newFormModel = cloneDeep(formModel);
    set(newFormModel, key, value);
    setFormModel(newFormModel);
    setHasUnsavedChanges(!isEqual(originalFormModel, newFormModel));
  };

  const getUserLabel = (user: AdminPanelUser) => {
    return `${user.firstname} ${user.lastname || ''}${user.lastname ? ' ' : ''}(${user.email})`;
  };

  useEffect(() => {
    // Wait for the admin::users.read check to resolve before firing the
    // fetch — otherwise the effect always sees the default `false` and
    // skips the users request even for roles that do have the permission.
    if (isLoadingAdminUsersRBAC) {
      return;
    }

    async function fetchData() {
      setIsLoading(true);

      // `/admin/users` is gated by Strapi's core `admin::users.read` permission,
      // which our plugin can't grant. Skip the request entirely when the role
      // doesn't have it — the UI surfaces a note in the webhook-author block.
      // Keep the catch as a defensive fallback (older Strapi versions, stale
      // RBAC cache) so a 403 here doesn't blank the whole settings page.
      const [project, globalSettings, users] = await Promise.all([
        ProjectService.getConnectedProject(),
        PluginSettingsService.getPluginSettings(),
        canReadAdminUsers
          ? StrapiUsersService.getAdminPanelUsers().catch(() => [] as AdminPanelUser[])
          : Promise.resolve([] as AdminPanelUser[]),
      ]);

      const projectLanguagesWithoutDefaultLanguage =
        project?.languages?.filter((language) => language.id !== project.sourceLanguage) || [];
      setProjectLanguages(projectLanguagesWithoutDefaultLanguage);

      setFormModel(globalSettings);
      setOriginalFormModel(cloneDeep(globalSettings));

      setUsers(users);

      setIsLoading(false);
    }
    void fetchData();
    // Re-run only when the RBAC check transitions from loading → resolved.
    // `canReadAdminUsers` is read off the same hook and is stable once
    // `isLoadingAdminUsersRBAC` is false, so omitting it is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAdminUsersRBAC]);

  return (
    <>
      <Layouts.Header
        title={t('plugin_settings.global_settings')}
        subtitle={t('plugin_settings.global_settings_description')}
        primaryAction={
          <Flex gap={2}>
            <Button variant='secondary' disabled={!canUpdateSettings || !hasUnsavedChanges} onClick={onCancelClick}>
              {t('plugin_settings.cancel')}
            </Button>
            <Button
              startIcon={<Check />}
              disabled={!canUpdateSettings || !hasUnsavedChanges}
              onClick={() => {
                void saveGlobalSettings(formModel);
              }}
            >
              {t('plugin_settings.save')}
            </Button>
          </Flex>
        }
        as='h2'
      />
      <Box marginRight={10} marginLeft={10}>
        {!isLoading && showSavedAlert && (
          <Box marginBottom={8}>
            <Alert
              onClose={() => setShowSavedAlert(false)}
              closeLabel={t('plugin_settings.close')}
              title={t('plugin_settings.content_transfer_setup_saved')}
              variant='success'
            >
              {t('plugin_settings.global_settings_saved_successfully')}
            </Alert>
          </Box>
        )}
        {!isLoading && (
          <Box background='neutral0' padding={7} paddingTop={6} shadow='tableShadow' hasRadius>
            <Box
              style={{
                maxWidth: '500px',
              }}
            >
              {/* Upload Settings */}
              <Typography variant='delta' textColor='neutral800'>
                {t('plugin_settings.upload_settings')}
              </Typography>
              {/* Allow automated upload to Localazy */}
              <br />
              <br />
              <Field.Root hint={t('plugin_settings.allow_automated_upload_to_localazy_info')}>
                <Field.Label>{t('plugin_settings.allow_automated_upload_to_localazy')}</Field.Label>
                <Toggle
                  offLabel={t('plugin_settings.off')}
                  onLabel={t('plugin_settings.on')}
                  disabled={!canUpdateSettings}
                  checked={
                    typeof formModel?.upload?.allowAutomated === 'boolean' ? formModel.upload.allowAutomated : false
                  }
                  onChange={(e: any) => patchFormModel('upload.allowAutomated', e.target.checked)}
                />
                <Field.Hint />
              </Field.Root>
              {/* Automated upload triggers */}
              <br />
              <br />
              <Field.Root hint={t('plugin_settings.automated_upload_triggers_info')}>
                <Field.Label>{t('plugin_settings.automated_upload_triggers')}</Field.Label>
                <MultiSelect
                  label={t('plugin_settings.automated_upload_triggers')}
                  hint={t('plugin_settings.automated_upload_triggers_info')}
                  clearLabel={t('plugin_settings.clear')}
                  placeholder={t('plugin_settings.automated_upload_triggers_placeholder')}
                  onClear={() => patchFormModel('upload.automatedTriggers', [])}
                  value={formModel?.upload?.automatedTriggers || []}
                  onChange={(values: any) => patchFormModel('upload.automatedTriggers', values)}
                  disabled={
                    !canUpdateSettings ||
                    (typeof formModel?.upload?.allowAutomated === 'boolean' ? !formModel.upload.allowAutomated : true)
                  }
                  multi
                  withTags
                >
                  <MultiSelectOption value='created'>{t('plugin_settings.creating_new_data_entry')}</MultiSelectOption>
                  <MultiSelectOption value='updated'>{t('plugin_settings.editing_data_entry')}</MultiSelectOption>
                </MultiSelect>
                <Field.Hint />
              </Field.Root>
              {/* Deprecate source keys on deletion */}
              <br />
              <br />
              <Field.Root hint={t('plugin_settings.deprecate_source_keys_on_delete_info')}>
                <Field.Label>{t('plugin_settings.deprecate_source_keys_on_delete')}</Field.Label>
                <Toggle
                  hint={t('plugin_settings.deprecate_source_keys_on_delete_info')}
                  offLabel={t('plugin_settings.off')}
                  onLabel={t('plugin_settings.on')}
                  disabled={!canUpdateSettings}
                  checked={
                    typeof formModel?.upload?.allowDeprecate === 'boolean' ? formModel.upload.allowDeprecate : false
                  }
                  onChange={(e: any) => patchFormModel('upload.allowDeprecate', e.target.checked)}
                />
                <Field.Hint />
              </Field.Root>
              <br />
              <br />
              <Divider />
              {/* Download Settings */}
              <br />
              <br />
              <Typography variant='delta' textColor='neutral800'>
                {t('plugin_settings.download_settings')}
              </Typography>
              {/* Webhook Configuration — first, as it's the prerequisite */}
              <br />
              <br />
              <Typography variant='omega' fontWeight='semiBold' textColor='neutral800'>
                {t('plugin_settings.webhook_setup_title')}
              </Typography>
              <br />
              <WebhookSetup disabled={!canUpdateSettings} />
              <br />
              <br />
              <Divider />
              {/* Webhook behavior settings */}
              <br />
              <br />
              <Typography variant='omega' fontWeight='semiBold' textColor='neutral800'>
                {t('plugin_settings.webhook_behavior_title')}
              </Typography>
              {/* Processing of download webhook */}
              <br />
              <br />
              <Field.Root hint={t('plugin_settings.processing_of_download_webhook_info')}>
                <Field.Label>{t('plugin_settings.processing_of_download_webhook')}</Field.Label>
                <Toggle
                  hint={t('plugin_settings.processing_of_download_webhook_info')}
                  offLabel={t('plugin_settings.off')}
                  onLabel={t('plugin_settings.on')}
                  disabled={!canUpdateSettings}
                  checked={
                    typeof formModel?.download?.processDownloadWebhook === 'boolean'
                      ? formModel.download.processDownloadWebhook
                      : true
                  }
                  onChange={(e: any) => patchFormModel('download.processDownloadWebhook', e.target.checked)}
                />
                <Field.Hint />
              </Field.Root>
              {/* Webhook actions author */}
              <br />
              <br />
              <Field.Root hint={t('plugin_settings.webhook_author_info')}>
                <Field.Label>{t('plugin_settings.webhook_author')}</Field.Label>
                <SingleSelect
                  hint={t('plugin_settings.webhook_author_info')}
                  clearLabel={t('plugin_settings.clear')}
                  placeholder={t('plugin_settings.webhook_author_placeholder')}
                  onClear={() => patchFormModel('download.webhookAuthorId', null)}
                  value={formModel?.download?.webhookAuthorId || null}
                  onChange={(value: any) => patchFormModel('download.webhookAuthorId', value)}
                  disabled={!canUpdateSettings || !canReadAdminUsers}
                >
                  {(() => {
                    const savedAuthorId = formModel?.download?.webhookAuthorId;
                    // Without `admin::users.read` the users list is empty, so
                    // the SingleSelect would have no option matching the
                    // saved id and fall back to placeholder. Inject a stub
                    // option so the saved author is at least visible by id.
                    // Compare as strings — the stored id can be a number
                    // (from the API) or a string (after `SingleSelect`'s
                    // `onChange`), and `===` would mismatch across types.
                    const needsFallback =
                      savedAuthorId != null && !users.some((user) => String(user.id) === String(savedAuthorId));
                    return (
                      <>
                        {needsFallback && (
                          <SingleSelectOption key={`fallback-${savedAuthorId}`} value={savedAuthorId}>
                            {t('plugin_settings.webhook_author_unknown_user', { id: savedAuthorId })}
                          </SingleSelectOption>
                        )}
                        {users.map((user) => (
                          <SingleSelectOption key={user.id} value={user.id}>
                            {getUserLabel(user)}
                          </SingleSelectOption>
                        ))}
                      </>
                    );
                  })()}
                </SingleSelect>
                <Field.Hint />
              </Field.Root>
              {!canReadAdminUsers && (
                <Box paddingTop={2}>
                  <Typography variant='pi' textColor='warning600'>
                    {t('plugin_settings.webhook_author_permission_required')}
                  </Typography>
                </Box>
              )}
              {/* Webhook languages selector */}
              <br />
              <br />
              <LanguagesSelector
                preselectedLanguages={formModel?.download?.webhookLanguages || []}
                projectLanguages={projectLanguages}
                onChange={(languages) => patchFormModel('download.webhookLanguages', languages)}
                label={t('plugin_settings.webhook_languages')}
                hint={t('plugin_settings.webhook_languages_info')}
                placeholder={t('plugin_settings.webhook_languages_placeholder')}
                disabled={!canUpdateSettings}
              />
              {/* Webhook incremental sync */}
              <br />
              <br />
              <Field.Root hint={t('plugin_settings.webhook_incremental_sync_info')}>
                <Field.Label>{t('plugin_settings.webhook_incremental_sync')}</Field.Label>
                <Toggle
                  offLabel={t('plugin_settings.off')}
                  onLabel={t('plugin_settings.on')}
                  disabled={!canUpdateSettings}
                  checked={
                    typeof formModel?.download?.webhookIncrementalSync === 'boolean'
                      ? formModel.download.webhookIncrementalSync
                      : true
                  }
                  onChange={(e: any) => patchFormModel('download.webhookIncrementalSync', e.target.checked)}
                />
                <Field.Hint />
              </Field.Root>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export { GlobalSettings };
