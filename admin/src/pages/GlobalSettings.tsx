import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cloneDeep from "lodash-es/cloneDeep";
import { Layouts } from "@strapi/strapi/admin";
import { Check } from "@strapi/icons";
import { Field, Box, Button, Toggle, MultiSelect, MultiSelectOption, SingleSelect, SingleSelectOption, Alert, Flex, Divider, Typography } from "@strapi/design-system";
import isEqual from "lodash-es/isEqual";
import set from "lodash-es/set";
import { LanguagesSelector } from "../modules/@common/components/LanguagesSelector";
import PluginSettingsService from "../modules/plugin-settings/services/plugin-settings-service";
import StrapiUsersService from "../modules/plugin-settings/services/strapi-users-service";
import ProjectService from "../modules/@common/services/project-service";

// TODO: ADD TYPES

// TODO: Rewrite as provider component
// import and load resources
import '../i18n';

const FieldWithMaxWidth = (props: any) => {
  return <Box maxWidth={props.maxWidth}>{props.children}</Box>;
}

const GlobalSettings: React.FC = () => {
  /**
   * Translation function
   */
  const { t } = useTranslation();

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
  const [users, setUsers] = useState<any[]>([]);

  /**
   * Global Settings form model
   */
  const [originalFormModel, setOriginalFormModel] = useState<any[]>([]);
  const [formModel, setFormModel] = useState<any>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const onCancelClick = () => {
    setFormModel(cloneDeep(originalFormModel));
    setHasUnsavedChanges(false);
  }

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

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      const project = await ProjectService.getConnectedProject();
      const projectLanguagesWithoutDefaultLanguage =
        project?.languages?.filter(language => language.id !== project.sourceLanguage) || [];
      setProjectLanguages(projectLanguagesWithoutDefaultLanguage);

      const globalSettings = await PluginSettingsService.getPluginSettings();

      setFormModel(globalSettings);
      setOriginalFormModel(cloneDeep(globalSettings));

      const users = await StrapiUsersService.getAdminPanelUsers();
      setUsers(users);

      setIsLoading(false);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Layouts.Header
        title={t("plugin_settings.global_settings")}
        subtitle={t("plugin_settings.global_settings_description")}
        primaryAction={
          <Flex gap={2}>
            <Button
              variant="secondary"
              disabled={!hasUnsavedChanges}
              onClick={onCancelClick}
            >
              {t("plugin_settings.cancel")}
            </Button>
            <Button
              startIcon={<Check />}
              disabled={!hasUnsavedChanges}
              onClick={() => { saveGlobalSettings(formModel) }}
            >
              {t("plugin_settings.save")}
            </Button>
          </Flex>
        }
        as="h2"
      />
      <Box marginRight={10} marginLeft={10}>
        {!isLoading && showSavedAlert && (
          <Box marginBottom={8}>
            <Alert
              onClose={() => setShowSavedAlert(false)}
              closeLabel={t("plugin_settings.close")}
              title={t("plugin_settings.content_transfer_setup_saved")}
              variant="success"
            >
              {t("plugin_settings.global_settings_saved_successfully")}
            </Alert>
          </Box>
        )}
        {!isLoading && (
          <Box
            background="neutral0"
            padding={7}
            paddingTop={6}
            shadow="tableShadow"
            hasRadius
          >
            <Box
              style={{
                maxWidth: "500px"
              }}
            >
              {/* Upload Settings */}
              <Typography
                variant="delta"
              textColor="neutral800"
              >
                {t("plugin_settings.upload_settings")}
              </Typography>
              {/* Allow automated upload to Localazy */}
              <br /><br />
              <Field.Root
                hint={t("plugin_settings.allow_automated_upload_to_localazy_info")}
                >
                  <Field.Label>
                    {t("plugin_settings.allow_automated_upload_to_localazy")}
                  </Field.Label>
                  <Toggle
                    offLabel={t("plugin_settings.off")}
                    onLabel={t("plugin_settings.on")}
                    checked={typeof formModel?.upload?.allowAutomated === "boolean" ? formModel.upload.allowAutomated : false}
                    onChange={(e: any) => patchFormModel("upload.allowAutomated", e.target.checked)} />
                  <Field.Hint />
                  </Field.Root>
              {/* Automated upload triggers */}
              <br /><br />
              <Field.Root
                hint={t("plugin_settings.automated_upload_triggers_info")}
              >
                <Field.Label>
                  {t("plugin_settings.automated_upload_triggers")}
                </Field.Label>
                <MultiSelect
                  label={t("plugin_settings.automated_upload_triggers")}
                  hint={t("plugin_settings.automated_upload_triggers_info")}
                clearLabel={t("plugin_settings.clear")}
                placeholder={t("plugin_settings.automated_upload_triggers_placeholder")}
                onClear={() => patchFormModel("upload.automatedTriggers", [])}
                value={formModel?.upload?.automatedTriggers || []}
                onChange={(values: any) => patchFormModel("upload.automatedTriggers", values)}
                disabled={typeof formModel?.upload?.allowAutomated === "boolean" ? !formModel.upload.allowAutomated : true}
                multi
                  withTags
                >
                  <MultiSelectOption value="created">{t("plugin_settings.creating_new_data_entry")}</MultiSelectOption>
                  <MultiSelectOption value="updated">{t("plugin_settings.editing_data_entry")}</MultiSelectOption>
                </MultiSelect>
                <Field.Hint />
              </Field.Root>
              {/* Deprecate source keys on deletion */}
              <br /><br />
              <Field.Root
                hint={t("plugin_settings.deprecate_source_keys_on_delete_info")}
              >
                <Field.Label>
                  {t("plugin_settings.deprecate_source_keys_on_delete")}
                </Field.Label>
                <Toggle
                hint={t("plugin_settings.deprecate_source_keys_on_delete_info")}
                offLabel={t("plugin_settings.off")}
                onLabel={t("plugin_settings.on")}
                  checked={typeof formModel?.upload?.allowDeprecate === "boolean" ? formModel.upload.allowDeprecate : false}
                  onChange={(e: any) => patchFormModel("upload.allowDeprecate", e.target.checked)} />
                <Field.Hint />
              </Field.Root>
              <br /><br />
              <Divider />
              {/* Download Settings */}
              <br /><br />
              <Typography
                variant="delta"
                textColor="neutral800"
              >
                {t("plugin_settings.download_settings")}
              </Typography>
              {/* Processing of download webhook */}
              <br /><br />
              <Field.Root
                hint={t("plugin_settings.processing_of_download_webhook_info")}
              >
                <Field.Label>
                  {t("plugin_settings.processing_of_download_webhook")}
                </Field.Label>
                <Toggle
                  hint={t("plugin_settings.processing_of_download_webhook_info")}
                  offLabel={t("plugin_settings.off")}
                  onLabel={t("plugin_settings.on")}
                // eslint-disable-next-line max-len
                  checked={typeof formModel?.download?.processDownloadWebhook === "boolean" ? formModel.download.processDownloadWebhook : true}
                  onChange={(e: any) => patchFormModel("download.processDownloadWebhook", e.target.checked)} />
                <Field.Hint />
              </Field.Root>
              {/* Webhook actions author */}
              <br /><br />
              <Field.Root
                hint={t("plugin_settings.webhook_author_info")}
              >
                <Field.Label>
                  {t("plugin_settings.webhook_author")}
                </Field.Label>
                <SingleSelect
                  hint={t("plugin_settings.webhook_author_info")}
                  clearLabel={t("plugin_settings.clear")}
                  placeholder={t("plugin_settings.webhook_author_placeholder")}
                  onClear={() => patchFormModel("download.webhookAuthorId", null)}
                  value={formModel?.download?.webhookAuthorId || null}
                  onChange={(value: any) => patchFormModel("download.webhookAuthorId", value)}
                >
                  {users.map(user => (
                    <SingleSelectOption
                      key={user.id}
                      value={user.id}
                    >
                      {`${user.firstname} ${user.lastname} (${user.email})`}
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
                <Field.Hint />
              </Field.Root>
              {/* Webhook languages selector */}
              <br /><br />
              <LanguagesSelector
                preselectedLanguages={formModel?.download?.webhookLanguages || []}
                projectLanguages={projectLanguages}
                onChange={(languages) => patchFormModel("download.webhookLanguages", languages)}
                label={t("plugin_settings.webhook_languages")}
                hint={t("plugin_settings.webhook_languages_info")}
                placeholder={t("plugin_settings.webhook_languages_placeholder")}
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}

export { GlobalSettings };
