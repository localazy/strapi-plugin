import { EventType } from 'src/constants/events';
import { ChannelType } from '../../constants/channels';
import { generateRandomId } from '../../utils/generate-random-id';

// TODO: ADD TYPES

class JobNotificationService {
  private _strapio: any;
  private _channel: ChannelType;
  private _jobStreamIdentifier: string;

  constructor(strapio: any) {
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

  async emit(event: EventType, data: any) {
    await new Promise((resolve) => setImmediate(resolve));
    // this._strapio.emitRaw(this._channel, `${event}:${this._jobStreamIdentifier}`, data);
  }
}

export default JobNotificationService;
