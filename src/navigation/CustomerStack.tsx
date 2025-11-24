import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { CustomerStackParamList } from './types';
import { MainLayout } from '../components/layout/MainLayout';

// Main Screens
import HomeFeed from '../screens/home/HomeFeed';
import VendorDirectory from '../screens/misc/VendorDirectory';
import StateMarkets from '../screens/misc/StateMarkets';
import InternationalComingSoon from '../screens/misc/InternationalComingSoon';
import Wallet from '../screens/profile/Wallet';
import ConversationList from '../screens/chat/ConversationList';
import Profile from '../screens/profile/Profile';

// Stack Screens
import ProductDetail from '../screens/product/ProductDetail';
import ProductList from '../screens/product/ProductList';
import Search from '../screens/search/Search';
import CameraSearch from '../screens/search/CameraSearch';
import Cart from '../screens/cart/Cart';
import CheckoutReview from '../screens/checkout/CheckoutReview';
import AddressSelection from '../screens/checkout/AddressSelection';
import LocalDeliveryDrivers from '../screens/checkout/LocalDeliveryDrivers';
import VendorDetail from '../screens/misc/VendorDetail';
import OrdersList from '../screens/orders/OrdersList';
import OrderDetail from '../screens/orders/OrderDetail';
import ReturnRequest from '../screens/orders/ReturnRequest';
import LiveTracking from '../screens/orders/LiveTracking';
import ChatWindow from '../screens/chat/ChatWindow';
import EditProfile from '../screens/profile/EditProfile';
import AddressBook from '../screens/profile/AddressBook';
import PaymentMethods from '../screens/profile/PaymentMethods';
import Settings from '../screens/profile/Settings';
import Notifications from '../screens/profile/Notifications';
import NotificationList from '../screens/misc/NotificationList';
import HelpCenter from '../screens/profile/HelpCenter';
import DebugScreen from '../screens/debug/DebugScreen';
import PaymentSelection from '../screens/checkout/PaymentSelection';
import PaymentWebview from '../screens/checkout/PaymentWebview';
import Confirmation from '../screens/checkout/Confirmation';

const Stack = createStackNavigator<CustomerStackParamList>();

export const CustomerStack: React.FC = () => {
  return (
    <MainLayout>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#1C1B1F',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeFeed}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Vendors"
          component={VendorDirectory}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StateMarkets"
          component={StateMarkets}
          options={{
            headerShown: true,
            title: 'State Marketplaces',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Wallet"
          component={Wallet}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Messages"
          component={ConversationList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{
            headerShown: true,
            title: 'Search',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="CameraSearch"
          component={CameraSearch}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetail}
          options={{
            headerShown: true,
            title: 'Product Details',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="ProductList"
          component={ProductList}
          options={{
            headerShown: true,
            title: 'Products',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="VendorDetail"
          component={VendorDetail}
          options={{
            headerShown: true,
            title: 'Vendor Details',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{
            headerShown: true,
            title: 'Shopping Cart',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="CheckoutReview"
          component={CheckoutReview}
          options={{
            headerShown: true,
            title: 'Review Order',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="AddressSelection"
          component={AddressSelection}
          options={{
            headerShown: true,
            title: 'Select Address',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="LocalDeliveryDrivers"
          component={LocalDeliveryDrivers}
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="PaymentSelection"
          component={PaymentSelection}
          options={{
            headerShown: true,
            title: 'Select Payment Method',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="PaymentWebview"
          component={PaymentWebview}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="Confirmation"
          component={Confirmation}
          options={{
            headerShown: false,
            presentation: 'card',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="OrdersList"
          component={OrdersList}
          options={{
            headerShown: true,
            title: 'My Orders',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="OrderDetail"
          component={OrderDetail}
          options={{
            headerShown: true,
            title: 'Order Details',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="ReturnRequest"
          component={ReturnRequest}
          options={{
            headerShown: true,
            title: 'Request Return',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="LiveTracking"
          component={LiveTracking}
          options={{
            headerShown: true,
            title: 'Track Order',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="ChatWindow"
          component={ChatWindow}
          options={{
            headerShown: true,
            title: 'Chat',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerShown: true,
            title: 'Edit Profile',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="AddressBook"
          component={AddressBook}
          options={{
            headerShown: true,
            title: 'Address Book',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="PaymentMethods"
          component={PaymentMethods}
          options={{
            headerShown: true,
            title: 'Payment Methods',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            headerShown: true,
            title: 'Settings',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{
            headerShown: true,
            title: 'Notification Settings',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="NotificationList"
          component={NotificationList}
          options={{
            headerShown: true,
            title: 'Notifications',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="HelpCenter"
          component={HelpCenter}
          options={{
            headerShown: true,
            title: 'Help & Support',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="InternationalComingSoon"
          component={InternationalComingSoon}
          options={{
            headerShown: true,
            title: 'Coming Soon',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Debug"
          component={DebugScreen}
          options={{
            headerShown: true,
            title: 'Debug Tools',
            presentation: 'card',
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Navigator>
    </MainLayout>
  );
};
