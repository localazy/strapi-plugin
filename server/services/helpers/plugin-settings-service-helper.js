"use strict";

class PluginSettingsServiceHelper {
  constructor(strapi) {
    this.strapi = strapi;
    this.pluginSettingsService = strapi.plugin("localazy").service("pluginSettingsService");
  }

  async setup() {
    this.pluginSettings = await this.pluginSettingsService.getPluginSettings();
  }

  shouldAllowAutomatedUpload() {
    return typeof this.pluginSettings?.upload?.allowAutomated === "boolean" ? this.pluginSettings.upload.allowAutomated : false;
  }

  shouldAllowAutomatedCreatedTrigger() {
    const automatedTriggers = this.getAutomatedUploadTriggers();
    return this.shouldAllowAutomatedUpload() && automatedTriggers.includes("created");
  }

  shouldAllowAutomatedUpdatedTrigger() {
    const automatedTriggers = this.getAutomatedUploadTriggers();
    return this.shouldAllowAutomatedUpload() && automatedTriggers.includes("updated");
  }

  shouldAllowDeprecateOnDeletion() {
    return typeof this.pluginSettings?.upload?.allowDeprecate === "boolean" ? this.pluginSettings.upload.allowDeprecate : false;
  }

  shouldAllowWebhookDownloadProcess() {
    return typeof this.pluginSettings?.download?.processDownloadWebhook === "boolean" ? this.pluginSettings.download.processDownloadWebhook : true;
  }

  getAutomatedUploadTriggers() {
    return this.pluginSettings?.upload?.automatedTriggers || [];
  }
}

module.exports = PluginSettingsServiceHelper;
