import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import hi from './locales/hi.json'
import mr from './locales/mr.json'
import predictionEn from './locales/prediction/en.json'
import predictionHi from './locales/prediction/hi.json'
import predictionMr from './locales/prediction/mr.json'
import profileEn from './locales/profile/en.json'
import profileHi from './locales/profile/hi.json'
import profileMr from './locales/profile/mr.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: { ...en, ...predictionEn, ...profileEn } },
      hi: { translation: { ...hi, ...predictionHi, ...profileHi } },
      mr: { translation: { ...mr, ...predictionMr, ...profileMr } }
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'mr'],
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  })

export default i18n
