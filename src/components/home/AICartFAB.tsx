import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { FAB, useTheme, Portal, Text } from 'react-native-paper';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useCart } from '../../contexts/CartContext';

export interface AICartFABProps {
  onPress?: () => void;
  visible?: boolean;
}

export const AICartFAB: React.FC<AICartFABProps> = ({ onPress, visible = true }) => {
  const theme = useTheme();
  const glowAnimation = useRef(new Animated.Value(0)).current;
  const { t } = useLocalization();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  useEffect(() => {
    if (!visible) return;

    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    glow.start();
    return () => glow.stop();
  }, [visible, glowAnimation]);

  const opacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  if (!visible) return null;

  return (
    <Portal>
      <View style={styles.container}>
        <Animated.View
          // style={[
          //   styles.glow,
          //   {
          //     opacity,
          //     backgroundColor: theme.colors.primary,
          //   },
          // ]}
        />
        <FAB
          icon="cart-plus"
          style={[
            styles.fab,
            {
              backgroundColor: theme.colors.primary,
            },
          ]}
          onPress={onPress}
          label="ORDER"
          color={theme.colors.onPrimary}
          accessibilityLabel={t('a11y.aiCartLabel', { defaultValue: 'AI Cart suggestions' })}
          accessibilityHint={t('a11y.aiCartHint', { defaultValue: 'Opens AI recommendations for your cart' })}
        />
        {itemCount > 0 && (
          <View style={[styles.badge, { backgroundColor: theme.colors.error }]} >
            <Text variant="labelSmall" style={[styles.badgeText, { color: theme.colors.onError }]} >
              {itemCount > 99 ? '99+' : String(itemCount)}
            </Text>
          </View>
        )}
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.3,
  },
  fab: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontWeight: '700',
  },
});

export default AICartFAB;
