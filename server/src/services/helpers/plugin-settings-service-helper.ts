import { Core } from '@strapi/strapi';

class PluginSettingsServiceHelper {
  private strapi: Core.Strapi;
  private pluginSettingsService: any;
  private pluginSettings: any;

  constructor(strapi: Core.Strapi) {
    this.strapi = strapi;
    this.pluginSettingsService = strapi.plugin('strapi-plugin-v5').service('pluginSettingsService');
  }

  async setup() {
    this.pluginSettings = await this.pluginSettingsService.getPluginSettings();
  }

  shouldAllowAutomatedUpload() {
    return typeof this.pluginSettings?.upload?.allowAutomated === 'boolean'
      ? this.pluginSettings.upload.allowAutomated
      : false;
  }

  shouldAllowAutomatedCreatedTrigger() {
    const automatedTriggers = this.getAutomatedUploadTriggers();
    return this.shouldAllowAutomatedUpload() && automatedTriggers.includes('created');
  }

  shouldAllowAutomatedUpdatedTrigger() {
    const automatedTriggers = this.getAutomatedUploadTriggers();
    return this.shouldAllowAutomatedUpload() && automatedTriggers.includes('updated');
  }

  getAutomatedUploadTriggers() {
    return this.pluginSettings?.upload?.automatedTriggers || [];
  }

  shouldAllowDeprecateOnDeletion() {
    return typeof this.pluginSettings?.upload?.allowDeprecate === 'boolean'
      ? this.pluginSettings.upload.allowDeprecate
      : false;
  }

  shouldAllowWebhookDownloadProcess() {
    return typeof this.pluginSettings?.download?.processDownloadWebhook === 'boolean'
      ? this.pluginSettings.download.processDownloadWebhook
      : true;
  }

  getWebhookAuthorId() {
    return this.pluginSettings?.download?.webhookAuthorId || null;
  }

  getWebhookLanguagesCodes() {
    return this.pluginSettings?.download?.webhookLanguages || [];
  }

  getUiLanguagesCodes() {
    return this.pluginSettings?.download?.uiLanguages || [];
  }
}

export default PluginSettingsServiceHelper;
