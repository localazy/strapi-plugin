export const KEY = 'plugin-settings';

export type SortPreference = {
  key: string;
  direction: 'asc' | 'desc';
};

export type WebhookConfig = {
  url: string;
  webhookId?: string;
};

export type PluginSettings = {
  defaultRoute: string | null;
  activityLogsSort?: {
    upload?: SortPreference;
    download?: SortPreference;
    webhook?: SortPreference;
  };
  webhookConfig?: WebhookConfig;
};

export const emptyPluginSettings: PluginSettings = {
  defaultRoute: null,
};
