import { exportAsJson } from '../../@common/utils/export-json';
import ActivityLogsService from '../services/activity-logs-service';

const EVENT_TYPES = ['upload', 'download', 'webhook'] as const;

export const exportLogsAsJson = async (): Promise<void> => {
  const allSessions = [];

  for (const type of EVENT_TYPES) {
    const sessions = await ActivityLogsService.getSessions(type);
    if (!sessions?.length) continue;

    for (const session of sessions) {
      const detail = await ActivityLogsService.getSession(session.id);
      allSessions.push({ ...detail, eventType: type });
    }
  }

  exportAsJson(allSessions, `localazy-activity-logs-${new Date().toISOString().split('T')[0]}`);
};
