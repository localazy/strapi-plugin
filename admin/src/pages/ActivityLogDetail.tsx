import React, { useState, useEffect } from 'react';
import { Layouts } from '@strapi/strapi/admin';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Field, Divider, Flex, Link } from '@strapi/design-system';
import { ArrowLeft } from '@strapi/icons';
import { useParams, NavLink } from 'react-router-dom';
import Loader from '../modules/@common/components/PluginPageLoader';
import ActivityLogsService from '../modules/activity-logs/services/activity-logs-service';
import { formatTime } from '../modules/activity-logs/utils/format-utils';
import SessionMetadata from '../modules/activity-logs/components/SessionMetadata';
import HighlightMatch from '../modules/activity-logs/components/HighlightMatch';
import { PLUGIN_ID } from '../pluginId';
import useDebouncedSearch from '../modules/activity-logs/hooks/use-debounced-search';
import type { SessionDetail } from '../modules/activity-logs/models/activity-logs';

export type ActivityLogDetailProps = {
  title: string;
  subtitle: string;
};

const ActivityLogDetail: React.FC<ActivityLogDetailProps> = (props) => {
  const { t } = useTranslation();
  const { sessionId } = useParams<{ sessionId: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<SessionDetail | null>(null);
  const { searchInput, searchQuery, onSearchChange } = useDebouncedSearch();

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
    void fetchSession();
  }, [sessionId]);

  const filteredEntries = (session?.entries || []).filter((entry) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return entry.message.toLowerCase().includes(query) || formatTime(entry.timestamp).toLowerCase().includes(query);
  });

  return (
    <>
      <Layouts.Header
        title={props.title}
        subtitle={props.subtitle}
        navigationAction={
          <Link tag={NavLink} to={`/plugins/${PLUGIN_ID}/activity-logs`} startIcon={<ArrowLeft />}>
            {t('activity_logs.back_to_list')}
          </Link>
        }
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
            <SessionMetadata session={session} showEntryCount={session.entries.length} />
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
                    value={searchInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
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
                      <HighlightMatch text={formatTime(entry.timestamp)} query={searchQuery} />
                    </Typography>
                    <Typography variant='omega' style={{ fontFamily: 'monospace' }}>
                      <HighlightMatch text={entry.message} query={searchQuery} />
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
