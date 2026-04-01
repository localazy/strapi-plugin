import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Layouts } from '@strapi/strapi/admin';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Button, Typography, Tabs, Dialog, Alert, Field, DatePicker } from '@strapi/design-system';
import { Trash, Download, Information } from '@strapi/icons';
import { useNavigate } from 'react-router-dom';
import Loader from '../modules/@common/components/PluginPageLoader';
import ActivityLogsService from '../modules/activity-logs/services/activity-logs-service';
import { exportLogsAsJson } from '../modules/activity-logs/utils/export-logs';
import SessionsTable from '../modules/activity-logs/components/SessionsTable';
import PluginSettingsService from '../modules/plugin-settings/services/plugin-settings-service';
import { PLUGIN_ID } from '../pluginId';
import { PLUGIN_ROUTES } from '../modules/@common/utils/redirect-to-plugin-route';
import useDebouncedSearch from '../modules/activity-logs/hooks/use-debounced-search';
import type { SessionItem, SortKey, SortDirection } from '../modules/activity-logs/models/activity-logs';

export type ActivityLogsProps = {
  title: string;
  subtitle: string;
};

const ActivityLogs: React.FC<ActivityLogsProps> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [activeTab, setActiveTab] = useState('upload');
  const { searchInput, searchQuery, onSearchChange } = useDebouncedSearch();

  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);
  const [sortPreferences, setSortPreferences] = useState<Record<string, { key: string; direction: string }>>({});
  const saveSortTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSaveSortPrefs = useCallback((prefs: Record<string, { key: string; direction: string }>) => {
    if (saveSortTimerRef.current) clearTimeout(saveSortTimerRef.current);
    saveSortTimerRef.current = setTimeout(() => {
      void PluginSettingsService.updatePluginSettings({ activityLogsSort: prefs });
    }, 1000);
  }, []);

  const onSortChange = (eventType: string, key: SortKey, direction: SortDirection) => {
    const updated = { ...sortPreferences, [eventType]: { key, direction } };
    setSortPreferences(updated);
    debouncedSaveSortPrefs(updated);
  };

  const fetchSessions = async (type?: string, showLoader = true) => {
    if (showLoader) setIsLoading(true);
    try {
      const data = await ActivityLogsService.getSessions(type);
      setSessions(data || []);
    } catch (e) {
      console.error('Failed to fetch activity logs:', e);
      setSessions([]);
    }
    if (showLoader) setIsLoading(false);
  };

  const onTabChange = (value: string) => {
    setActiveTab(value);
    void fetchSessions(value, false);
  };

  const onSessionClick = (sessionId: string) => {
    navigate(`/plugins/${PLUGIN_ID}/activity-logs/${sessionId}`);
  };

  const onExportLogs = async () => {
    try {
      await exportLogsAsJson();
    } catch (e) {
      console.error('Failed to export activity logs:', e);
    }
  };

  const onClearLogs = async () => {
    try {
      await ActivityLogsService.clearSessions();
      setSessions([]);
      setClearSuccess(true);
      setShowClearConfirm(false);
      setTimeout(() => setClearSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to clear activity logs:', e);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const settings = await PluginSettingsService.getPluginSettings();
        if (settings?.activityLogsSort) {
          setSortPreferences(settings.activityLogsSort);
        }
      } catch {
        /* ignore */
      }
      void fetchSessions('upload');
    };
    void init();
    void PluginSettingsService.updatePluginSettings({ defaultRoute: PLUGIN_ROUTES.ACTIVITY_LOGS });
  }, []);

  return (
    <>
      <Layouts.Header
        title={props.title}
        subtitle={props.subtitle}
        primaryAction={
          <Flex gap={2}>
            <Button variant='secondary' startIcon={<Download />} onClick={onExportLogs}>
              {t('activity_logs.export_logs')}
            </Button>
            <Button variant='danger-light' startIcon={<Trash />} onClick={() => setShowClearConfirm(true)}>
              {t('activity_logs.clear_logs')}
            </Button>
          </Flex>
        }
      />
      <Box paddingRight={10} paddingLeft={10} paddingBottom={4}>
        <Flex gap={2} alignItems='center'>
          <Information width={14} height={14} fill='neutral500' />
          <Typography variant='pi' textColor='neutral500'>
            {t('activity_logs.retention_info')}
          </Typography>
        </Flex>
      </Box>
      {isLoading && <Loader />}
      {!isLoading && (
        <Box paddingRight={10} paddingLeft={10}>
          {clearSuccess && (
            <Box marginBottom={4}>
              <Alert onClose={() => setClearSuccess(false)} closeLabel={t('activity_logs.close')} variant='success'>
                {t('activity_logs.clear_logs_success')}
              </Alert>
            </Box>
          )}
          <Box
            background='neutral0'
            paddingTop={6}
            paddingRight={7}
            paddingBottom={6}
            paddingLeft={7}
            hasRadius
            shadow='tableShadow'
          >
            <Flex marginBottom={4} gap={3} wrap='wrap' alignItems='center'>
              <Box grow={1} basis='200px'>
                <Field.Root>
                  <Field.Input
                    placeholder={t('activity_logs.search_placeholder')}
                    value={searchInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
                  />
                </Field.Root>
              </Box>
              <Box basis='160px'>
                <DatePicker
                  placeholder={t('activity_logs.date_from')}
                  value={dateFrom}
                  onChange={(date: Date | undefined) => {
                    if (!date) {
                      setDateFrom(undefined);
                      return;
                    }
                    setDateFrom(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())));
                  }}
                  onClear={() => setDateFrom(undefined)}
                  clearLabel={t('activity_logs.clear')}
                  size='M'
                />
              </Box>
              <Box basis='160px'>
                <DatePicker
                  placeholder={t('activity_logs.date_to')}
                  value={dateTo}
                  onChange={(date: Date | undefined) => {
                    if (!date) {
                      setDateTo(undefined);
                      return;
                    }
                    setDateTo(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())));
                  }}
                  onClear={() => setDateTo(undefined)}
                  clearLabel={t('activity_logs.clear')}
                  size='M'
                />
              </Box>
            </Flex>
            <Tabs.Root value={activeTab} onValueChange={onTabChange}>
              <Tabs.List>
                <Tabs.Trigger value='upload'>{t('activity_logs.tab_upload')}</Tabs.Trigger>
                <Tabs.Trigger value='download'>{t('activity_logs.tab_download')}</Tabs.Trigger>
                <Tabs.Trigger value='webhook'>{t('activity_logs.tab_webhooks')}</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value='upload'>
                <SessionsTable
                  sessions={sessions}
                  searchQuery={searchQuery}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  eventType='upload'
                  sortPreferences={sortPreferences}
                  onSortChange={onSortChange}
                  onSessionClick={onSessionClick}
                  t={t}
                />
              </Tabs.Content>
              <Tabs.Content value='download'>
                <SessionsTable
                  sessions={sessions}
                  searchQuery={searchQuery}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  eventType='download'
                  sortPreferences={sortPreferences}
                  onSortChange={onSortChange}
                  onSessionClick={onSessionClick}
                  t={t}
                />
              </Tabs.Content>
              <Tabs.Content value='webhook'>
                <SessionsTable
                  sessions={sessions}
                  searchQuery={searchQuery}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  eventType='webhook'
                  sortPreferences={sortPreferences}
                  onSortChange={onSortChange}
                  onSessionClick={onSessionClick}
                  t={t}
                />
              </Tabs.Content>
            </Tabs.Root>
          </Box>
        </Box>
      )}
      <Dialog.Root open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <Dialog.Content>
          <Dialog.Header>{t('activity_logs.clear_logs')}</Dialog.Header>
          <Dialog.Body>
            <Typography variant='omega'>{t('activity_logs.clear_logs_confirm')}</Typography>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Cancel>
              <Button variant='tertiary'>{t('activity_logs.close')}</Button>
            </Dialog.Cancel>
            <Dialog.Action>
              <Button variant='danger-light' onClick={onClearLogs}>
                {t('activity_logs.clear_logs')}
              </Button>
            </Dialog.Action>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default ActivityLogs;
