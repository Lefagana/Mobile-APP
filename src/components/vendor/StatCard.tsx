import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface StatCardProps {
    label: string;
    value: string | number;
    subtext?: string;
    icon: string;
    color: string;
    trend?: string;
    trendType?: 'positive' | 'negative' | 'neutral';
    onPress?: () => void;
}

export const StatCard = ({ label, value, subtext, icon, color, trend, trendType = 'positive', onPress }: StatCardProps) => {
    const theme = useTheme();

    const getTrendColor = () => {
        if (trendType === 'positive') return '#4CAF50';
        if (trendType === 'negative') return '#F44336';
        return '#757575';
    };

    const getTrendIcon = () => {
        if (trendType === 'positive') return 'arrow-up';
        if (trendType === 'negative') return 'arrow-down';
        return 'minus';
    };

    return (
        <Surface
            style={styles.container}
            elevation={1}
            onTouchEnd={onPress}
            accessibilityRole="summary"
            accessibilityLabel={`${label}: ${value}. ${subtext || ''} ${trend ? `Trend: ${trend}` : ''}`}
        >
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                    <MaterialCommunityIcons name={icon as any} size={20} color={color} />
                </View>
                {trend && (
                    <View style={[styles.trendBadge, { backgroundColor: getTrendColor() + '15' }]}>
                        <MaterialCommunityIcons name={getTrendIcon()} size={12} color={getTrendColor()} />
                        <Text style={[styles.trendText, { color: getTrendColor() }]}>{trend}</Text>
                    </View>
                )}
            </View>
            <Text variant="headlineMedium" style={styles.value} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
            <Text variant="bodySmall" style={styles.label} numberOfLines={1}>{label}</Text>
            {subtext && <Text variant="labelSmall" style={styles.subtext} numberOfLines={1}>{subtext}</Text>}
        </Surface>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        width: 140,
        marginRight: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderRadius: 4,
        height: 20,
    },
    trendText: {
        fontSize: 10,
        fontWeight: '700',
        marginLeft: 2,
    },
    value: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 2,
    },
    label: {
        color: '#777',
    },
    subtext: {
        color: '#999',
        marginTop: 4,
        fontSize: 10,
    },
});
