import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import type { PanelComponent } from '@strapi/content-manager/strapi-admin';
import { Typography, Toggle } from '@strapi/design-system';
import EntryExclusionService from '../modules/entry-exclusion/services/entry-exclusion-service';

import '../i18n';

const LocalazyPanel: PanelComponent = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const [isExcluded, setIsExcluded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contentType, setContentType] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);

  // Extract content type and document ID from URL
  useEffect(() => {
    const extractEntryInfo = () => {
      // URL format: /admin/content-manager/collection-types/{contentType}/{documentId}
      const pathParts = location.pathname.split('/');
      const contentManagerIndex = pathParts.indexOf('content-manager');

      if (contentManagerIndex !== -1 && pathParts[contentManagerIndex + 1] === 'collection-types') {
        const extractedContentType = pathParts[contentManagerIndex + 2];
        const extractedDocumentId = pathParts[contentManagerIndex + 3];

        if (extractedContentType && extractedDocumentId) {
          setContentType(extractedContentType);
          setDocumentId(extractedDocumentId);
        }
      }
    };

    extractEntryInfo();
  }, [location.pathname]);

  // Load the current exclusion state when we have the entry information
  useEffect(() => {
    const loadExclusionState = async () => {
      if (!contentType || !documentId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const exclusionState = await EntryExclusionService.getEntryExclusion(contentType, documentId);
        setIsExcluded(exclusionState);
      } catch (error) {
        console.error('Failed to load entry exclusion state:', error);
        setIsExcluded(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadExclusionState();
  }, [contentType, documentId]);

  // Handle toggle change
  const handleToggleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    const value = checked;

    if (!contentType || !documentId) {
      console.warn('Cannot save exclusion state: missing content type or document ID');
      return;
    }

    try {
      await EntryExclusionService.setEntryExclusion(contentType, documentId, value);
      setIsExcluded(value);
    } catch (error) {
      console.error('Failed to save entry exclusion state:', error);
      // Revert the toggle if save failed
      setIsExcluded(!value);
    }
  };

  return {
    title: 'Localazy',
    content: (
      <div>
        <div style={{ marginBottom: '8px' }}>
          <Typography>{t('plugin_settings.exclude_from_translation')}</Typography>
        </div>
        <Toggle
          checked={isExcluded}
          onLabel='True'
          offLabel='False'
          disabled={isLoading || !contentType || !documentId}
          onChange={handleToggleChange}
        />
      </div>
    ),
  };
};

export default LocalazyPanel;
