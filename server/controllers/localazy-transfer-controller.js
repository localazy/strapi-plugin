"use strict";


const generateRandomId = require('../utils/generate-random-id');
const { LOCALAZY_PLUGIN_CHANNEL } = require('../constants/channels');
const { UPLOAD_FINISHED_EVENT, DOWNLOAD_FINISHED_EVENT } = require('../constants/events');
const jobNotificationServiceFactory = require('../services/helpers/job-notification-service');

module.exports = {
  async upload(ctx) {
    const streamIdentifier = generateRandomId();
    try {
      const LocalazyTransferUploadService = strapi
        .plugin("localazy")
        .service("localazyTransferUploadService");

      /**
       * start executing the function after a delay
       * (to let the client receive and subscribe to the messages stream)
       */
      // TODO: let the client send a message to the server to start the upload (that it's subscribed to the stream)
      setTimeout(() => (LocalazyTransferUploadService.upload(streamIdentifier, ctx)), 1000);

      ctx.body = {
        streamIdentifier,
      };

    } catch (e) {
      strapi.log.error(e.message);
      strapi.StrapIO.emitRaw(LOCALAZY_PLUGIN_CHANNEL, `${UPLOAD_FINISHED_EVENT}:${streamIdentifier}`, {
        success: false,
        message: e.message,
      });
      ctx.throw(400, e);
    }
  },

  async download(ctx) {
    const JobNotificationService = new jobNotificationServiceFactory(strapi.StrapIO);
    try {
      const LocalazyTransferDownloadService = strapi
        .plugin("localazy")
        .service("localazyTransferDownloadService");

      /**
       * start executing the function after a delay
       * (to let the client receive and subscribe to the messages stream)
       */
      // TODO: let the client send a message to the server to start the download (that it's subscribed to the stream)
      setTimeout(() => (LocalazyTransferDownloadService.download(JobNotificationService, ctx)), 1000);

      ctx.body = {
        streamIdentifier: JobNotificationService.getStreamIdentifier(),
      };
    } catch (e) {
      strapi.log.error(e.message);
      await JobNotificationService.emit(DOWNLOAD_FINISHED_EVENT, {
        success: false,
        message: e.message,
      });
      ctx.throw(400, e);
    }
  },
};
