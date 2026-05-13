export const KEY = 'activity-logs';

export type ActivityLogEntry = {
  message: string;
  timestamp: number;
  data?: any;
};

export type AttemptedEntryStatus = 'success' | 'failed';

export type AttemptedEntry = {
  uid: string;
  documentId: string;
  locale: string;
  status: AttemptedEntryStatus;
  errorMessage?: string;
  attemptedAt: number;
};

export type ActivityLogSession = {
  id: string;
  eventType: 'upload' | 'download' | 'webhook';
  status: 'in-progress' | 'completed' | 'failed';
  startedAt: number;
  finishedAt?: number;
  initiatedBy: string;
  summary: string;
  entries: ActivityLogEntry[];
  attemptedEntries?: AttemptedEntry[];
};

export type ActivityLogs = {
  sessions: ActivityLogSession[];
};

export const emptyActivityLogs: ActivityLogs = {
  sessions: [],
};
