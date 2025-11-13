import { Platform, ViewStyle } from 'react-native';

interface ShadowOptions {
  color?: string;
  offset?: { width: number; height: number };
  opacity?: number;
  radius?: number;
}

/**
 * Creates platform-specific shadow styles
 * Uses boxShadow on web and shadow* properties on native
 */
export const createShadow = (options: ShadowOptions = {}): ViewStyle => {
  const {
    color = '#000',
    offset = { width: 0, height: 2 },
    opacity = 0.1,
    radius = 3,
  } = options;

  if (Platform.OS === 'web') {
    // Use boxShadow for web
    const shadowColor = color || '#000';
    const shadowOpacity = opacity || 0.1;
    const shadowRadius = radius || 3;
    const shadowOffsetX = offset?.width || 0;
    const shadowOffsetY = offset?.height || 2;

    // Convert hex color to rgba for web
    const hexToRgba = (hex: string, alpha: number): string => {
      // Handle shorthand hex colors (e.g., #000 -> #000000)
      const fullHex = hex.length === 4 
        ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
        : hex;
      const r = parseInt(fullHex.slice(1, 3), 16);
      const g = parseInt(fullHex.slice(3, 5), 16);
      const b = parseInt(fullHex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return {
      boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowRadius}px ${hexToRgba(shadowColor, shadowOpacity)}`,
    };
  }

  // Use shadow* properties for native platforms
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: radius, // For Android
  };
};

