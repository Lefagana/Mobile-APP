import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ViewStyle, Animated, Easing } from 'react-native';
import { useTheme } from 'react-native-paper';

export interface LoadingSkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: 'rect' | 'circle' | 'text';
}

const SkeletonItem: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  variant = 'rect',
}) => {
  const theme = useTheme();
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnimation]);

  const shimmerOpacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const isCircle = variant === 'circle';
  const finalBorderRadius = isCircle ? '50%' : borderRadius;
  const finalWidth = isCircle ? height : width;
  const finalHeight = isCircle ? height : height;

  return (
    <View
      style={[
        styles.container,
        {
          width: finalWidth,
          height: finalHeight,
          borderRadius: typeof finalBorderRadius === 'string' ? undefined : finalBorderRadius,
          backgroundColor: theme.colors.surfaceVariant,
        },
        isCircle && { borderRadius: Number(finalHeight) / 2 },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: theme.colors.background,
            opacity: shimmerOpacity,
          },
        ]}
      />
    </View>
  );
};

export const ProductCardSkeleton: React.FC = () => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <SkeletonItem width="100%" height={150} borderRadius={8} />
      <View style={styles.cardContent}>
        <SkeletonItem width="40%" height={12} style={styles.spacing} />
        <SkeletonItem width="100%" height={14} style={styles.spacing} />
        <SkeletonItem width="60%" height={16} style={styles.spacing} />
        <SkeletonItem width="50%" height={12} />
      </View>
    </View>
  );
};

export const LoadingSkeleton = SkeletonItem;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  cardContent: {
    marginTop: 12,
  },
  spacing: {
    marginBottom: 8,
  },
});

export default LoadingSkeleton;
