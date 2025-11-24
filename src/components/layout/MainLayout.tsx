import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { VoiceBottomBar } from '../home';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {children}
            </View>

            {/* Global Voice Bar - Fixed at bottom */}
            <View style={[styles.voiceBarContainer, { paddingBottom: insets.bottom }]}>
                <VoiceBottomBar />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    content: {
        flex: 1,
    },
    voiceBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000, // Ensure it stays on top
        // Optional: Add blur or background if VoiceBottomBar doesn't have it
    },
});
