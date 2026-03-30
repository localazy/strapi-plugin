import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Layouts } from '@strapi/strapi/admin';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Flex,
  Button,
  Typography,
  Tabs,
  Dialog,
  Alert,
  Field,
  DatePicker,
  Pagination,
  PreviousLink,
  NextLink,
  PageLink,
  Dots,
} from '@strapi/design-system';
import { Trash, Download, CaretUp, CaretDown, Information } from '@strapi/icons';
import { useNavigate } from 'react-router-dom';
import Loader from '../modules/@common/components/PluginPageLoader';
import ActivityLogsService from '../modules/activity-logs/services/activity-logs-service';
import { exportLogsAsJson } from '../modules/activity-logs/utils/export-logs';
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
      <Flex alignItems='center' gap={1}>
        <Typography variant='sigma' textColor={isActive ? 'primary600' : 'neutral600'}>
          {label}
        </Typography>
        <span style={{ width: 8, display: 'inline-flex', flexShrink: 0 }}>
          {isActive && (direction === 'asc' ? <CaretUp width={8} height={8} /> : <CaretDown width={8} height={8} />)}
        </span>
      </Flex>
    </th>
  );
};

const DEFAULT_SORT: { key: SortKey; direction: SortDirection } = { key: 'startedAt', direction: 'desc' };
const PAGE_SIZE = 20;

const SessionsTable: React.FC<{
  sessions: SessionItem[];
  searchQuery: string;
  dateFrom?: Date;
  dateTo?: Date;
  eventType: string;
  sortPreferences: Record<string, { key: string; direction: string }>;
  onSortChange: (eventType: string, key: SortKey, direction: SortDirection) => void;
  onSessionClick: (sessionId: string) => void;
  t: (key: string) => string;
}> = ({ sessions, searchQuery, dateFrom, dateTo, eventType, sortPreferences, onSortChange, onSessionClick, t }) => {
  const stored = sortPreferences[eventType];
  const [sortKey, setSortKey] = useState<SortKey>((stored?.key as SortKey) || DEFAULT_SORT.key);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    (stored?.direction as SortDirection) || DEFAULT_SORT.direction
  );

  const [page, setPage] = useState(1);

  useEffect(() => {
    const pref = sortPreferences[eventType];
    if (pref?.key) setSortKey(pref.key as SortKey);
    if (pref?.direction) setSortDirection(pref.direction as SortDirection);
  }, [eventType, sortPreferences]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, dateFrom, dateTo, eventType]);

  const onSort = (key: SortKey) => {
    const newDirection = key === sortKey ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    setSortKey(key);
    setSortDirection(newDirection);
    onSortChange(eventType, key, newDirection);
    setPage(1);
  };

  const filteredSessions = sessions
    .filter((session) => {
      if (dateFrom) {
        // dateFrom is stored as UTC midnight; convert to local start-of-day for comparison
        const startOfDay = new Date(dateFrom.getUTCFullYear(), dateFrom.getUTCMonth(), dateFrom.getUTCDate()).getTime();
        if (session.startedAt < startOfDay) return false;
      }
      if (dateTo) {
        const endOfDay = new Date(
          dateTo.getUTCFullYear(),
          dateTo.getUTCMonth(),
          dateTo.getUTCDate(),
          23,
          59,
          59,
          999
        ).getTime();
        if (session.startedAt > endOfDay) return false;
      }
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

  const totalCount = filteredSessions.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedSessions = filteredSessions.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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
            <SortableHeader
              label={t('activity_logs.status')}
              sortKey='status'
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              label={t('activity_logs.started_at')}
              sortKey='startedAt'
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              label={t('activity_logs.duration')}
              sortKey='duration'
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              label={t('activity_logs.initiated_by')}
              sortKey='initiatedBy'
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              label={t('activity_logs.summary')}
              sortKey='summary'
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={onSort}
            />
          </tr>
        </thead>
        <tbody>
          {paginatedSessions.map((session) => (
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
      <Box paddingTop={4}>
        <Pagination activePage={safePage} pageCount={totalPages}>
          <PreviousLink onClick={() => setPage(Math.max(1, safePage - 1))} />
          {(() => {
            const pages: React.ReactNode[] = [];
            const WINDOW = 2;

            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) {
                pages.push(<PageLink key={i} number={i} onClick={() => setPage(i)} />);
              }
            } else {
              pages.push(<PageLink key={1} number={1} onClick={() => setPage(1)} />);

              if (safePage > 1 + WINDOW + 1) {
                pages.push(<Dots key='dots-start' />);
              }

              const start = Math.max(2, safePage - WINDOW);
              const end = Math.min(totalPages - 1, safePage + WINDOW);
              for (let i = start; i <= end; i++) {
                pages.push(<PageLink key={i} number={i} onClick={() => setPage(i)} />);
              }

              if (safePage < totalPages - WINDOW - 1) {
                pages.push(<Dots key='dots-end' />);
              }

              pages.push(<PageLink key={totalPages} number={totalPages} onClick={() => setPage(totalPages)} />);
            }

            return pages;
          })()}
          <NextLink onClick={() => setPage(Math.min(totalPages, safePage + 1))} />
        </Pagination>
      </Box>
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
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);
  const [sortPreferences, setSortPreferences] = useState<Record<string, { key: string; direction: string }>>({});
  const saveSortTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSaveSortPrefs = useCallback((prefs: Record<string, { key: string; direction: string }>) => {
    if (saveSortTimerRef.current) clearTimeout(saveSortTimerRef.current);
    saveSortTimerRef.current = setTimeout(() => {
      PluginSettingsService.updatePluginSettings({ activityLogsSort: prefs });
    }, 1000);
  }, []);

  const onSortChange = (eventType: string, key: SortKey, direction: SortDirection) => {
    const updated = { ...sortPreferences, [eventType]: { key, direction } };
    setSortPreferences(updated);
    debouncedSaveSortPrefs(updated);
  };

  const fetchSessions = async (type?: string, showLoader = true) => {
    if (showLoader) setIsLoading(true);
    try {
      const data = await ActivityLogsService.getSessions(type);
      setSessions(data || []);
    } catch (e) {
      console.error('Failed to fetch activity logs:', e);
      setSessions([]);
    }
    if (showLoader) setIsLoading(false);
  };

  const onTabChange = (value: string) => {
    setActiveTab(value);
    fetchSessions(value, false);
  };

  const onSessionClick = (sessionId: string) => {
    navigate(`/plugins/${PLUGIN_ID}/activity-logs/${sessionId}`);
  };

  const onExportLogs = async () => {
    try {
      await exportLogsAsJson();
    } catch (e) {
      console.error('Failed to export activity logs:', e);
    }
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
    const init = async () => {
      try {
        const settings = await PluginSettingsService.getPluginSettings();
        if (settings?.activityLogsSort) {
          setSortPreferences(settings.activityLogsSort);
        }
      } catch {
        /* ignore */
      }
      fetchSessions('upload');
    };
    init();
    PluginSettingsService.updatePluginSettings({ defaultRoute: PLUGIN_ROUTES.ACTIVITY_LOGS });
  }, []);

  return (
    <>
      <Layouts.Header
        title={props.title}
        subtitle={props.subtitle}
        primaryAction={
          <Flex gap={2}>
            <Button variant='secondary' startIcon={<Download />} onClick={onExportLogs}>
              {t('activity_logs.export_logs')}
            </Button>
            <Button variant='danger-light' startIcon={<Trash />} onClick={() => setShowClearConfirm(true)}>
              {t('activity_logs.clear_logs')}
            </Button>
          </Flex>
        }
      />
      <Box paddingRight={10} paddingLeft={10} paddingBottom={4}>
        <Flex gap={2} alignItems='center'>
          <Information width={14} height={14} fill='neutral500' />
          <Typography variant='pi' textColor='neutral500'>
            {t('activity_logs.retention_info')}
          </Typography>
        </Flex>
      </Box>
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
            <Flex marginBottom={4} gap={3} wrap='wrap' alignItems='center'>
              <Box grow={1} basis='200px'>
                <Field.Root>
                  <Field.Input
                    placeholder={t('activity_logs.search_placeholder')}
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  />
                </Field.Root>
              </Box>
              <Box basis='160px'>
                <DatePicker
                  placeholder={t('activity_logs.date_from')}
                  value={dateFrom}
                  onChange={(date: Date | undefined) => {
                    if (!date) {
                      setDateFrom(undefined);
                      return;
                    }
                    // DatePicker onChange returns local Date, but value prop expects UTC midnight.
                    // Convert local year/month/day to a UTC midnight Date to keep the round-trip stable.
                    setDateFrom(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())));
                  }}
                  onClear={() => setDateFrom(undefined)}
                  clearLabel={t('activity_logs.clear')}
                  size='M'
                />
              </Box>
              <Box basis='160px'>
                <DatePicker
                  placeholder={t('activity_logs.date_to')}
                  value={dateTo}
                  onChange={(date: Date | undefined) => {
                    if (!date) {
                      setDateTo(undefined);
                      return;
                    }
                    setDateTo(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())));
                  }}
                  onClear={() => setDateTo(undefined)}
                  clearLabel={t('activity_logs.clear')}
                  size='M'
                />
              </Box>
            </Flex>
            <Tabs.Root value={activeTab} onValueChange={onTabChange}>
              <Tabs.List>
                <Tabs.Trigger value='upload'>{t('activity_logs.tab_upload')}</Tabs.Trigger>
                <Tabs.Trigger value='download'>{t('activity_logs.tab_download')}</Tabs.Trigger>
                <Tabs.Trigger value='webhook'>{t('activity_logs.tab_webhooks')}</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value='upload'>
                <SessionsTable
                  sessions={sessions}
                  searchQuery={searchQuery}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  eventType='upload'
                  sortPreferences={sortPreferences}
                  onSortChange={onSortChange}
                  onSessionClick={onSessionClick}
                  t={t}
                />
              </Tabs.Content>
              <Tabs.Content value='download'>
                <SessionsTable
                  sessions={sessions}
                  searchQuery={searchQuery}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  eventType='download'
                  sortPreferences={sortPreferences}
                  onSortChange={onSortChange}
                  onSessionClick={onSessionClick}
                  t={t}
                />
              </Tabs.Content>
              <Tabs.Content value='webhook'>
                <SessionsTable
                  sessions={sessions}
                  searchQuery={searchQuery}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  eventType='webhook'
                  sortPreferences={sortPreferences}
                  onSortChange={onSortChange}
                  onSessionClick={onSessionClick}
                  t={t}
                />
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
