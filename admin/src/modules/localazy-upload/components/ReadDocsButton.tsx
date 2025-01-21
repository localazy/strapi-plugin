import { Button } from '@strapi/design-system';
import { useTranslation } from 'react-i18next';

const ReadDocsButton: React.FC = () => {
  const { t } = useTranslation();

  const link = 'https://localazy.com/docs/strapi';
  const onReadDocumentationClick = () => {
    window.open(link, '_blank');
  };

  return (
    <Button variant='tertiary' onClick={onReadDocumentationClick}>
      {t('upload.read_documentation')}
    </Button>
  );
};

export { ReadDocsButton };
