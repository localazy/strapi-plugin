import SocketIoClient from 'socket.io-client';
import { LOCALAZY_PLUGIN_CHANNEL } from '../constants/channels';

// TODO: ADD TYPES

export default class AlertsService {
  _client: any;

  _streamIdentifier: string = '';

  constructor() {
    const uri = process.env.STRAPI_ADMIN_BACKEND_URL;
    let path = '/socket.io'; // SocketIoClient defaults to this path too if it is not defined

    // If uri is not undefined nor empty, use the correct path to Strapi's socket
    if (uri !== undefined && uri.length > 0) {
      try {
        const { pathname } = new URL(
          uri,
          window.location.href // Mandatory in case uri is not a complete URL (e.g. /cms)
        );
        path = `${pathname}${pathname.endsWith('/') ? '' : '/'}socket.io`;
      } catch (e) {
        console.error(e);
      }
    }

    this._client = SocketIoClient(uri, { path }).connect();
  }

  setStreamIdentifier(streamIdentifier: string) {
    this._streamIdentifier = streamIdentifier;
  }

  subscribe(channel = null) {
    this._client.emit('subscribe', channel || LOCALAZY_PLUGIN_CHANNEL);
  }

  on(event: string, callback: any) {
    this._client.on(`${event}:${this._streamIdentifier}`, callback);
  }
}
