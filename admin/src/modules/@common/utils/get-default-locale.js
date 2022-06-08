import I18nService from "../services/i18n-service";
import ProjectService from "../services/project-service";

export async function getStrapiDefaultLocale() {
  const locales = await I18nService.getLocales();
  const defaultLocale = locales.find((locale) => !!locale.isDefault);

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
  const sourceLanguage = connectedProject.languages.find(
    (language) => language.id === sourceLanguageId
  );

  if (!sourceLanguage) {
    return null;
  }

  return sourceLanguage;
}
