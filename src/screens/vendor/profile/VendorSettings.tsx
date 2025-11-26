import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { List, Switch, Divider, useTheme, Text } from 'react-native-paper';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import type { VendorStackParamList } from '../../../navigation/types';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<VendorStackParamList, 'VendorSettings'>;

export default function VendorSettings({ navigation }: Props) {
    const theme = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [autoPrint, setAutoPrint] = useState(false);
    const [sound, setSound] = useState(true);

    return (
        <ScreenContainer>
            <ScrollView style={styles.container}>
                <List.Section>
                    <List.Subheader>Notifications</List.Subheader>
                    <List.Item
                        title="Push Notifications"
                        description="Receive alerts for new orders"
                        right={() => <Switch value={notifications} onValueChange={setNotifications} />}
                    />
                    <Divider />
                    <List.Item
                        title="Email Alerts"
                        description="Receive daily summaries"
                        right={() => <Switch value={emailAlerts} onValueChange={setEmailAlerts} />}
                    />
                    <Divider />
                    <List.Item
                        title="Order Sound"
                        description="Play sound on new order"
                        right={() => <Switch value={sound} onValueChange={setSound} />}
                    />
                </List.Section>

                <List.Section>
                    <List.Subheader>Hardware</List.Subheader>
                    <List.Item
                        title="Auto-Print Receipts"
                        description="Print receipt when order is accepted"
                        right={() => <Switch value={autoPrint} onValueChange={setAutoPrint} />}
                    />
                    <Divider />
                    <List.Item
                        title="Printer Settings"
                        description="Configure connected printers"
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => { }}
                    />
                </List.Section>

                <List.Section>
                    <List.Subheader>General</List.Subheader>
                    <List.Item
                        title="Language"
                        description="English"
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => { }}
                    />
                    <Divider />
                    <List.Item
                        title="Currency"
                        description="NGN (₦)"
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => { }}
                    />
                </List.Section>

                <View style={styles.version}>
                    <Text variant="bodySmall" style={{ opacity: 0.5 }}>Version 1.0.0 (Build 102)</Text>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    version: {
        alignItems: 'center',
        padding: 24,
    },
});
