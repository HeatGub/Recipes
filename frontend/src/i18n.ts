import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import plCommon from "./locales/pl/common.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon },
      pl: { common: plCommon },
    },
    lng: "en",
    fallbackLng: "pl",
    ns: ["common"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
