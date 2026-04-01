export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  });
};

export const formatDuration = (start: number, end?: number): string => {
  if (!end) return '-';
  const diff = end - start;
  if (diff < 1000) return `${diff}ms`;
  if (diff < 60000) return `${Math.round(diff / 1000)}s`;
  return `${Math.round(diff / 60000)}m ${Math.round((diff % 60000) / 1000)}s`;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'success600';
    case 'failed':
      return 'danger600';
    case 'in-progress':
      return 'warning600';
    default:
      return 'neutral600';
  }
};
