import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Constants from 'expo-constants';
import { initializeApi } from '../services/api';
import { initializeAdapters } from '../adapters';

export interface AppConfig {
  MOCK_MODE: boolean;
  apiBaseUrl: string;
  paystackKey?: string;
  mapsKey?: string;
  otpProvider?: string;
  vendorAppUrl?: string;
  riderAppUrl?: string;
  environment: 'development' | 'staging' | 'production';
  enableDebug: boolean;
}

const defaultConfig: AppConfig = {
  MOCK_MODE: true,
  apiBaseUrl: 'https://api.wakanda-x.com',
  environment: 'development',
  enableDebug: __DEV__,
  vendorAppUrl: 'https://apps.apple.com/app/wakanda-vendor',
  riderAppUrl: 'https://play.google.com/store/apps/details?id=com.wakanda.rider',
};

const ConfigContext = createContext<{
  config: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => void;
}>({
  config: defaultConfig,
  updateConfig: () => {},
});

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
};

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(() => {
    // Load from environment variables if available
    const envConfig = Constants.expoConfig?.extra || {};
    
    const loadedConfig = {
      MOCK_MODE: envConfig.MOCK_MODE !== undefined 
        ? envConfig.MOCK_MODE === 'true' || envConfig.MOCK_MODE === true
        : defaultConfig.MOCK_MODE,
      apiBaseUrl: envConfig.API_BASE_URL || defaultConfig.apiBaseUrl,
      paystackKey: envConfig.PAYSTACK_KEY || defaultConfig.paystackKey,
      mapsKey: envConfig.MAPS_KEY || defaultConfig.mapsKey,
      otpProvider: envConfig.OTP_PROVIDER || defaultConfig.otpProvider,
      vendorAppUrl: envConfig.VENDOR_APP_URL || defaultConfig.vendorAppUrl,
      riderAppUrl: envConfig.RIDER_APP_URL || defaultConfig.riderAppUrl,
      environment: (envConfig.ENVIRONMENT as AppConfig['environment']) || defaultConfig.environment,
      enableDebug: __DEV__,
    };

    // Initialize API with loaded config
    initializeApi({
      MOCK_MODE: loadedConfig.MOCK_MODE,
      apiBaseUrl: loadedConfig.apiBaseUrl,
    });

    // Initialize adapters with loaded config
    initializeAdapters(loadedConfig.MOCK_MODE);

    return loadedConfig;
  });

  const updateConfig = (updates: Partial<AppConfig>) => {
    setConfig((prev) => {
      const newConfig = { ...prev, ...updates };
      // Reinitialize API if relevant config changed
      if (updates.MOCK_MODE !== undefined || updates.apiBaseUrl !== undefined) {
        initializeApi({
          MOCK_MODE: newConfig.MOCK_MODE,
          apiBaseUrl: newConfig.apiBaseUrl,
        });
        // Reinitialize adapters if MOCK_MODE changed
        if (updates.MOCK_MODE !== undefined) {
          initializeAdapters(newConfig.MOCK_MODE);
        }
      }
      return newConfig;
    });
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
