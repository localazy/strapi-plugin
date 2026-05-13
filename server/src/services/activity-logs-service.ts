import { Core } from '@strapi/strapi';
import getStrapiStore from '../db/model/utils/get-strapi-store';
import {
  KEY,
  ActivityLogs,
  ActivityLogSession,
  ActivityLogEntry,
  AttemptedEntry,
  emptyActivityLogs,
} from '../db/model/activity-logs';
import { generateRandomId } from '../utils/generate-random-id';

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const ATTEMPTED_ENTRIES_CAP = 5000;

// Simple mutex to prevent concurrent read-modify-write races on the store
let writeLock: Promise<void> = Promise.resolve();
const withLock = async <T>(fn: () => Promise<T>): Promise<T> => {
  let release: () => void;
  const next = new Promise<void>((resolve) => {
    release = resolve;
  });
  const prev = writeLock;
  writeLock = next;
  await prev;
  try {
    return await fn();
  } finally {
    release!();
  }
};

const ActivityLogsService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getActivityLogs(): Promise<ActivityLogs> {
    const pluginStore = getStrapiStore(strapi);
    const logs = (await pluginStore.get({ key: KEY })) as ActivityLogs;

    return logs || { sessions: [] };
  },

  async saveActivityLogs(logs: ActivityLogs): Promise<void> {
    const pluginStore = getStrapiStore(strapi);
    await pluginStore.set({
      key: KEY,
      value: logs,
    });
  },

  async startSession(eventType: ActivityLogSession['eventType'], initiatedBy: string): Promise<string> {
    return withLock(async () => {
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

      // Evict sessions older than 1 year
      const cutoff = Date.now() - ONE_YEAR_MS;
      logs.sessions = logs.sessions.filter((s) => s.startedAt >= cutoff);

      await this.saveActivityLogs(logs);

      return sessionId;
    });
  },

  async addEntry(sessionId: string, message: string, data?: any): Promise<void> {
    return withLock(async () => {
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
    });
  },

  async recordAttemptedEntry(sessionId: string, entry: Omit<AttemptedEntry, 'attemptedAt'>): Promise<void> {
    return this.recordAttemptedEntries(sessionId, [entry]);
  },

  async recordAttemptedEntries(sessionId: string, entries: Array<Omit<AttemptedEntry, 'attemptedAt'>>): Promise<void> {
    if (!entries.length) {
      return;
    }
    return withLock(async () => {
      const logs = await this.getActivityLogs();
      const session = logs.sessions.find((s) => s.id === sessionId);

      if (!session) {
        return;
      }

      if (!session.attemptedEntries) {
        session.attemptedEntries = [];
      }

      const now = Date.now();
      const wasAtCap = session.attemptedEntries.length >= ATTEMPTED_ENTRIES_CAP;
      const remaining = Math.max(0, ATTEMPTED_ENTRIES_CAP - session.attemptedEntries.length);
      const accepted = entries.slice(0, remaining);
      const dropped = entries.length - accepted.length;

      for (const entry of accepted) {
        session.attemptedEntries.push({ ...entry, attemptedAt: now });
      }

      // Warn once when the cap is first hit (don't spam on subsequent calls that find it already full).
      if (dropped > 0 && !wasAtCap) {
        strapi.log.warn(
          `[localazy] attemptedEntries cap (${ATTEMPTED_ENTRIES_CAP}) reached for session ${sessionId}; ${dropped} record(s) dropped.`
        );
      }

      await this.saveActivityLogs(logs);
    });
  },

  async finishSession(sessionId: string, status: 'completed' | 'failed', summary: string): Promise<void> {
    return withLock(async () => {
      const logs = await this.getActivityLogs();
      const session = logs.sessions.find((s) => s.id === sessionId);

      if (!session) {
        return;
      }

      session.status = status;
      session.finishedAt = Date.now();
      session.summary = summary;
      await this.saveActivityLogs(logs);
    });
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

  async getAllSessionsWithEntries(): Promise<ActivityLogSession[]> {
    const logs = await this.getActivityLogs();
    return logs.sessions;
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
