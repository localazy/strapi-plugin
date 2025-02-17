import I18nService from '../services/i18n-service';
import ProjectService from '../services/project-service';

// TODO: ADD TYPES

export async function getStrapiDefaultLocale() {
  const locales = await I18nService.getLocales();
  const defaultLocale = locales.find((locale: any) => !!locale.isDefault);

  if (!defaultLocale) {
    return null;
  }

  return defaultLocale;
}

export async function getLocalazySourceLanguage() {
  const connectedProject = await ProjectService.getConnectedProject();

  if (!connectedProject) {
    return null;
  }

  const sourceLanguageId = connectedProject.sourceLanguage;
  const sourceLanguage = connectedProject.languages.find((language: any) => language.id === sourceLanguageId);

  if (!sourceLanguage) {
    return null;
  }

  return sourceLanguage;
}
