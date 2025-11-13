import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// Custom font configuration
const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '400' as const,
    letterSpacing: -0.25,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 45,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  labelLarge: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
};

// Nigerian market color palette
const lightColors = {
  primary: '#FF6B35', // Vibrant orange (brand color)
  onPrimary: '#FFFFFF',
  primaryContainer: '#FFE5DC',
  onPrimaryContainer: '#8B2E00',
  secondary: '#00A8CC', // Blue accent
  onSecondary: '#FFFFFF',
  secondaryContainer: '#CCEEF5',
  onSecondaryContainer: '#004D5C',
  tertiary: '#FFC107', // Gold/yellow
  onTertiary: '#000000',
  tertiaryContainer: '#FFF3C4',
  onTertiaryContainer: '#664800',
  error: '#B00020',
  onError: '#FFFFFF',
  errorContainer: '#FCD8DF',
  onErrorContainer: '#8E0018',
  background: '#FFFFFF',
  onBackground: '#1C1B1F',
  surface: '#FFFFFF',
  onSurface: '#1C1B1F',
  surfaceVariant: '#F5F5F5',
  onSurfaceVariant: '#49454F',
  outline: '#79747E',
  outlineVariant: '#CAC4D0',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#313033',
  inverseOnSurface: '#F4EFF4',
  inversePrimary: '#FFB59C',
  elevation: {
    level0: 'transparent',
    level1: '#FEF7FF',
    level2: '#FCF2FF',
    level3: '#FAEDFF',
    level4: '#F9EBFF',
    level5: '#F7E7FF',
  },
};

const darkColors = {
  primary: '#FFB59C',
  onPrimary: '#5F1A00',
  primaryContainer: '#8B2E00',
  onPrimaryContainer: '#FFDBCC',
  secondary: '#90DBEF',
  onSecondary: '#00343F',
  secondaryContainer: '#004D5C',
  onSecondaryContainer: '#B6EBF7',
  tertiary: '#FFD54F',
  onTertiary: '#332400',
  tertiaryContainer: '#664800',
  onTertiaryContainer: '#FFEE9F',
  error: '#FFB4AB',
  onError: '#690005',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',
  background: '#1C1B1F',
  onBackground: '#E6E1E5',
  surface: '#1C1B1F',
  onSurface: '#E6E1E5',
  surfaceVariant: '#49454F',
  onSurfaceVariant: '#CAC4D0',
  outline: '#938F99',
  outlineVariant: '#49454F',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#E6E1E5',
  inverseOnSurface: '#313033',
  inversePrimary: '#FF6B35',
  elevation: {
    level0: 'transparent',
    level1: '#252329',
    level2: '#2A2830',
    level3: '#2F2D36',
    level4: '#322F38',
    level5: '#35323B',
  },
};

// Custom spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Custom theme extensions
declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      success: string;
      warning: string;
      info: string;
      border: string;
      divider: string;
      placeholder: string;
    }
    interface Theme {
      spacing: typeof spacing;
      borderRadius: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
        full: number;
      };
    }
  }
}

// Light theme
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...lightColors,
    success: '#4CAF50',
    warning: '#FF9800',
    info: '#2196F3',
    border: '#E0E0E0',
    divider: '#E0E0E0',
    placeholder: '#9E9E9E',
  },
  fonts: configureFonts({ config: fontConfig }),
  spacing,
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
};

// Dark theme
export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...darkColors,
    success: '#66BB6A',
    warning: '#FFA726',
    info: '#42A5F5',
    border: '#424242',
    divider: '#424242',
    placeholder: '#757575',
  },
  fonts: configureFonts({ config: fontConfig }),
  spacing,
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
};

export type AppTheme = typeof lightTheme;
