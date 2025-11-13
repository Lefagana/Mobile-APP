import React, { useMemo } from 'react';
import { View, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { Text, useTheme, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerStackParamList } from '../../navigation/types';
import { ScreenContainer, EmptyState } from '../../components/common';

const sectionsData: Array<{ title: string; data: string[] }> = [
  { title: 'Lagos', data: ['Balogun Market', 'Computer Village (Ikeja)', 'Mile 12 Market', 'Alaba Intl. Market'] },
  { title: 'Ogun', data: ['Kuto Market (Abeokuta)', 'Lafenwa Market', 'Sabo Market'] },
  { title: 'Oyo', data: ['Bodija Market', 'Gbagi Market'] },
  { title: 'Osun', data: ['Oja-Oba (Osogbo)', 'Ibokun Road Market'] },
  { title: 'Ondo', data: ['Oja Oba (Akure)', 'Isikan Market'] },
  { title: 'Edo', data: ['New Benin Market', 'Oba Market'] },
  { title: 'Rivers', data: ['Mile One Market', 'Creek Road Market'] },
  { title: 'FCT Abuja', data: ['Wuse Market', 'Garki International Market'] },
];

const StateMarkets: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<CustomerStackParamList>>();

  const sections = useMemo(() => sectionsData, []);

  const onMarketPress = (state: string, market: string) => {
    // Navigate to Vendor Directory for now (filtering by state/market can be added later)
    navigation.navigate('Vendors');
  };

  return (
    <ScreenContainer scrollable={false} showOfflineBanner={true}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item + index}
        contentContainerStyle={styles.contentContainer}
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.sectionHeader, { backgroundColor: theme.colors.surface }]}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
              {title}
            </Text>
          </View>
        )}
        renderItem={({ item, section }) => (
          <TouchableOpacity
            style={[styles.marketRow, { backgroundColor: theme.colors.surface }]}
            activeOpacity={0.7}
            onPress={() => onMarketPress(section.title, item)}
          >
            <View style={styles.leftRow}>
              <MaterialCommunityIcons name="store" size={20} color={theme.colors.primary} />
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                {item}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <Divider style={{ marginLeft: 16 }} />}
        SectionSeparatorComponent={() => <View style={{ height: 12 }} />}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <EmptyState
            icon="map-search-outline"
            title="No Markets"
            description="No marketplaces found in your nearby states."
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  marketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default StateMarkets;
