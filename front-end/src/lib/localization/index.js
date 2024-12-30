import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en";
import vi from "./vi";

const lang = localStorage.getItem("lang");

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    vi: {
      translation: vi,
    },
  },
  lng: lang ?? "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
