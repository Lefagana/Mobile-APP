import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface StatusBadgeProps {
  status: OrderStatus;
  style?: ViewStyle;
  size?: 'small' | 'medium';
}

const statusConfig: Record<OrderStatus, { label: string; color: string; icon?: string }> = {
  pending: { label: 'Pending', color: '#FF9800', icon: 'clock-outline' },
  accepted: { label: 'Accepted', color: '#2196F3', icon: 'check-circle-outline' },
  preparing: { label: 'Preparing', color: '#9C27B0', icon: 'chef-hat' },
  out_for_delivery: { label: 'Out for Delivery', color: '#00BCD4', icon: 'truck-delivery-outline' },
  delivered: { label: 'Delivered', color: '#4CAF50', icon: 'check-circle' },
  cancelled: { label: 'Cancelled', color: '#F44336', icon: 'close-circle' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, style, size = 'medium' }) => {
  const theme = useTheme();
  const config = statusConfig[status];

  return (
    <Chip
      icon={config.icon}
      style={[
        styles.chip,
        {
          backgroundColor: `${config.color}20`,
          borderColor: config.color,
          borderWidth: 1,
        },
        style,
      ]}
      textStyle={[
        styles.text,
        size === 'small' && styles.smallText,
        {
          color: config.color,
        },
      ]}
      accessibilityLabel={`Order status: ${config.label}`}
      accessibilityRole="text"
    >
      {config.label}
    </Chip>
  );
};

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  smallText: {
    fontSize: 10,
  },
});

export default StatusBadge;
