import React, { useState, useEffect } from 'react';
import { Box, Typography, Pagination, PreviousLink, NextLink, PageLink, Dots } from '@strapi/design-system';
import { formatDate, formatDuration } from '../utils/format-utils';
import SortableHeader from './SortableHeader';
import HighlightMatch from './HighlightMatch';
import StatusLabel from './StatusLabel';
import type { SessionItem, SortKey, SortDirection } from '../models/activity-logs';

const DEFAULT_SORT: { key: SortKey; direction: SortDirection } = { key: 'startedAt', direction: 'desc' };
const PAGE_SIZE = 20;

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
                <StatusLabel status={session.status} searchQuery={searchQuery} />
              </td>
              <td style={{ padding: '12px 16px' }}>
                <Typography variant='omega'>
                  <HighlightMatch text={formatDate(session.startedAt)} query={searchQuery} />
                </Typography>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <Typography variant='omega'>{formatDuration(session.startedAt, session.finishedAt)}</Typography>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <Typography variant='omega'>
                  <HighlightMatch text={session.initiatedBy} query={searchQuery} />
                </Typography>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <Typography variant='omega'>
                  <HighlightMatch text={session.summary || '-'} query={searchQuery} />
                </Typography>
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

export default SessionsTable;
