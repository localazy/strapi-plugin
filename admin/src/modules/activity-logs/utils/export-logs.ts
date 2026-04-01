import { exportAsJson } from '../../@common/utils/export-json';
import ActivityLogsService from '../services/activity-logs-service';

export const exportLogsAsJson = async (): Promise<void> => {
  const sessions = await ActivityLogsService.exportSessions();
  exportAsJson(sessions, `localazy-activity-logs-${new Date().toISOString().split('T')[0]}`);
};
