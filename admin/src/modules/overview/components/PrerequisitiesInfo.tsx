import React from 'react';
import { Box, Typography } from '@strapi/design-system';
import { useTranslation } from 'react-i18next';

const PrerequisitiesInfo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant='omega'>{t('overview.transfer_setup_message_a')}</Typography>
      <Typography variant='omega' fontWeight='semiBold'>
        {t('overview.transfer_setup_message_b')}
      </Typography>
    </Box>
  );
};

export default PrerequisitiesInfo;
