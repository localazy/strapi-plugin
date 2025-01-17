import AlertsService from "../../alerts/services/alerts-service";
import { UPLOAD_EVENT, UPLOAD_FINISHED_EVENT } from "../../alerts/constants/events";

// TODO: ADD TYPES

export default class UploadAlertsService extends AlertsService {
  onUpload(callback: any) {
    this.on(UPLOAD_EVENT, callback);
  }

  onUploadFinished(callback: any) {
    this.on(UPLOAD_FINISHED_EVENT, callback);
  }
}
