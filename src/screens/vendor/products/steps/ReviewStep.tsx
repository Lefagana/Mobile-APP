import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Divider, Chip, useTheme } from 'react-native-paper';
import { useFormContext } from 'react-hook-form';
import type { ProductFormData } from '../ProductWizard';

export default function ReviewStep() {
    const { watch } = useFormContext<ProductFormData>();
    const theme = useTheme();
    const data = watch();

    const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <View style={styles.section}>
            <Text variant="titleSmall" style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    );

    const Row = ({ label, value }: { label: string, value: string | number | boolean | undefined }) => (
        <View style={styles.row}>
            <Text variant="bodyMedium" style={{ color: '#666' }}>{label}</Text>
            <Text variant="bodyMedium" style={{ fontWeight: '500' }}>
                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : (value || '-')}
            </Text>
        </View>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text variant="headlineSmall" style={styles.header}>Review Product</Text>
            <Text variant="bodyMedium" style={styles.subHeader}>
                Please check all details before publishing.
            </Text>

            <Section title="Basic Info">
                <View style={styles.mainInfo}>
                    {data.images?.[0] && (
                        <Image source={{ uri: data.images[0] }} style={styles.coverImage} />
                    )}
                    <View style={{ flex: 1 }}>
                        <Text variant="titleMedium">{data.title}</Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                            {data.category}
                        </Text>
                        <Text variant="titleLarge" style={{ marginTop: 4 }}>
                            ₦{data.price}
                        </Text>
                    </View>
                </View>
                <Text variant="bodyMedium" style={styles.description}>{data.description}</Text>

                <View style={styles.tags}>
                    {data.tags?.map((tag: string) => (
                        <Chip key={tag} style={styles.chip} textStyle={{ fontSize: 10, height: 16 }}>{tag}</Chip>
                    ))}
                </View>
            </Section>

            <Divider style={styles.divider} />

            <Section title="Inventory">
                <Row label="SKU" value={data.sku} />
                <Row label="Track Quantity" value={data.track_quantity} />
                {data.track_quantity && (
                    <>
                        <Row label="Quantity" value={data.quantity} />
                        <Row label="Low Stock Alert" value={data.low_stock_threshold} />
                    </>
                )}
                <Row label="Allow Backorders" value={data.allow_backorders} />
            </Section>

            <Divider style={styles.divider} />

            <Section title="Variants">
                <Row label="Has Variants" value={data.has_variants} />
                {data.has_variants && (
                    <View style={styles.variantsList}>
                        {data.variants?.map((v: any, i: number) => (
                            <View key={i} style={styles.variantRow}>
                                <Text variant="bodySmall">{v.label}</Text>
                                <Text variant="bodySmall">Qty: {v.quantity} • ₦{v.price}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </Section>

            <Divider style={styles.divider} />

            <Section title="Shipping">
                <Row label="Requires Shipping" value={data.requires_shipping} />
                {data.requires_shipping && (
                    <>
                        <Row label="Weight" value={`${data.weight_kg || 0} kg`} />
                        <Row label="Dimensions" value={`${data.dimensions?.length_cm || 0}x${data.dimensions?.width_cm || 0}x${data.dimensions?.height_cm || 0} cm`} />
                    </>
                )}
                <Row label="Fragile" value={data.is_fragile} />
            </Section>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    header: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subHeader: {
        marginBottom: 24,
        opacity: 0.7,
    },
    section: {
        marginBottom: 8,
    },
    sectionTitle: {
        marginBottom: 12,
        color: '#888',
        textTransform: 'uppercase',
        fontSize: 12,
        fontWeight: 'bold',
    },
    mainInfo: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    coverImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    description: {
        marginBottom: 12,
        lineHeight: 20,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        height: 28,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    divider: {
        marginVertical: 16,
    },
    variantsList: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
    },
    variantRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
});
