import AlertsService from '../../alerts/services/alerts-service';
import { DOWNLOAD_EVENT, DOWNLOAD_FINISHED_EVENT } from '../../alerts/constants/events';

// TODO: ADD TYPES

export default class DownloadAlertsService extends AlertsService {
  onDownload(callback: any) {
    this.on(DOWNLOAD_EVENT, callback);
  }

  onDownloadFinished(callback: any) {
    this.on(DOWNLOAD_FINISHED_EVENT, callback);
  }
}
