import React from 'react';
import { Box, Flex, Typography } from '@strapi/design-system';
import { useTranslation } from 'react-i18next';
import { formatDate, formatDuration } from '../utils/format-utils';
import StatusLabel from './StatusLabel';
import type { SessionItem } from '../models/activity-logs';

const SessionMetadata: React.FC<{ session: SessionItem; showEntryCount?: number }> = ({ session, showEntryCount }) => {
  const { t } = useTranslation();

  return (
    <Flex gap={6} wrap='wrap'>
      <Box>
        <Typography variant='sigma' textColor='neutral600'>
          {t('activity_logs.status')}
        </Typography>
        <br />
        <StatusLabel status={session.status} />
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
      {showEntryCount !== undefined && (
        <Box>
          <Typography variant='sigma' textColor='neutral600'>
            {t('activity_logs.entries_count')}
          </Typography>
          <br />
          <Typography variant='omega'>{showEntryCount}</Typography>
        </Box>
      )}
    </Flex>
  );
};

export default SessionMetadata;
