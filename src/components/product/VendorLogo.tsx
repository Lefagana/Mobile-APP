import React from 'react';
import { Image, StyleSheet, ViewStyle } from 'react-native';
import { Avatar, useTheme } from 'react-native-paper';
import { Vendor } from '../../types';

export interface VendorLogoProps {
  vendor: Vendor;
  size?: number;
  style?: ViewStyle;
}

export const VendorLogo: React.FC<VendorLogoProps> = ({ vendor, size = 40, style }) => {
  const theme = useTheme();

  const initials = vendor.shop_name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  if (vendor.logo) {
    return (
      <Avatar.Image
        size={size}
        source={{ uri: vendor.logo }}
        style={[
          {
            backgroundColor: theme.colors.surfaceVariant,
          },
          style,
        ]}
      />
    );
  }

  return (
    <Avatar.Text
      size={size}
      label={initials}
      style={[
        {
          backgroundColor: theme.colors.primaryContainer,
        },
        style,
      ]}
      labelStyle={{
        color: theme.colors.onPrimaryContainer,
        fontSize: size * 0.4,
        fontWeight: 'bold',
      }}
    />
  );
};

export default VendorLogo;
