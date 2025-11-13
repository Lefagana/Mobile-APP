import React from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { Text, Button, useTheme, IconButton, Divider, Chip } from 'react-native-paper';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { ProductCard } from '../product/ProductCard';

export interface AICartSuggestionsModalProps {
  visible: boolean;
  onDismiss: () => void;
  onAddBundle?: (products: Product[]) => void;
  suggestedBundles?: Array<{
    id: string;
    title: string;
    description: string;
    products: Product[];
    discount: number;
    savings: number;
    reason: string;
  }>;
}

export const AICartSuggestionsModal: React.FC<AICartSuggestionsModalProps> = ({
  visible,
  onDismiss,
  onAddBundle,
  suggestedBundles = [],
}) => {
  const theme = useTheme();

  // Default mock suggestions if none provided
  const defaultSuggestions: Array<{
    id: string;
    title: string;
    description: string;
    products: Product[];
    discount: number;
    savings: number;
    reason: string;
  }> = [
    {
      id: '1',
      title: 'Complete Your Look',
      description: 'Based on your browsing, these items complement your style',
      products: [], // Will be populated from props or API
      discount: 15,
      savings: 2500,
      reason: 'Frequently bought together',
    },
    {
      id: '2',
      title: 'Best Value Bundle',
      description: 'Save more with this curated selection',
      products: [],
      discount: 20,
      savings: 5000,
      reason: 'AI-optimized savings',
    },
  ];

  const bundles = suggestedBundles.length > 0 ? suggestedBundles : defaultSuggestions;

  const handleAddBundle = (bundle: typeof bundles[0]) => {
    if (onAddBundle && bundle.products.length > 0) {
      onAddBundle(bundle.products);
    }
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.modal,
                {
                  backgroundColor: theme.colors.surface,
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <View style={styles.iconContainer}>
                    <IconButton
                      icon="robot"
                      size={28}
                      iconColor={theme.colors.primary}
                      style={styles.aiIcon}
                    />
                  </View>
                  <View style={styles.headerText}>
                    <Text
                      variant="titleLarge"
                      style={[styles.title, { color: theme.colors.onSurface }]}
                    >
                      AI Cart Suggestions
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
                    >
                      Personalized recommendations just for you
                    </Text>
                  </View>
                </View>
                <IconButton
                  icon="close"
                  size={24}
                  iconColor={theme.colors.onSurface}
                  onPress={onDismiss}
                />
              </View>

              <Divider style={styles.divider} />

              {/* Content */}
              <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
              >
                {bundles.map((bundle, index) => (
                  <View
                    key={bundle.id || index}
                    style={[
                      styles.bundleCard,
                      {
                        backgroundColor: theme.colors.surfaceVariant,
                        borderColor: theme.colors.outlineVariant,
                      },
                    ]}
                  >
                    {/* Bundle Header */}
                    <View style={styles.bundleHeader}>
                      <View style={styles.bundleTitleContainer}>
                        <Text
                          variant="titleMedium"
                          style={[styles.bundleTitle, { color: theme.colors.onSurface }]}
                        >
                          {bundle.title}
                        </Text>
                        <Chip
                          mode="flat"
                          style={[
                            styles.discountChip,
                            { backgroundColor: theme.colors.primaryContainer },
                          ]}
                          textStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 11 }}
                        >
                          {bundle.discount}% OFF
                        </Chip>
                      </View>
                      <Text
                        variant="bodySmall"
                        style={[styles.bundleDescription, { color: theme.colors.onSurfaceVariant }]}
                      >
                        {bundle.description}
                      </Text>
                      <Text
                        variant="labelSmall"
                        style={[styles.reason, { color: theme.colors.primary }]}
                      >
                        💡 {bundle.reason}
                      </Text>
                    </View>

                    {/* Products Preview */}
                    {bundle.products.length > 0 ? (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.productsContainer}
                        contentContainerStyle={styles.productsContent}
                      >
                        {bundle.products.slice(0, 3).map((product) => (
                          <View key={product.id} style={styles.productPreview}>
                            <ProductCard
                              product={product}
                              variant="grid"
                              showAddToCart={false}
                            />
                          </View>
                        ))}
                      </ScrollView>
                    ) : (
                      <View style={styles.emptyProducts}>
                        <Text
                          variant="bodyMedium"
                          style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
                        >
                          No products available in this bundle
                        </Text>
                      </View>
                    )}

                    {/* Bundle Footer */}
                    <View style={styles.bundleFooter}>
                      <View style={styles.savingsContainer}>
                        <Text
                          variant="labelSmall"
                          style={[styles.savingsLabel, { color: theme.colors.onSurfaceVariant }]}
                        >
                          You Save:
                        </Text>
                        <Text
                          variant="titleMedium"
                          style={[styles.savingsAmount, { color: theme.colors.primary }]}
                        >
                          {formatCurrency(bundle.savings)}
                        </Text>
                      </View>
                      <Button
                        mode="contained"
                        onPress={() => handleAddBundle(bundle)}
                        icon="cart-plus"
                        style={styles.addButton}
                        disabled={bundle.products.length === 0}
                      >
                        Add Bundle
                      </Button>
                    </View>
                  </View>
                ))}

                {bundles.length === 0 && (
                  <View style={styles.emptyState}>
                    <IconButton
                      icon="robot-outline"
                      size={64}
                      iconColor={theme.colors.onSurfaceVariant}
                    />
                    <Text
                      variant="titleMedium"
                      style={[styles.emptyTitle, { color: theme.colors.onSurface }]}
                    >
                      No suggestions yet
                    </Text>
                    <Text
                      variant="bodyMedium"
                      style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}
                    >
                      Keep browsing and we'll suggest personalized bundles for you!
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  aiIcon: {
    margin: 0,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  divider: {
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bundleCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  bundleHeader: {
    marginBottom: 12,
  },
  bundleTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  bundleTitle: {
    fontWeight: '600',
    flex: 1,
  },
  discountChip: {
    height: 24,
  },
  bundleDescription: {
    marginBottom: 4,
    lineHeight: 18,
  },
  reason: {
    marginTop: 4,
    fontStyle: 'italic',
  },
  productsContainer: {
    marginVertical: 12,
  },
  productsContent: {
    gap: 12,
    paddingRight: 8,
  },
  productPreview: {
    width: 140,
    marginRight: 8,
  },
  emptyProducts: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  bundleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  savingsContainer: {
    flex: 1,
  },
  savingsLabel: {
    marginBottom: 2,
  },
  savingsAmount: {
    fontWeight: 'bold',
  },
  addButton: {
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubtitle: {
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});

export default AICartSuggestionsModal;

