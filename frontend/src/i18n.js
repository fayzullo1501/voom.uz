import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationRU from './locales/ru/translation.json';
import translationUZ from './locales/uz/translation.json';
import translationEN from './locales/en/translation.json';

const resources = {
  ru: { translation: translationRU },
  uz: { translation: translationUZ },
  en: { translation: translationEN },
};

i18n
  .use(LanguageDetector) // Автоматическое определение языка
  .use(initReactI18next) // Подключаем React
  .init({
    resources,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false, // React уже экранирует
    },
    detection: {
      order: ['path', 'navigator'],
      lookupFromPathIndex: 1,
    },
  });

export default i18n;
