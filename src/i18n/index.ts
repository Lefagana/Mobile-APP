import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import en from './en.json';
import pidgin from './pidgin.json';
import hausa from './hausa.json';

export const resources = {
  en: { translation: en },
  pidgin: { translation: pidgin },
  hausa: { translation: hausa },
} as const;

export type Language = keyof typeof resources;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Currency formatter for NGN
export const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Number formatter with Nigerian locale
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-NG').format(value);
};

// Date formatter
export const formatDate = (date: Date | string, format: 'short' | 'long' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'short') {
    return new Intl.DateTimeFormat('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(dateObj);
  }
  
  return new Intl.DateTimeFormat('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj);
};

export default i18n;
