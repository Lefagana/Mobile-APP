import React from 'react';
import { View, StyleSheet, ViewStyle, ScrollView, RefreshControl, Platform } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { OfflineBanner } from './OfflineBanner';

export interface ScreenContainerProps {
  children: React.ReactNode;
  edges?: Edge[];
  scrollable?: boolean;
  refreshControl?: React.ReactElement<typeof RefreshControl>;
  showOfflineBanner?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  edges = ['top', 'left', 'right'],
  scrollable = true,
  refreshControl,
  showOfflineBanner = true,
  style,
  contentContainerStyle,
}) => {
  const theme = useTheme();

  const content = (
    <>
      {showOfflineBanner && <OfflineBanner />}
      {children}
    </>
  );

  if (scrollable) {
    return (
      <SafeAreaView
        edges={edges}
        style={[styles.container, { backgroundColor: theme.colors.background }, style]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={true}
        >
          {content}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.container, { backgroundColor: theme.colors.background }, style]}
    >
      <View style={[styles.content, contentContainerStyle]}>{content}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    // Web-specific: Ensure proper height calculation for nested FlatList
    ...(Platform.OS === 'web' && {
      minHeight: 0,
      height: '100%',
    }),
  },
});

export default ScreenContainer;
