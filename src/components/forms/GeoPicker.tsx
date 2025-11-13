import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme, Button } from 'react-native-paper';

export interface GeoPickerProps {
  label: string;
  value?: {
    lat: number;
    lng: number;
    address?: string;
  };
  onSelect: (location: { lat: number; lng: number; address?: string }) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

/**
 * GeoPicker component for selecting location on map
 * Note: This is a placeholder component. In production, integrate with:
 * - react-native-maps or expo-location
 * - Google Maps API for geocoding/reverse geocoding
 */
export const GeoPicker: React.FC<GeoPickerProps> = ({
  label,
  value,
  onSelect,
  error,
  helperText,
  disabled = false,
  required = false,
  testID,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  const [isSelecting, setIsSelecting] = useState(false);

  const handleSelectLocation = async () => {
    if (disabled) return;

    setIsSelecting(true);
    
    // Mock: In production, open map picker modal
    // For now, simulate with a mock location
    setTimeout(() => {
      const mockLocation = {
        lat: 6.5244 + Math.random() * 0.1, // Lagos area
        lng: 3.3792 + Math.random() * 0.1,
        address: 'Mock Address, Lagos, Nigeria',
      };
      
      onSelect(mockLocation);
      setIsSelecting(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text
        variant="bodyMedium"
        style={[
          styles.label,
          { color: theme.colors.onSurface },
          required && styles.required,
        ]}
      >
        {required ? `${label} *` : label}
      </Text>
      
      {value ? (
        <View style={[styles.selectedContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View style={styles.selectedContent}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {value.address || `${value.lat.toFixed(6)}, ${value.lng.toFixed(6)}`}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              Lat: {value.lat.toFixed(6)}, Lng: {value.lng.toFixed(6)}
            </Text>
          </View>
          <Button
            mode="text"
            onPress={handleSelectLocation}
            disabled={disabled || isSelecting}
            compact
          >
            Change
          </Button>
        </View>
      ) : (
        <Button
          mode="outlined"
          onPress={handleSelectLocation}
          disabled={disabled || isSelecting}
          loading={isSelecting}
          icon="map-marker"
          style={styles.selectButton}
          testID={testID}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={error || helperText || 'Tap to select location on map'}
        >
          Select Location on Map
        </Button>
      )}

      {(error || helperText) && (
        <Text
          variant="bodySmall"
          style={[
            styles.helperText,
            error ? { color: theme.colors.error } : { color: theme.colors.onSurfaceVariant },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  required: {
    fontWeight: '600',
  },
  selectButton: {
    marginTop: 4,
  },
  selectedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  selectedContent: {
    flex: 1,
    marginRight: 8,
  },
  helperText: {
    marginTop: 4,
    marginLeft: 4,
  },
});



