import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../contexts/CartContext';
import type { CustomerStackParamList } from '../../navigation/types';
import type { StackNavigationProp } from '@react-navigation/stack';

type MinimalFooterNavigationProp = StackNavigationProp<CustomerStackParamList>;

export const MinimalFooter: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<MinimalFooterNavigationProp>();
  const { getItemCount } = useCart();

  const cartItemCount = getItemCount();

  const handleStorePress = () => {
    navigation.navigate('Vendors');
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <TouchableOpacity
        onPress={handleStorePress}
        activeOpacity={0.7}
        style={styles.iconButton}
      >
        <MaterialCommunityIcons
          name="store-outline"
          size={24}
          color={theme.colors.onSurface}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleCartPress}
        activeOpacity={0.7}
        style={styles.iconButton}
      >
        <MaterialCommunityIcons
          name="cart-outline"
          size={24}
          color={theme.colors.onSurface}
        />
        {cartItemCount > 0 && (
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            {/* Badge dot */}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderTopWidth: 1,
    gap: 48,
    minHeight: 56,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default MinimalFooter;

