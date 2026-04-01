import React from 'react';
import { Typography } from '@strapi/design-system';
import { useTranslation } from 'react-i18next';
import { getStatusColor } from '../utils/format-utils';
import HighlightMatch from './HighlightMatch';

const StatusLabel: React.FC<{ status: string; searchQuery?: string }> = ({ status, searchQuery }) => {
  const { t } = useTranslation();

  const label =
    status === 'in-progress'
      ? t('activity_logs.status_in_progress')
      : status === 'completed'
        ? t('activity_logs.status_completed')
        : t('activity_logs.status_failed');

  return (
    <Typography variant='omega' textColor={getStatusColor(status)}>
      {searchQuery ? <HighlightMatch text={label} query={searchQuery} /> : label}
    </Typography>
  );
};

export default StatusLabel;
