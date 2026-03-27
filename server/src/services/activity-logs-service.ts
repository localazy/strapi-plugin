import { Core } from '@strapi/strapi';
import getStrapiStore from '../db/model/utils/get-strapi-store';
import { KEY, ActivityLogs, ActivityLogSession, ActivityLogEntry, emptyActivityLogs } from '../db/model/activity-logs';
import { generateRandomId } from '../utils/generate-random-id';

const MAX_SESSIONS = 100;

const ActivityLogsService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getActivityLogs(): Promise<ActivityLogs> {
    const pluginStore = getStrapiStore(strapi);
    const logs = (await pluginStore.get({ key: KEY })) as ActivityLogs;

    return logs || emptyActivityLogs;
  },

  async saveActivityLogs(logs: ActivityLogs): Promise<void> {
    const pluginStore = getStrapiStore(strapi);
    await pluginStore.set({
      key: KEY,
      value: logs,
    });
  },

  async startSession(eventType: ActivityLogSession['eventType'], initiatedBy: string): Promise<string> {
    const logs = await this.getActivityLogs();
    const sessionId = generateRandomId();

    const session: ActivityLogSession = {
      id: sessionId,
      eventType,
      status: 'in-progress',
      startedAt: Date.now(),
      initiatedBy,
      summary: '',
      entries: [],
    };

    logs.sessions.unshift(session);

    // Keep max sessions
    if (logs.sessions.length > MAX_SESSIONS) {
      logs.sessions = logs.sessions.slice(0, MAX_SESSIONS);
    }

    await this.saveActivityLogs(logs);

    return sessionId;
  },

  async addEntry(sessionId: string, message: string, data?: any): Promise<void> {
    const logs = await this.getActivityLogs();
    const session = logs.sessions.find((s) => s.id === sessionId);

    if (!session) {
      return;
    }

    const entry: ActivityLogEntry = {
      message,
      timestamp: Date.now(),
      data,
    };

    session.entries.push(entry);
    await this.saveActivityLogs(logs);
  },

  async finishSession(sessionId: string, status: 'completed' | 'failed', summary: string): Promise<void> {
    const logs = await this.getActivityLogs();
    const session = logs.sessions.find((s) => s.id === sessionId);

    if (!session) {
      return;
    }

    session.status = status;
    session.finishedAt = Date.now();
    session.summary = summary;
    await this.saveActivityLogs(logs);
  },

  async getSessions(eventType?: ActivityLogSession['eventType']): Promise<ActivityLogSession[]> {
    const logs = await this.getActivityLogs();
    let { sessions } = logs;

    if (eventType) {
      sessions = sessions.filter((s) => s.eventType === eventType);
    }

    // Return sessions without entries for the list view
    return sessions.map((s) => ({
      ...s,
      entries: [],
    }));
  },

  async getSession(sessionId: string): Promise<ActivityLogSession | null> {
    const logs = await this.getActivityLogs();
    const session = logs.sessions.find((s) => s.id === sessionId);

    return session || null;
  },

  async clearSessions(): Promise<void> {
    await this.saveActivityLogs(emptyActivityLogs);
  },
});

export type ActivityLogsServiceReturnType = ReturnType<typeof ActivityLogsService>;

export default ActivityLogsService;
