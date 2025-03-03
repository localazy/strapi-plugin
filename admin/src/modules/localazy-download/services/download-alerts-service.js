import AlertsService from "../../alerts/services/alerts-service";
import { DOWNLOAD_EVENT, DOWNLOAD_FINISHED_EVENT } from "../../alerts/constants/events";

export default class DownloadAlertsService extends AlertsService {
  onDownload(callback) {
    this.on(DOWNLOAD_EVENT, callback);
  }

  onDownloadFinished(callback) {
    this.on(DOWNLOAD_FINISHED_EVENT, callback);
  }
}
