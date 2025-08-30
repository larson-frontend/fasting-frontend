import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import de from './locales/de.json'

export type MessageLanguages = 'en' | 'de'

// Get saved language from localStorage or default to German
function getInitialLocale(): MessageLanguages {
  const saved = localStorage.getItem('fasting-app-locale') as MessageLanguages
  if (saved && ['en', 'de'].includes(saved)) {
    return saved
  }
  
  // Browser language detection
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('de')) return 'de'
  if (browserLang.startsWith('en')) return 'en'
  
  // Default to German (original language)
  return 'de'
}

// Create i18n instance
export const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: getInitialLocale(),
  fallbackLocale: 'de',
  messages: {
    en,
    de
  },
  globalInjection: true, // Enable global $t
})

// Helper function to change language
export function setLocale(locale: MessageLanguages) {
  i18n.global.locale.value = locale
  localStorage.setItem('fasting-app-locale', locale)
  
  // Update document language
  document.documentElement.lang = locale
}

// Get current locale
export function getCurrentLocale(): MessageLanguages {
  return i18n.global.locale.value as MessageLanguages
}

// Available languages with better flag display
export const availableLocales: { code: MessageLanguages; name: string; flag: string }[] = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
]
