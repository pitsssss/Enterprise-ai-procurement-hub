import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import arTranslation from './locales/ar.json';

export type SupportedLanguage = 'en' | 'ar';

export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; label: string; nativeLabel: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English (US)', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', dir: 'rtl' },
];

const savedLanguage = (localStorage.getItem('synthetix_locale') as SupportedLanguage) || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Apply document attributes on initial load
export function applyDocumentLanguage(lang: SupportedLanguage) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  if (lang === 'ar') {
    document.documentElement.classList.add('font-arabic');
  } else {
    document.documentElement.classList.remove('font-arabic');
  }
}

// Ensure initial run
applyDocumentLanguage(savedLanguage);

export async function setAppLanguage(lang: SupportedLanguage): Promise<void> {
  await i18n.changeLanguage(lang);
  localStorage.setItem('synthetix_locale', lang);
  applyDocumentLanguage(lang);
}

export default i18n;
