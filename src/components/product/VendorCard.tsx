import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, useTheme, Avatar } from 'react-native-paper';
import { Vendor } from '../../types';
import { VendorLogo } from './VendorLogo';

export interface VendorCardProps {
  vendor: Vendor;
  onPress?: (vendor: Vendor) => void;
  showRating?: boolean;
  showLocation?: boolean;
}

export const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  onPress,
  showRating = true,
  showLocation = true,
}) => {
  const theme = useTheme();

  const content = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <VendorLogo vendor={vendor} size={48} />
      <View style={styles.content}>
        <Text variant="titleSmall" style={[styles.name, { color: theme.colors.onSurface }]} numberOfLines={1}>
          {vendor.shop_name}
        </Text>
        {showRating && vendor.rating !== undefined && (
          <View style={styles.ratingContainer}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              ⭐ {vendor.rating.toFixed(1)}
            </Text>
          </View>
        )}
        {showLocation && vendor.address_text && (
          <Text variant="bodySmall" style={[styles.location, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
            📍 {vendor.address_text}
          </Text>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={() => onPress(vendor)} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
  },
});

export default VendorCard;
