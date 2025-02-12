import { getPluginSettingsService } from '../../core';
import type { PluginSettingsServiceReturnType } from '../plugin-settings-service';
class PluginSettingsServiceHelper {
  private PluginSettingsService: PluginSettingsServiceReturnType;
  private pluginSettings: any;

  constructor() {
    this.PluginSettingsService = getPluginSettingsService();
  }

  async setup() {
    this.pluginSettings = await this.PluginSettingsService.getPluginSettings();
  }

  shouldAllowAutomatedUpload(): boolean {
    return typeof this.pluginSettings?.upload?.allowAutomated === 'boolean'
      ? this.pluginSettings.upload.allowAutomated
      : false;
  }

  shouldAllowAutomatedCreatedTrigger(): boolean {
    const automatedTriggers = this.getAutomatedUploadTriggers();
    return this.shouldAllowAutomatedUpload() && automatedTriggers.includes('created');
  }

  shouldAllowAutomatedUpdatedTrigger(): boolean {
    const automatedTriggers = this.getAutomatedUploadTriggers();
    return this.shouldAllowAutomatedUpload() && automatedTriggers.includes('updated');
  }

  getAutomatedUploadTriggers(): string[] {
    return this.pluginSettings?.upload?.automatedTriggers || [];
  }

  shouldAllowDeprecateOnDeletion(): boolean {
    return typeof this.pluginSettings?.upload?.allowDeprecate === 'boolean'
      ? this.pluginSettings.upload.allowDeprecate
      : false;
  }

  shouldAllowWebhookDownloadProcess(): boolean {
    return typeof this.pluginSettings?.download?.processDownloadWebhook === 'boolean'
      ? this.pluginSettings.download.processDownloadWebhook
      : true;
  }

  getWebhookAuthorId(): string | null {
    return this.pluginSettings?.download?.webhookAuthorId || null;
  }

  getWebhookLanguagesCodes(): string[] {
    return this.pluginSettings?.download?.webhookLanguages || [];
  }

  getUiLanguagesCodes(): string[] {
    return this.pluginSettings?.download?.uiLanguages || [];
  }
}

export default PluginSettingsServiceHelper;
