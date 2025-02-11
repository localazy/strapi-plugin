import { io, Socket } from 'socket.io-client';
import { LOCALAZY_PLUGIN_CHANNEL } from '../constants/channels';

export default class AlertsService {
  _client: Socket;

  _streamIdentifier: string = '';

  constructor() {
    this._client = io(window.location.origin, {
      withCredentials: true,
      transports: ['websocket'],
    });
  }

  setStreamIdentifier(streamIdentifier: string) {
    this._streamIdentifier = streamIdentifier;
  }

  subscribe(channel?: string) {
    this._client.emit('subscribe', channel || LOCALAZY_PLUGIN_CHANNEL);
  }

  on(event: string, callback: any) {
    this._client.on(`${event}:${this._streamIdentifier}`, callback);
  }
}
