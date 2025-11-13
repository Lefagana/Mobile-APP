import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../i18n';

interface LocalizationContextType {
  language: Language;
  changeLanguage: (lang: Language) => Promise<void>;
  t: (key: string, options?: any) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@wakanda:language';

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  return context;
};

interface LocalizationProviderProps {
  children: ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load saved language preference
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pidgin' || savedLanguage === 'hausa')) {
          setLanguage(savedLanguage as Language);
          await i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
      }
    };

    loadLanguage();
  }, [i18n]);

  const changeLanguage = async (lang: Language) => {
    try {
      setLanguage(lang);
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <LocalizationContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};
