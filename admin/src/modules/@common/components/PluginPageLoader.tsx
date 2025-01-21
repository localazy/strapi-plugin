import { Flex } from '@strapi/design-system';
import { Loader } from '@strapi/design-system';
import { useTranslation } from 'react-i18next';

function PluginPageLoader() {
  const { t } = useTranslation();

  return (
    <Flex marginTop={10} alignItems='center' justifyContent='center'>
      <Loader>{t('common.loading_content')}</Loader>
    </Flex>
  );
}

export default PluginPageLoader;
