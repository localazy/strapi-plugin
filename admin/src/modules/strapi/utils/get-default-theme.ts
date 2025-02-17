import { darkTheme } from '@strapi/design-system';
import { lightTheme } from '@strapi/design-system';

const THEME_KEY = 'STRAPI_THEME';

export type ThemeName = 'light' | 'dark' | 'system';

export const getDefaultThemeName = () => {
  const persistedTheme = localStorage.getItem(THEME_KEY) as ThemeName | null;

  return persistedTheme || 'system';
};

export const getDefaultTheme = () => {
  const themeName = getDefaultThemeName();

  return themeName === 'system'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
      ? darkTheme
      : lightTheme
    : themeName === 'dark'
      ? darkTheme
      : lightTheme;
};
