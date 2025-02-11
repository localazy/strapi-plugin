import { io, Socket } from 'socket.io-client';

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

  on(event: string, callback: any) {
    this._client.on(`${event}:${this._streamIdentifier}`, callback);
  }
}
