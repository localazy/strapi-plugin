import I18nService from "../services/i18n-service";
import ProjectService from "../services/project-service";
import { isoLocalazyToStrapi } from "./iso-locales-utils";

// TODO: ADD TYPES

export default async (defaultLocale: any = null, sourceLanguage: any = null) => {
  try {
    if (!defaultLocale) {
      const locales = await I18nService.getLocales();
      defaultLocale = locales.find((locale: any) => !!locale.isDefault);
    }

    if (!defaultLocale) {
      return false;
    }

    if (!sourceLanguage) {
      const connectedProject = await ProjectService.getConnectedProject();

      if (!connectedProject) {
        return false;
      }

      const sourceLanguageId = connectedProject.sourceLanguage;
      sourceLanguage = connectedProject.languages.find(
        (language: any) => language.id === sourceLanguageId
      );
    }

    if (!sourceLanguage) {
      return false;
    }

    const defaultLocaleCode = defaultLocale.code;
    const sourceLanguageStrapiCode = isoLocalazyToStrapi(sourceLanguage.code);

    return defaultLocaleCode === sourceLanguageStrapiCode;
  } catch (e: any) {
    console.error(e.message);

    return false;
  }
};
