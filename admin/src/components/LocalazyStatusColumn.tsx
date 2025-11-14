import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EntryExclusionService from '../modules/entry-exclusion/services/entry-exclusion-service';
import '../i18n';

// TODO: define props interface
const LocalazyStatusColumn = ({ data, model }: any) => {
  const { t } = useTranslation();

  const [isExcluded, setIsExcluded] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (!data?.documentId || !model) {
        setIsLoading(false);
        return;
      }

      try {
        const excluded = await EntryExclusionService.getEntryExclusion(model, data.documentId);
        setIsExcluded(excluded);
      } catch (error) {
        console.error('Error checking Localazy status:', error);
        setIsExcluded(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [data?.documentId, model]);

  if (isLoading) {
    return <span style={{ color: '#666', fontSize: '12px' }}>...</span>;
  }

  if (isExcluded === null) {
    return <span style={{ color: '#666', fontSize: '12px' }}>-</span>;
  }

  return (
    <span
      style={{
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        backgroundColor: isExcluded ? '#ff6b6b' : '#51cf66',
        color: 'white',
      }}
    >
      {isExcluded ? t('plugin_settings.status_excluded') : t('plugin_settings.status_included')}
    </span>
  );
};

export default LocalazyStatusColumn;
