export type SessionItem = {
  id: string;
  eventType: 'upload' | 'download' | 'webhook';
  status: 'in-progress' | 'completed' | 'failed';
  startedAt: number;
  finishedAt?: number;
  initiatedBy: string;
  summary: string;
};

export type LogEntry = {
  message: string;
  timestamp: number;
  data?: any;
};

export type SessionDetail = SessionItem & {
  entries: LogEntry[];
};

export type SortKey = 'status' | 'startedAt' | 'duration' | 'initiatedBy' | 'summary';
export type SortDirection = 'asc' | 'desc';
