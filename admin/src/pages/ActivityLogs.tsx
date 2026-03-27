import React, { useState, useEffect } from 'react';
import { Layouts } from '@strapi/strapi/admin';
import { useTranslation } from 'react-i18next';
import { Box, Button, Typography, Tabs, Dialog, Alert, Field } from '@strapi/design-system';
import { Trash, CaretUp, CaretDown } from '@strapi/icons';
import { useNavigate } from 'react-router-dom';
import Loader from '../modules/@common/components/PluginPageLoader';
import ActivityLogsService from '../modules/activity-logs/services/activity-logs-service';
import { formatDate, formatDuration, getStatusColor } from '../modules/activity-logs/utils/format-utils';
import PluginSettingsService from '../modules/plugin-settings/services/plugin-settings-service';
import { PLUGIN_ID } from '../pluginId';
import { PLUGIN_ROUTES } from '../modules/@common/utils/redirect-to-plugin-route';

export type ActivityLogsProps = {
  title: string;
  subtitle: string;
};

type SessionItem = {
  id: string;
  eventType: 'upload' | 'download' | 'webhook';
  status: 'in-progress' | 'completed' | 'failed';
  startedAt: number;
  finishedAt?: number;
  initiatedBy: string;
  summary: string;
};

type SortKey = 'status' | 'startedAt' | 'duration' | 'initiatedBy' | 'summary';
type SortDirection = 'asc' | 'desc';

const getDuration = (session: SessionItem): number => {
  if (!session.finishedAt) return Infinity;
  return session.finishedAt - session.startedAt;
};

const compareSessions = (a: SessionItem, b: SessionItem, sortKey: SortKey, direction: SortDirection): number => {
  let cmp = 0;
  switch (sortKey) {
    case 'status':
      cmp = a.status.localeCompare(b.status);
      break;
    case 'startedAt':
      cmp = a.startedAt - b.startedAt;
      break;
    case 'duration':
      cmp = getDuration(a) - getDuration(b);
      break;
    case 'initiatedBy':
      cmp = a.initiatedBy.localeCompare(b.initiatedBy);
      break;
    case 'summary':
      cmp = (a.summary || '').localeCompare(b.summary || '');
      break;
  }
  return direction === 'asc' ? cmp : -cmp;
};

const SortableHeader: React.FC<{
  label: string;
  sortKey: SortKey;
  activeSortKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
}> = ({ label, sortKey, activeSortKey, direction, onSort }) => {
  const isActive = sortKey === activeSortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      style={{
        textAlign: 'left',
        padding: '12px 16px',
        borderBottom: '1px solid #eaeaef',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <Box display='flex' alignItems='center' gap={1}>
        <Typography variant='sigma' textColor={isActive ? 'primary600' : 'neutral600'}>
          {label}
        </Typography>
        {isActive && (direction === 'asc' ? <CaretUp width={8} height={8} /> : <CaretDown width={8} height={8} />)}
      </Box>
    </th>
  );
};

const SessionsTable: React.FC<{
  sessions: SessionItem[];
  searchQuery: string;
  onSessionClick: (sessionId: string) => void;
  t: (key: string) => string;
}> = ({ sessions, searchQuery, onSessionClick, t }) => {
  const SORT_STORAGE_KEY = 'localazy-activity-logs-sort';

  const getStoredSort = (): { key: SortKey; direction: SortDirection } => {
    try {
      const stored = localStorage.getItem(SORT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.key && parsed.direction) return parsed;
      }
    } catch { /* ignore */ }
    return { key: 'startedAt', direction: 'desc' };
  };

  const storedSort = getStoredSort();
  const [sortKey, setSortKey] = useState<SortKey>(storedSort.key);
  const [sortDirection, setSortDirection] = useState<SortDirection>(storedSort.direction);

  const onSort = (key: SortKey) => {
    const newDirection = key === sortKey ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    setSortKey(key);
    setSortDirection(newDirection);
    localStorage.setItem(SORT_STORAGE_KEY, JSON.stringify({ key, direction: newDirection }));
  };

  const filteredSessions = sessions
    .filter((session) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        session.summary.toLowerCase().includes(query) ||
        session.initiatedBy.toLowerCase().includes(query) ||
        session.status.toLowerCase().includes(query) ||
        formatDate(session.startedAt).toLowerCase().includes(query)
      );
    })
    .sort((a, b) => compareSessions(a, b, sortKey, sortDirection));

  if (filteredSessions.length === 0) {
    return (
      <Box padding={4}>
        <Typography variant='omega' textColor='neutral600'>
          {t('activity_logs.no_sessions')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <SortableHeader label={t('activity_logs.status')} sortKey='status' activeSortKey={sortKey} direction={sortDirection} onSort={onSort} />
            <SortableHeader label={t('activity_logs.started_at')} sortKey='startedAt' activeSortKey={sortKey} direction={sortDirection} onSort={onSort} />
            <SortableHeader label={t('activity_logs.duration')} sortKey='duration' activeSortKey={sortKey} direction={sortDirection} onSort={onSort} />
            <SortableHeader label={t('activity_logs.initiated_by')} sortKey='initiatedBy' activeSortKey={sortKey} direction={sortDirection} onSort={onSort} />
            <SortableHeader label={t('activity_logs.summary')} sortKey='summary' activeSortKey={sortKey} direction={sortDirection} onSort={onSort} />
          </tr>
        </thead>
        <tbody>
          {filteredSessions.map((session) => (
            <tr
              key={session.id}
              onClick={() => onSessionClick(session.id)}
              style={{ cursor: 'pointer', borderBottom: '1px solid #eaeaef' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#f6f6f9';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent';
              }}
            >
              <td style={{ padding: '12px 16px' }}>
                <Typography variant='omega' textColor={getStatusColor(session.status)}>
                  {session.status === 'in-progress'
                    ? t('activity_logs.status_in_progress')
                    : session.status === 'completed'
                      ? t('activity_logs.status_completed')
                      : t('activity_logs.status_failed')}
                </Typography>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <Typography variant='omega'>{formatDate(session.startedAt)}</Typography>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <Typography variant='omega'>{formatDuration(session.startedAt, session.finishedAt)}</Typography>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <Typography variant='omega'>{session.initiatedBy}</Typography>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <Typography variant='omega'>{session.summary || '-'}</Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

const ActivityLogs: React.FC<ActivityLogsProps> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);

  const fetchSessions = async (type?: string) => {
    setIsLoading(true);
    try {
      const data = await ActivityLogsService.getSessions(type);
      setSessions(data || []);
    } catch (e) {
      console.error('Failed to fetch activity logs:', e);
      setSessions([]);
    }
    setIsLoading(false);
  };

  const onTabChange = (value: string) => {
    setActiveTab(value);
    setSearchQuery('');
    fetchSessions(value);
  };

  const onSessionClick = (sessionId: string) => {
    navigate(`/plugins/${PLUGIN_ID}/activity-logs/${sessionId}`);
  };

  const onClearLogs = async () => {
    try {
      await ActivityLogsService.clearSessions();
      setSessions([]);
      setClearSuccess(true);
      setShowClearConfirm(false);
      setTimeout(() => setClearSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to clear activity logs:', e);
    }
  };

  useEffect(() => {
    fetchSessions('upload');
    PluginSettingsService.updatePluginSettings({ defaultRoute: PLUGIN_ROUTES.ACTIVITY_LOGS });
  }, []);

  return (
    <>
      <Layouts.Header
        title={props.title}
        subtitle={props.subtitle}
        primaryAction={
          <Button variant='danger-light' startIcon={<Trash />} onClick={() => setShowClearConfirm(true)}>
            {t('activity_logs.clear_logs')}
          </Button>
        }
        as='h2'
      />
      {isLoading && <Loader />}
      {!isLoading && (
        <Box paddingRight={10} paddingLeft={10}>
          {clearSuccess && (
            <Box marginBottom={4}>
              <Alert onClose={() => setClearSuccess(false)} closeLabel={t('activity_logs.close')} variant='success'>
                {t('activity_logs.clear_logs_success')}
              </Alert>
            </Box>
          )}
          <Box
            background='neutral0'
            paddingTop={6}
            paddingRight={7}
            paddingBottom={6}
            paddingLeft={7}
            hasRadius
            shadow='tableShadow'
          >
            <Box marginBottom={4}>
              <Field.Root>
                <Field.Input
                  placeholder={t('activity_logs.search_placeholder')}
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
              </Field.Root>
            </Box>
            <Tabs.Root value={activeTab} onValueChange={onTabChange}>
              <Tabs.List>
                <Tabs.Trigger value='upload'>{t('activity_logs.tab_upload')}</Tabs.Trigger>
                <Tabs.Trigger value='download'>{t('activity_logs.tab_download')}</Tabs.Trigger>
                <Tabs.Trigger value='webhook'>{t('activity_logs.tab_webhooks')}</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value='upload'>
                <SessionsTable sessions={sessions} searchQuery={searchQuery} onSessionClick={onSessionClick} t={t} />
              </Tabs.Content>
              <Tabs.Content value='download'>
                <SessionsTable sessions={sessions} searchQuery={searchQuery} onSessionClick={onSessionClick} t={t} />
              </Tabs.Content>
              <Tabs.Content value='webhook'>
                <SessionsTable sessions={sessions} searchQuery={searchQuery} onSessionClick={onSessionClick} t={t} />
              </Tabs.Content>
            </Tabs.Root>
          </Box>
        </Box>
      )}
      <Dialog.Root open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <Dialog.Content>
          <Dialog.Header>{t('activity_logs.clear_logs')}</Dialog.Header>
          <Dialog.Body>
            <Typography variant='omega'>{t('activity_logs.clear_logs_confirm')}</Typography>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Cancel>
              <Button variant='tertiary'>{t('activity_logs.close')}</Button>
            </Dialog.Cancel>
            <Dialog.Action>
              <Button variant='danger-light' onClick={onClearLogs}>
                {t('activity_logs.clear_logs')}
              </Button>
            </Dialog.Action>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default ActivityLogs;
