import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme, MD3Colors } from 'react-native-paper';

// Extend MD3Colors to include custom colors
declare module 'react-native-paper' {
  interface MD3Colors {
    success: string;
    warning: string;
    info: string;
    border: string;
    divider: string;
    placeholder: string;
  }
}

// Custom font configuration - Industrial Standard / Premium Feel
// Using system fonts but with optimized weights and spacing
const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '300' as const, // Lighter weight for large text
    letterSpacing: -0.25,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 45,
    fontWeight: '300' as const,
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
    fontWeight: '600' as const, // Bolder headlines
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.15, // Tighter body text
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
    fontWeight: '600' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
};

// Premium Color Palette
const lightColors = {
  primary: '#FF6B35', // Brand Orange - Kept as requested, but can be tweaked
  onPrimary: '#FFFFFF',
  primaryContainer: '#FFF0EB', // Softer container
  onPrimaryContainer: '#3A1200', // High contrast
  secondary: '#2D3436', // Dark Slate for secondary actions (Premium feel)
  onSecondary: '#FFFFFF',
  secondaryContainer: '#DFE2E6',
  onSecondaryContainer: '#1A1D1E',
  tertiary: '#0984E3', // Trust Blue
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#D6EFFF',
  onTertiaryContainer: '#003355',
  error: '#D63031', // Modern Red
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',
  background: '#F8F9FA', // Off-white background, easier on eyes than #FFFFFF
  onBackground: '#1A1C1E',
  surface: '#FFFFFF',
  onSurface: '#1A1C1E',
  surfaceVariant: '#F1F3F5', // Light Gray for cards/sections
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
    level1: '#FFFFFF',
    level2: '#F8F9FA',
    level3: '#F1F3F5',
    level4: '#E9ECEF',
    level5: '#DEE2E6',
  },
};

const darkColors = {
  primary: '#FFB59C',
  onPrimary: '#5F1A00',
  primaryContainer: '#8B2E00',
  onPrimaryContainer: '#FFDBCC',
  secondary: '#B0BEC5', // Light Slate
  onSecondary: '#263238',
  secondaryContainer: '#37474F',
  onSecondaryContainer: '#CFD8DC',
  tertiary: '#81D4FA',
  onTertiary: '#01579B',
  tertiaryContainer: '#0277BD',
  onTertiaryContainer: '#E1F5FE',
  error: '#FFB4AB',
  onError: '#690005',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',
  background: '#121212', // True Dark
  onBackground: '#E2E2E2',
  surface: '#1E1E1E', // Slightly lighter than background
  onSurface: '#E2E2E2',
  surfaceVariant: '#2C2C2C',
  onSurfaceVariant: '#CAC4D0',
  outline: '#938F99',
  outlineVariant: '#49454F',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#E2E2E2',
  inverseOnSurface: '#313033',
  inversePrimary: '#FF6B35',
  elevation: {
    level0: 'transparent',
    level1: '#272727',
    level2: '#2C2C2C',
    level3: '#333333',
    level4: '#383838',
    level5: '#404040',
  },
};

// Consistent Spacing Scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
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
    success: '#00B894', // Mint Green
    warning: '#FDCB6E', // Mustard
    info: '#74B9FF', // Sky Blue
    border: '#E0E0E0',
    divider: '#EEEEEE',
    placeholder: '#B2BEC3',
  },
  fonts: configureFonts({ config: fontConfig }),
  spacing,
  borderRadius: {
    sm: 6, // Slightly softer corners
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
};

// Dark theme
export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...darkColors,
    success: '#55EFC4',
    warning: '#FFEAA7',
    info: '#74B9FF',
    border: '#424242',
    divider: '#424242',
    placeholder: '#636E72',
  },
  fonts: configureFonts({ config: fontConfig }),
  spacing,
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
};

export type AppTheme = typeof lightTheme;
