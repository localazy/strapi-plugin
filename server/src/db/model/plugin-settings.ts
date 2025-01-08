export const KEY = "plugin-settings";

export type PluginSettings = {
  defaultRoute: string | null;
};

export const emptyPluginSettings: PluginSettings = {
  defaultRoute: null,
};
