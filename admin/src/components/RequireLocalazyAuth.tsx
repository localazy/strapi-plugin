import React from 'react';
import { useLocalazyIdentity } from '../state/localazy-identity';
import { PLUGIN_ID } from '../pluginId';
import { Box, Typography } from '@strapi/design-system';
import { Layouts } from '@strapi/strapi/admin';
import { useTranslation } from 'react-i18next';

import '../i18n';

const RequireLocalazyAuth = ({ children }: { children: React.ReactElement }) => {
  const { isLoggedIn, isFetchingIdentity } = useLocalazyIdentity();
  const { t } = useTranslation();

  if (!isFetchingIdentity && !isLoggedIn) {
    return (
      <>
        <Layouts.Header title={t('common.localazy_plugin')} subtitle={t('common.localazy_plugin_description')} as='h2' />
        <Box marginLeft={10} marginRight={10} background='neutral0' padding={7} hasRadius shadow='tableShadow'>
          <Typography variant='epsilon' textColor='neutral600'>
            {t('login.you_have_to_own_account_for_the_plugin_to_work_properly')}
          </Typography>
          <Box paddingTop={4}>
            <Typography variant='omega'>
              <a href={`/admin/plugins/${PLUGIN_ID}/`}>
                {t('login.login_with_localazy')}
              </a>
            </Typography>
          </Box>
        </Box>
      </>
    );
  }

  return children;
};

export default RequireLocalazyAuth;
