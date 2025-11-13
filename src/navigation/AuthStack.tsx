import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { AuthStackParamList } from './types';

// Auth Screens
import Splash from '../screens/auth/Splash';
import RoleSelector from '../screens/auth/RoleSelector';
import RolePurposeModal from '../screens/auth/RolePurposeModal';
import PhoneInput from '../screens/auth/PhoneInput';
import OTPVerify from '../screens/auth/OTPVerify';
import Onboarding from '../screens/auth/Onboarding';
import Login from '../screens/auth/Login';
import ForgotPassword from '../screens/auth/ForgotPassword';
import CustomerSignUp from '../screens/auth/CustomerSignUp';
import CustomerOnboarding from '../screens/auth/CustomerOnboarding';
import SellerSignUpWizard from '../screens/auth/SellerSignUpWizard';
import RiderSignUpWizard from '../screens/auth/RiderSignUpWizard';
import SellerTwoFASetup from '../screens/auth/SellerTwoFASetup';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="RoleSelector" component={RoleSelector} />
      <Stack.Screen
        name="RolePurposeModal"
        component={RolePurposeModal}
        options={{
          presentation: 'modal',
          headerShown: true,
          title: '',
        }}
      />
      <Stack.Screen name="PhoneInput" component={PhoneInput} />
      <Stack.Screen name="OTPVerify" component={OTPVerify} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
      {/* New registration/login screens */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="CustomerSignUp" component={CustomerSignUp} />
      <Stack.Screen name="CustomerOnboarding" component={CustomerOnboarding} />
      <Stack.Screen name="SellerSignUpWizard" component={SellerSignUpWizard} />
      <Stack.Screen name="RiderSignUpWizard" component={RiderSignUpWizard} />
      <Stack.Screen name="SellerTwoFASetup" component={SellerTwoFASetup} />
    </Stack.Navigator>
  );
};
