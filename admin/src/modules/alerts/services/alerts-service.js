import SocketIoClient from "socket.io-client";
import { LOCALAZY_PLUGIN_CHANNEL } from "../constants/channels";


export default class AlertsService {
  _client;

  _streamIdentifier;

  constructor() {
    this._client = SocketIoClient.connect(process.env.STRAPI_ADMIN_BACKEND_URL);
  }

  setStreamIdentifier(streamIdentifier) {
    this._streamIdentifier = streamIdentifier;
  }

  subscribe(channel = null) {
    this._client.emit("subscribe", channel || LOCALAZY_PLUGIN_CHANNEL);
  }

  on(event, callback) {
    this._client.on(`${event}:${this._streamIdentifier}`, callback);
  }
}
