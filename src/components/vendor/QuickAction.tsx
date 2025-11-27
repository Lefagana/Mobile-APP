import React from 'react';
import { TouchableOpacity, StyleSheet, View, Dimensions } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

interface QuickActionProps {
    icon: string;
    label: string;
    onPress: () => void;
    color: string;
    badge?: number;
}

export const QuickAction = ({ icon, label, onPress, color, badge }: QuickActionProps) => {
    const theme = useTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}
            accessibilityRole="button"
            accessibilityLabel={`${label} button`}
            accessibilityHint={`Navigates to ${label}`}
        >
            <Surface style={[styles.iconContainer, { backgroundColor: color + '20' }]} elevation={0}>
                <MaterialCommunityIcons name={icon as any} size={24} color={color} />
                {badge ? (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
                    </View>
                ) : null}
            </Surface>
            <Text variant="labelMedium" style={styles.label} numberOfLines={2}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: width / 3 - 20,
        marginBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        textAlign: 'center',
        fontWeight: '500',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#F44336',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
