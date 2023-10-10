import AlertsService from "../../alerts/services/alerts-service";
import { UPLOAD_EVENT, UPLOAD_FINISHED_EVENT } from "../../alerts/constants/events";

export default class UploadAlertsService extends AlertsService {
  onUpload(callback) {
    this.on(UPLOAD_EVENT, callback);
  }

  onUploadFinished(callback) {
    this.on(UPLOAD_FINISHED_EVENT, callback);
  }
}
