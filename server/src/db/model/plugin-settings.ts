export const KEY = 'plugin-settings';

export type SortPreference = {
  key: string;
  direction: 'asc' | 'desc';
};

export type PluginSettings = {
  defaultRoute: string | null;
  activityLogsSort?: {
    upload?: SortPreference;
    download?: SortPreference;
    webhook?: SortPreference;
  };
};

export const emptyPluginSettings: PluginSettings = {
  defaultRoute: null,
};
