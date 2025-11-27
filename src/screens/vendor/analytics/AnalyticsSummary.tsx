import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Text, Card, Surface, Button, SegmentedButtons, useTheme, ProgressBar } from 'react-native-paper';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { formatCurrency } from '../../../utils/formatters';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function AnalyticsSummary() {
    const theme = useTheme();
    const [timeRange, setTimeRange] = useState('week');

    // Mock data for charts
    const salesData = [
        { label: 'Mon', value: 12000 },
        { label: 'Tue', value: 18500 },
        { label: 'Wed', value: 15000 },
        { label: 'Thu', value: 22000 },
        { label: 'Fri', value: 35000 },
        { label: 'Sat', value: 42000 },
        { label: 'Sun', value: 28000 },
    ];

    const maxSale = Math.max(...salesData.map(d => d.value));

    const topProducts = [
        { name: 'Palm Oil (5L)', sales: 45, revenue: 225000 },
        { name: 'Local Rice (50kg)', sales: 28, revenue: 1120000 },
        { name: 'Yam Tubers', sales: 150, revenue: 150000 },
        { name: 'Egusi (1kg)', sales: 85, revenue: 127500 },
    ];

    return (
        <ScreenContainer style={{ backgroundColor: '#F5F7FA' }}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <SegmentedButtons
                        value={timeRange}
                        onValueChange={setTimeRange}
                        buttons={[
                            { value: 'day', label: 'Day' },
                            { value: 'week', label: 'Week' },
                            { value: 'month', label: 'Month' },
                        ]}
                        style={styles.segmentedButton}
                    />
                </View>

                {/* Key Metrics */}
                <View style={styles.metricsGrid}>
                    <Surface style={styles.metricCard} elevation={1}>
                        <Text variant="labelMedium" style={styles.metricLabel}>Total Revenue</Text>
                        <Text variant="headlineSmall" style={styles.metricValue}>{formatCurrency(172500)}</Text>
                        <View style={styles.trendRow}>
                            <MaterialCommunityIcons name="arrow-up" size={16} color="#4CAF50" />
                            <Text style={{ color: '#4CAF50', fontWeight: '600' }}>12.5%</Text>
                        </View>
                    </Surface>
                    <Surface style={styles.metricCard} elevation={1}>
                        <Text variant="labelMedium" style={styles.metricLabel}>Orders</Text>
                        <Text variant="headlineSmall" style={styles.metricValue}>45</Text>
                        <View style={styles.trendRow}>
                            <MaterialCommunityIcons name="arrow-up" size={16} color="#4CAF50" />
                            <Text style={{ color: '#4CAF50', fontWeight: '600' }}>8.2%</Text>
                        </View>
                    </Surface>
                </View>

                {/* Sales Chart */}
                <Card style={styles.chartCard}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.cardTitle}>Sales Overview</Text>
                        <View style={styles.chartContainer}>
                            {salesData.map((data, index) => (
                                <View key={index} style={styles.barContainer}>
                                    <View style={[
                                        styles.bar,
                                        {
                                            height: (data.value / maxSale) * 150,
                                            backgroundColor: index === 5 ? theme.colors.primary : '#E0E0E0'
                                        }
                                    ]} />
                                    <Text style={styles.barLabel}>{data.label}</Text>
                                </View>
                            ))}
                        </View>
                    </Card.Content>
                </Card>

                {/* Top Products */}
                <Card style={styles.chartCard}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.cardTitle}>Top Products</Text>
                        {topProducts.map((product, index) => (
                            <View key={index} style={styles.productRow}>
                                <View style={styles.productInfo}>
                                    <Text variant="bodyMedium" style={{ fontWeight: '600' }}>{product.name}</Text>
                                    <Text variant="bodySmall" style={{ color: '#666' }}>{product.sales} sales</Text>
                                </View>
                                <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>{formatCurrency(product.revenue)}</Text>
                            </View>
                        ))}
                    </Card.Content>
                </Card>

                {/* Customer Insights */}
                <Card style={styles.chartCard}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.cardTitle}>Customer Insights</Text>
                        <View style={styles.insightRow}>
                            <View style={styles.insightItem}>
                                <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>85%</Text>
                                <Text variant="bodySmall">Returning Customers</Text>
                            </View>
                            <View style={styles.insightDivider} />
                            <View style={styles.insightItem}>
                                <Text variant="headlineMedium" style={{ color: '#FF9800', fontWeight: 'bold' }}>4.8</Text>
                                <Text variant="bodySmall">Avg Rating</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                <View style={{ height: 40 }} />
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
    },
    segmentedButton: {
        marginBottom: 8,
    },
    metricsGrid: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 16,
    },
    metricCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
    },
    metricLabel: {
        color: '#666',
        marginBottom: 4,
    },
    metricValue: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chartCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#FFF',
    },
    cardTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 180,
        paddingBottom: 8,
    },
    barContainer: {
        alignItems: 'center',
        flex: 1,
    },
    bar: {
        width: 8,
        borderRadius: 4,
        marginBottom: 8,
    },
    barLabel: {
        fontSize: 10,
        color: '#999',
    },
    productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    productInfo: {
        flex: 1,
    },
    insightRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 16,
    },
    insightItem: {
        alignItems: 'center',
    },
    insightDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#E0E0E0',
    },
});
