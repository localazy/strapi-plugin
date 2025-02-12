export const intlDisplayName = (isoStrapi: string): string | undefined => {
  let languageNames = new Intl.DisplayNames(['en'], { type: 'language' });
  return languageNames.of(isoStrapi);
};
