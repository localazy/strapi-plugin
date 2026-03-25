import { Core } from '@strapi/strapi';
import { EventType } from '../constants/events';
import jobNotificationServiceFactory from '../services/helpers/job-notification-service';
import RequestInitiatorHelper from '../utils/request-initiator-helper';
import PluginSettingsServiceHelper from '../services/helpers/plugin-settings-service-helper';
import { getLocalazyTransferUploadService, getLocalazyTransferDownloadService } from '../core';

const LocalazyTransferController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async upload(ctx: any) {
    const JobNotificationService = new jobNotificationServiceFactory(strapi.StrapIO);
    try {
      const LocalazyTransferUploadService = getLocalazyTransferUploadService();

      /**
       * start executing the function after a delay
       * (to let the client receive and subscribe to the messages stream)
       */
      // TODO: let the client send a message to the server to start the upload (that it's subscribed to the stream)
      setTimeout(() => LocalazyTransferUploadService.upload({ notificationService: JobNotificationService }), 1000);

      ctx.body = {
        streamIdentifier: JobNotificationService.getStreamIdentifier(),
      };
    } catch (e: any) {
      strapi.log.error(e.message);
      await JobNotificationService.emit(EventType.UPLOAD_FINISHED, {
        success: false,
        message: e.message,
      });
      ctx.throw(400, e);
    }
  },

  async download(ctx: any) {
    const JobNotificationService = new jobNotificationServiceFactory(strapi.StrapIO);
    try {
      const LocalazyTransferDownloadService = getLocalazyTransferDownloadService();

      // Determine fullSync mode
      let fullSync = ctx.request.body?.fullSync === true;

      // For webhook-initiated requests, respect the webhook incremental sync setting
      const requestInitiatorHelper = new RequestInitiatorHelper(strapi);
      if (requestInitiatorHelper.isInitiatedByLocalazyWebhook()) {
        const pluginSettingsServiceHelper = new PluginSettingsServiceHelper();
        await pluginSettingsServiceHelper.setup();
        fullSync = !pluginSettingsServiceHelper.shouldWebhookUseIncrementalSync();
      }

      /**
       * start executing the function after a delay
       * (to let the client receive and subscribe to the messages stream)
       */
      // TODO: let the client send a message to the server to start the download (that it's subscribed to the stream)
      setTimeout(
        () =>
          LocalazyTransferDownloadService.download({
            notificationService: JobNotificationService,
            fullSync,
          }),
        1000
      );

      ctx.body = {
        streamIdentifier: JobNotificationService.getStreamIdentifier(),
      };
    } catch (e) {
      strapi.log.error(e.message);
      await JobNotificationService.emit(EventType.DOWNLOAD_FINISHED, {
        success: false,
        message: e.message,
      });
      ctx.throw(400, e);
    }
  },
});

export default LocalazyTransferController;
