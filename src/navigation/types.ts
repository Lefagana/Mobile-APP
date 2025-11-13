import type { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Splash: undefined;
  RoleSelector: undefined;
  RolePurposeModal: {
    role: 'vendor' | 'rider';
  };
  PhoneInput: undefined;
  OTPVerify: {
    phone: string;
    sessionId: string;
    otpCode?: string; // Development only: OTP code for display in UI
    nextRoute?: {
      root: 'Auth' | 'Customer';
      screen?: string; // screen name within the root navigator
    };
  };
  Onboarding: undefined;
  // New auth/registration screens
  Login: undefined;
  ForgotPassword: undefined;
  CustomerSignUp: undefined;
  CustomerOnboarding: undefined; // 2-step wizard inside screen state
  SellerSignUpWizard: undefined; // multi-step wizard
  RiderSignUpWizard: undefined; // multi-step wizard
  SellerTwoFASetup: undefined; // mock 2FA setup screen
};

// Customer Stack (Main App)
export type CustomerStackParamList = {
  Home: undefined;
  Vendors: undefined;
  Wallet: undefined;
  Messages: undefined;
  Profile: undefined;
  ProductDetail: {
    productId: string;
  };
  ProductList: {
    category?: string;
    searchQuery?: string;
    vendorId?: string;
  };
  Search: undefined;
  CameraSearch: undefined;
  Cart: undefined;
  CheckoutReview: {
    paymentMethod?: string;
    selectedDriver?: any;
  };
  AddressSelection: undefined;
  LocalDeliveryDrivers: undefined;
  PaymentSelection: undefined;
  PaymentWebview: {
    url: string;
    reference: string;
  };
  Confirmation: {
    orderId: string;
  };
  OrdersList: undefined;
  OrderDetail: {
    orderId: string;
  };
  ReturnRequest: {
    orderId: string;
  };
  LiveTracking: {
    orderId: string;
  };
  StateMarkets: undefined;
  InternationalComingSoon: undefined;
  ChatWindow: {
    chatId: string;
  };
  EditProfile: undefined;
  AddressBook: undefined;
  PaymentMethods: undefined;
  Notifications: undefined;
  NotificationList: undefined;
  HelpCenter: undefined;
  Settings: undefined;
  Debug: undefined;
  VendorDetail: {
    vendorId: string;
  };
};

// Home Tab Navigator
export type HomeTabParamList = {
  Home: undefined;
  Vendors: undefined;
  Wallet: undefined;
  Messages: undefined;
  Profile: undefined;
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Customer: NavigatorScreenParams<CustomerStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
