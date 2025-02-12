import { EventType } from 'src/constants/events';
import { ChannelType } from '../../constants/channels';
import { generateRandomId } from '../../utils/generate-random-id';
import { Server as SocketIOServer } from 'socket.io';
// TODO: ADD TYPES

export type JobNotificationServiceType = InstanceType<typeof JobNotificationService>;

class JobNotificationService {
  private _strapio: SocketIOServer;
  private _channel: ChannelType;
  private _jobStreamIdentifier: string;

  constructor(strapio: SocketIOServer) {
    this._strapio = strapio;
    this._channel = ChannelType.LOCALAZY_PLUGIN;
    this._jobStreamIdentifier = generateRandomId();
  }

  setChannel(channel: ChannelType) {
    this._channel = channel;
  }

  getStreamIdentifier() {
    return this._jobStreamIdentifier;
  }

  async emit(event: EventType, data: unknown) {
    await new Promise((resolve) => setImmediate(resolve));

    try {
      this._strapio.emit(`${event}:${this._jobStreamIdentifier}`, data);
    } catch (error) {
      strapi.log.error(`Failed to emit ${event}:`, error);
    }
  }
}

export default JobNotificationService;
