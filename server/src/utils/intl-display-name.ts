export const intlDisplayName = (isoStrapi: string): string | null => {
  if (!isoStrapi) {
    return null;
  }

  let languageNames = new Intl.DisplayNames(['en'], { type: 'language' });
  const split = isoStrapi.split('-');
  if (split.length > 1) {
    return languageNames.of(split[0].toLowerCase());
  }
  return languageNames.of(isoStrapi.toLowerCase());
};
