export const KEY = 'activity-logs';

export type ActivityLogEntry = {
  message: string;
  timestamp: number;
  data?: any;
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
};

export type ActivityLogs = {
  sessions: ActivityLogSession[];
};

export const emptyActivityLogs: ActivityLogs = {
  sessions: [],
};
