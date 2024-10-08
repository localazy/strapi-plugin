"use strict";

const { LOCALAZY_PLUGIN_CHANNEL } = require('../../constants/channels');
const generateRandomId = require('../../utils/generate-random-id');

class JobNotificationService {
  _strapio;
  _channel;
  _jobStreamIdentifier;
  constructor(strapio) {
    this._strapio = strapio;
    this._channel = LOCALAZY_PLUGIN_CHANNEL;
    this._jobStreamIdentifier = generateRandomId();
  }

  setChannel(channel) {
    this._channel = channel;
  }

  getStreamIdentifier() {
    return this._jobStreamIdentifier;
  }

  async emit(event, data) {
    await new Promise((resolve) => setImmediate(resolve));
    this._strapio.emitRaw(this._channel, `${event}:${this._jobStreamIdentifier}`, data);
  }
}

module.exports = JobNotificationService;
