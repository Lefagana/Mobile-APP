import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { ScreenContainer } from '../../components/common';
import { HomeTabBar } from '../../components/home';

const VendorDirectory: React.FC = () => {
  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <HomeTabBar />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="headlineSmall">Vendor Directory</Text>
        <Text variant="bodyMedium">Vendor directory will be implemented here</Text>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 56, // Padding for sticky HomeTabBar
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
});

export default VendorDirectory;
