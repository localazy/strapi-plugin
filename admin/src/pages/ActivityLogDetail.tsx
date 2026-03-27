import React, { useState, useEffect } from 'react';
import { Layouts } from '@strapi/strapi/admin';
import { useTranslation } from 'react-i18next';
import { Box, Button, Typography, Flex, Field, Divider } from '@strapi/design-system';
import { ArrowLeft } from '@strapi/icons';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../modules/@common/components/PluginPageLoader';
import ActivityLogsService from '../modules/activity-logs/services/activity-logs-service';
import { PLUGIN_ID } from '../pluginId';

export type ActivityLogDetailProps = {
  title: string;
  subtitle: string;
};

type LogEntry = {
  message: string;
  timestamp: number;
  data?: any;
};

type SessionDetail = {
  id: string;
  eventType: 'upload' | 'download' | 'webhook';
  status: 'in-progress' | 'completed' | 'failed';
  startedAt: number;
  finishedAt?: number;
  initiatedBy: string;
  summary: string;
  entries: LogEntry[];
};

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  });
};

const formatDuration = (start: number, end?: number): string => {
  if (!end) return '-';
  const diff = end - start;
  if (diff < 1000) return `${diff}ms`;
  if (diff < 60000) return `${Math.round(diff / 1000)}s`;
  return `${Math.round(diff / 60000)}m ${Math.round((diff % 60000) / 1000)}s`;
};

const getStatusColor = (status: string): string => {
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

const ActivityLogDetail: React.FC<ActivityLogDetailProps> = (props) => {
  const { t } = useTranslation();
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;
      setIsLoading(true);
      try {
        const data = await ActivityLogsService.getSession(sessionId);
        setSession(data);
      } catch (e) {
        console.error('Failed to fetch session detail:', e);
      }
      setIsLoading(false);
    };
    fetchSession();
  }, [sessionId]);

  const filteredEntries = (session?.entries || []).filter((entry) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return entry.message.toLowerCase().includes(query) || formatTime(entry.timestamp).toLowerCase().includes(query);
  });

  const onBackClick = () => {
    navigate(`/plugins/${PLUGIN_ID}/activity-logs`);
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'in-progress':
        return t('activity_logs.status_in_progress');
      case 'completed':
        return t('activity_logs.status_completed');
      case 'failed':
        return t('activity_logs.status_failed');
      default:
        return status;
    }
  };

  return (
    <>
      <Layouts.Header
        title={props.title}
        subtitle={props.subtitle}
        navigationAction={
          <Button variant='ghost' startIcon={<ArrowLeft />} onClick={onBackClick}>
            {t('activity_logs.back_to_list')}
          </Button>
        }
        as='h2'
      />
      {isLoading && <Loader />}
      {!isLoading && !session && (
        <Box paddingRight={10} paddingLeft={10}>
          <Typography variant='omega'>{t('activity_logs.no_sessions')}</Typography>
        </Box>
      )}
      {!isLoading && session && (
        <Box paddingRight={10} paddingLeft={10}>
          <Box
            background='neutral0'
            paddingTop={6}
            paddingRight={7}
            paddingBottom={6}
            paddingLeft={7}
            hasRadius
            shadow='tableShadow'
          >
            <Flex gap={6} wrap='wrap'>
              <Box>
                <Typography variant='sigma' textColor='neutral600'>
                  {t('activity_logs.status')}
                </Typography>
                <br />
                <Typography variant='omega' textColor={getStatusColor(session.status)}>
                  {getStatusLabel(session.status)}
                </Typography>
              </Box>
              <Box>
                <Typography variant='sigma' textColor='neutral600'>
                  {t('activity_logs.started_at')}
                </Typography>
                <br />
                <Typography variant='omega'>{formatDate(session.startedAt)}</Typography>
              </Box>
              <Box>
                <Typography variant='sigma' textColor='neutral600'>
                  {t('activity_logs.duration')}
                </Typography>
                <br />
                <Typography variant='omega'>{formatDuration(session.startedAt, session.finishedAt)}</Typography>
              </Box>
              <Box>
                <Typography variant='sigma' textColor='neutral600'>
                  {t('activity_logs.initiated_by')}
                </Typography>
                <br />
                <Typography variant='omega'>{session.initiatedBy}</Typography>
              </Box>
              <Box>
                <Typography variant='sigma' textColor='neutral600'>
                  {t('activity_logs.entries_count')}
                </Typography>
                <br />
                <Typography variant='omega'>{session.entries.length}</Typography>
              </Box>
            </Flex>
            {session.summary && (
              <Box marginTop={4}>
                <Typography variant='sigma' textColor='neutral600'>
                  {t('activity_logs.summary')}
                </Typography>
                <br />
                <Typography variant='omega'>{session.summary}</Typography>
              </Box>
            )}
          </Box>

          <Box marginTop={4}>
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
                    placeholder={t('activity_logs.search_entries_placeholder')}
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  />
                </Field.Root>
              </Box>
              <Divider />
              {filteredEntries.length === 0 && (
                <Box padding={4}>
                  <Typography variant='omega' textColor='neutral600'>
                    {t('activity_logs.no_entries')}
                  </Typography>
                </Box>
              )}
              {filteredEntries.map((entry, index) => (
                <Box
                  key={index}
                  paddingTop={3}
                  paddingBottom={3}
                  paddingLeft={4}
                  paddingRight={4}
                  style={{
                    borderBottom: index < filteredEntries.length - 1 ? '1px solid #eaeaef' : 'none',
                    fontFamily: 'monospace',
                  }}
                >
                  <Flex gap={3}>
                    <Typography
                      variant='pi'
                      textColor='neutral500'
                      style={{ whiteSpace: 'nowrap', fontFamily: 'monospace' }}
                    >
                      {formatTime(entry.timestamp)}
                    </Typography>
                    <Typography variant='omega' style={{ fontFamily: 'monospace' }}>
                      {entry.message}
                    </Typography>
                  </Flex>
                  {entry.data && (
                    <Box marginTop={2} marginLeft={6}>
                      <Typography
                        variant='pi'
                        textColor='neutral500'
                        style={{
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                        }}
                      >
                        {JSON.stringify(entry.data, null, 2)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ActivityLogDetail;
