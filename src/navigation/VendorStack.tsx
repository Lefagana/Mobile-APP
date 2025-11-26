import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { VendorStackParamList, VendorTabParamList } from './types';

// Tab Screens
import VendorDashboard from '../screens/vendor/dashboard/VendorDashboard';
import ProductList from '../screens/vendor/products/ProductList';
import OrderList from '../screens/vendor/orders/OrderList';
import VendorWallet from '../screens/vendor/wallet/VendorWallet';
import VendorProfile from '../screens/vendor/profile/VendorProfile';

// Stack Screens
import ProductForm from '../screens/vendor/products/ProductForm';
import ProductDetail from '../screens/vendor/products/ProductDetail';
import OrderDetail from '../screens/vendor/orders/OrderDetail';
import TransactionHistory from '../screens/vendor/wallet/TransactionHistory';
import PayoutRequest from '../screens/vendor/wallet/PayoutRequest';

// Onboarding Screens
import BusinessTypeSelection from '../screens/vendor/onboarding/BusinessTypeSelection';
import ShopDetailsForm from '../screens/vendor/onboarding/ShopDetailsForm';
import LocationCapture from '../screens/vendor/onboarding/LocationCapture';
import KYCUpload from '../screens/vendor/onboarding/KYCUpload';

// Placeholder components for missing screens
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const PlaceholderScreen = ({ title }: { title: string }) => (
    <View style={styles.placeholder}>
        <Text variant="headlineSmall">{title}</Text>
        <Text variant="bodyMedium" style={{ marginTop: 8, opacity: 0.6 }}>
            Coming soon...
        </Text>
    </View>
);

const Tab = createBottomTabNavigator<VendorTabParamList>();
const Stack = createStackNavigator<VendorStackParamList>();

// Bottom Tab Navigator
function VendorTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#4CAF50',
                tabBarInactiveTintColor: '#757575',
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={VendorDashboard}
                options={{
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Products"
                component={ProductList}
                options={{
                    tabBarLabel: 'Products',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="package-variant" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Orders"
                component={OrderList}
                options={{
                    tabBarLabel: 'Orders',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="clipboard-list" size={size} color={color} />
                    ),
                    tabBarBadge: 3, // Would be dynamic based on new orders
                }}
            />
            <Tab.Screen
                name="Wallet"
                component={VendorWallet}
                options={{
                    tabBarLabel: 'Wallet',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="wallet" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={VendorProfile}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

// Main Stack Navigator
export const VendorStack: React.FC = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#FFFFFF',
                },
                headerTintColor: '#1C1B1F',
                headerTitleStyle: {
                    fontWeight: '600',
                },
                headerBackTitleVisible: false,
            }}
        >
            {/* Main tabs */}
            <Stack.Screen
                name="Dashboard"
                component={VendorTabs}
                options={{ headerShown: false }}
            />

            {/* Product Stack Screens */}
            <Stack.Screen
                name="ProductForm"
                component={ProductForm}
                options={({ route }) => ({
                    title: route.params.mode === 'create' ? 'Add Product' : 'Edit Product',
                })}
            />
            <Stack.Screen
                name="ProductDetail"
                component={ProductDetail}
                options={{ title: 'Product Details' }}
            />
            <Stack.Screen
                name="InventoryManager"
                component={() => <PlaceholderScreen title="Inventory Manager" />}
                options={{ title: 'Manage Inventory' }}
            />
            <Stack.Screen
                name="BulkUpload"
                component={() => <PlaceholderScreen title="Bulk Upload" />}
                options={{ title: 'Bulk Upload Products' }}
            />

            {/* Order Stack Screens */}
            <Stack.Screen
                name="OrderDetail"
                component={OrderDetail}
                options={{ title: 'Order Details' }}
            />
            <Stack.Screen
                name="OrderStatusUpdate"
                component={() => <PlaceholderScreen title="Update Order Status" />}
                options={{ title: 'Update Status', presentation: 'modal' }}
            />
            <Stack.Screen
                name="ReturnsList"
                component={() => <PlaceholderScreen title="Returns" />}
                options={{ title: 'Returns & Refunds' }}
            />

            {/* Wallet Stack Screens */}
            <Stack.Screen
                name="TransactionHistory"
                component={TransactionHistory}
                options={{ title: 'All Transactions' }}
            />
            <Stack.Screen
                name="PayoutRequest"
                component={PayoutRequest}
                options={{ title: 'Request Payout', presentation: 'modal' }}
            />
            <Stack.Screen
                name="PayoutHistory"
                component={() => <PlaceholderScreen title="Payout History" />}
                options={{ title: 'Payout History' }}
            />
            <Stack.Screen
                name="AnalyticsSummary"
                component={() => <PlaceholderScreen title="Analytics" />}
                options={{ title: 'Business Analytics' }}
            />
            <Stack.Screen
                name="FinancialReports"
                component={() => <PlaceholderScreen title="Financial Reports" />}
                options={{ title: 'Financial Reports' }}
            />

            {/* Profile Stack Screens */}
            <Stack.Screen
                name="ShopProfile"
                component={() => <PlaceholderScreen title="Edit Shop Profile" />}
                options={{ title: 'Edit Shop Profile' }}
            />
            <Stack.Screen
                name="BusinessInfo"
                component={() => <PlaceholderScreen title="Business Info" />}
                options={{ title: 'Business Info' }}
            />
            <Stack.Screen
                name="BankSettings"
                component={() => <PlaceholderScreen title="Bank Settings" />}
                options={{ title: 'Bank Settings' }}
            />
            <Stack.Screen
                name="VendorSettings"
                component={() => <PlaceholderScreen title="Settings" />}
                options={{ title: 'Settings' }}
            />

            {/* Onboarding Screens */}
            <Stack.Screen
                name="BusinessTypeSelection"
                component={BusinessTypeSelection}
                options={{ title: 'Business Type' }}
            />
            <Stack.Screen
                name="ShopDetailsForm"
                component={ShopDetailsForm}
                options={{ title: 'Shop Details' }}
            />
            <Stack.Screen
                name="LocationCapture"
                component={LocationCapture}
                options={{ title: 'Shop Location' }}
            />
            <Stack.Screen
                name="KYCUpload"
                component={KYCUpload}
                options={{ title: 'Upload KYC Documents' }}
            />

            {/* Shared Screens */}
            <Stack.Screen
                name="ChatWindow"
                component={() => <PlaceholderScreen title="Chat" />}
                options={{ title: 'Customer Chat' }}
            />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
});
