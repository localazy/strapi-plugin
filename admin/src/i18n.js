import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en_common from "./modules/@common/locale/en";
import en_login from "./modules/login/locale/en";
import en_settings from "./modules/settings/locale/en";
import en_download from "./modules/localazy-download/locale/en";
import en_upload from "./modules/localazy-upload/locale/en";
import en_plugin_settings from "./modules/plugin-settings/locale/en";

i18n
  // detect user language
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: process.env.STRAPI_ADMIN_LOCALAZY_ENV === "development",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          common: en_common,
          login: en_login,
          settings: en_settings,
          download: en_download,
          upload: en_upload,
          plugin_settings: en_plugin_settings,
        },
      },
    },
  });

export default i18n;
