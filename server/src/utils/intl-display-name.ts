const intlDisplayName = (isoStrapi: string) => {
  let languageNames = new Intl.DisplayNames(['en'], { type: 'language' });
  return languageNames.of(isoStrapi);
};

export { intlDisplayName };
