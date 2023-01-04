import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cloneDeep from "lodash-es/cloneDeep";
import { HeaderLayout } from "@strapi/design-system/Layout";
import Check from "@strapi/icons/Check";
import { Box } from "@strapi/design-system/Box";
import { Button } from "@strapi/design-system/Button";
import { ToggleInput } from '@strapi/design-system/ToggleInput';
import { Select, Option } from '@strapi/design-system/Select';
import { Alert } from "@strapi/design-system/Alert";
import { Redirect } from "react-router-dom";
import { Flex } from "@strapi/design-system/Flex";
import { Divider } from "@strapi/design-system/Divider";
import { Typography } from "@strapi/design-system/Typography";
import isEqual from "lodash-es/isEqual";
import set from "lodash-es/set";
import LanguagesSelector from "../../../@common/components/LanguagesSelector";
import PluginSettingsService from "../../services/plugin-settings-service";
import StrapiUsersService from "../../services/strapi-users-service";
import { getLocalazyIdentity } from "../../../../state/localazy-identity";
import ProjectService from "../../../@common/services/project-service";
import pluginId from "../../../../pluginId";

import "../../../../i18n";

function GlobalSettings() {
  /**
   * Translation function
   */
  const { t } = useTranslation();

  /**
   * Is user logged in
   */
  const [localazyIdentity] = getLocalazyIdentity();
  const hasLocalazyIdentity = () => !!localazyIdentity.accessToken;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * Connected project
   */
  const [, setConnectedProject] = useState({});

  /**
   * Project Languages without default language
   */
  const [projectLanguages, setProjectLanguages] = useState([]);

  /**
   * Component state
   */
  const [isLoading, setIsLoading] = useState(true);
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  /**
   * Admin Panel Users
   */
  const [users, setUsers] = useState([]);

  /**
   * Global Settings form model
   */
  const [originalFormModel, setOriginalFormModel] = useState([]);
  const [formModel, setFormModel] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const onCancelClick = () => {
    setFormModel(cloneDeep(originalFormModel));
    setHasUnsavedChanges(false);
  }

  /**
   * Save the Global Settings
   */
  const saveGlobalSettings = async (data) => {
    try {
      await PluginSettingsService.updatePluginSettings(data);
      setOriginalFormModel(cloneDeep(data));
      setHasUnsavedChanges(false);
      setShowSavedAlert(true);
    } catch (e) {
      throw e.data;
    }
  };

  /**
   * Patch Form Model
   */
  const patchFormModel = (key, value) => {
    const newFormModel = cloneDeep(formModel);
    set(newFormModel, key, value);
    setFormModel(newFormModel);
    setHasUnsavedChanges(!isEqual(originalFormModel, newFormModel));
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setIsLoggedIn(hasLocalazyIdentity());

      if (!hasLocalazyIdentity()) {
        setIsLoading(false);

        return;
      }

      const project = await ProjectService.getConnectedProject();
      setConnectedProject(project);
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
      {!isLoading && !isLoggedIn && <Redirect to={`${process.env.ADMIN_PATH}plugins/${pluginId}/login`} />}

      <HeaderLayout
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
              onClose={() => showSavedAlert(false)}
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
            {/* Upload Settings */}
            <Typography
              variant="delta"
              textColor="neutral800"
            >
              {t("plugin_settings.upload_settings")}
            </Typography>
            {/* Allow automated upload to Localazy */}
            <br /><br />
            <ToggleInput
              label={t("plugin_settings.allow_automated_upload_to_localazy")}
              hint={t("plugin_settings.allow_automated_upload_to_localazy_info")}
              offLabel={t("plugin_settings.off")}
              onLabel={t("plugin_settings.on")}
              checked={typeof formModel?.upload?.allowAutomated === "boolean" ? formModel.upload.allowAutomated : false}
              onChange={e => patchFormModel("upload.allowAutomated", e.target.checked)} />
            {/* Automated upload triggers */}
            <br /><br />
            <Select
              label={t("plugin_settings.automated_upload_triggers")}
              hint={t("plugin_settings.automated_upload_triggers_info")}
              clearLabel={t("plugin_settings.clear")}
              placeholder={t("plugin_settings.automated_upload_triggers_placeholder")}
              onClear={() => patchFormModel("upload.automatedTriggers", [])}
              value={formModel?.upload?.automatedTriggers || []}
              onChange={(values) => patchFormModel("upload.automatedTriggers", values)}
              disabled={typeof formModel?.upload?.allowAutomated === "boolean" ? !formModel.upload.allowAutomated : true}
              multi
              withTags
            >
              <Option value="created">{t("plugin_settings.creating_new_data_entry")}</Option>
              <Option value="updated">{t("plugin_settings.editing_data_entry")}</Option>
            </Select>
            {/* Deprecate source keys on deletion */}
            <br /><br />
            <ToggleInput
              label={t("plugin_settings.deprecate_source_keys_on_delete")}
              hint={t("plugin_settings.deprecate_source_keys_on_delete_info")}
              offLabel={t("plugin_settings.off")}
              onLabel={t("plugin_settings.on")}
              checked={typeof formModel?.upload?.allowDeprecate === "boolean" ? formModel.upload.allowDeprecate : false}
              onChange={e => patchFormModel("upload.allowDeprecate", e.target.checked)} />
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
            <ToggleInput
              label={t("plugin_settings.processing_of_download_webhook")}
              hint={t("plugin_settings.processing_of_download_webhook_info")}
              offLabel={t("plugin_settings.off")}
              onLabel={t("plugin_settings.on")}
              // eslint-disable-next-line max-len
              checked={typeof formModel?.download?.processDownloadWebhook === "boolean" ? formModel.download.processDownloadWebhook : true}
              onChange={e => patchFormModel("download.processDownloadWebhook", e.target.checked)} />
            {/* Webhook actions author */}
            <br /><br />
            <Select
              label={t("plugin_settings.webhook_author")}
              hint={t("plugin_settings.webhook_author_info")}
              clearLabel={t("plugin_settings.clear")}
              placeholder={t("plugin_settings.webhook_author_placeholder")}
              onClear={() => patchFormModel("download.webhookAuthorId", null)}
              value={formModel?.download?.webhookAuthorId || null}
              onChange={(value) => patchFormModel("download.webhookAuthorId", value)}
            >
              {users.map(user => (
                <Option
                  key={user.id}
                  value={user.id}
                >
                  {`${user.firstname} ${user.lastname} (${user.email})`}
                </Option>
              ))}
            </Select>
            {/* Webhook languages selector */}
            <br /><br />
            <LanguagesSelector
              preselectedLanguages={formModel?.download?.webhookLanguages || []}
              projectLanguages={projectLanguages}
              onChange={(languages) => patchFormModel("download.webhookLanguages", languages)}
            />

          </Box>
        )}
      </Box>
    </>
  );
}

export default GlobalSettings;
