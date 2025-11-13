# Wakanda-X Architecture Documentation

## Overview

Wakanda-X is a frontend-first React Native application built with Expo, designed to work independently with mock data while being ready for backend integration. The architecture follows a clean separation of concerns with pluggable adapters for external services.

## Technology Stack

- **Framework**: Expo (managed workflow) + React Native
- **Language**: TypeScript
- **UI Library**: React Native Paper (Material Design)
- **Navigation**: React Navigation v6 (Stack + Bottom Tabs)
- **State Management**: 
  - React Context (global state: Auth, Cart, Config, Network, Localization)
  - TanStack Query (server state, caching, sync)
- **Storage**: 
  - `expo-secure-store` (tokens, sensitive data)
  - `@react-native-async-storage/async-storage` (cart, preferences, offline queue)
- **Localization**: i18next
- **Voice/Audio**: expo-speech + expo-av

## Directory Structure

```
src/
├── navigation/          # Navigation configuration
│   ├── AppNavigator.tsx
│   ├── AuthStack.tsx
│   ├── CustomerStack.tsx
│   └── types.ts
├── screens/             # Screen components
│   ├── auth/           # Authentication flows
│   ├── home/           # Home feed
│   ├── product/        # Product screens
│   ├── cart/           # Cart & checkout
│   ├── orders/          # Orders & tracking
│   ├── chat/           # Messaging
│   ├── profile/        # Profile & settings
│   ├── misc/           # Miscellaneous screens
│   └── debug/          # Debug tools
├── components/          # Reusable components
│   ├── common/         # Common UI components
│   ├── product/        # Product-specific components
│   └── forms/          # Form components
├── contexts/           # React Context providers
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── ConfigContext.tsx
│   ├── NetworkContext.tsx
│   └── LocalizationContext.tsx
├── services/           # API & data layer
│   ├── api.ts          # API facade (mock/real switch)
│   └── mocks/          # Mock server implementation
├── adapters/           # Pluggable integrations
│   ├── paystackAdapter.ts
│   ├── mapsAdapter.ts
│   ├── otpAdapter.ts
│   ├── pushAdapter.ts
│   ├── analyticsAdapter.ts
│   └── monitoringAdapter.ts
├── hooks/              # Custom React hooks
│   ├── useOfflineQueue.ts
│   ├── useDebouncedSearch.ts
│   └── useVoiceSearch.ts
├── utils/              # Utility functions
│   ├── validators.ts
│   ├── formatters.ts
│   └── authGuard.ts
├── theme/              # Theme configuration
│   └── theme.ts
├── types/              # TypeScript definitions
│   └── index.ts
└── i18n/               # Localization files
    ├── index.ts
    ├── en.json
    ├── pidgin.json
    └── hausa.json
```

## Core Architecture Patterns

### 1. API Facade Pattern

The `src/services/api.ts` file acts as a single entry point for all API calls. It switches between mock and real implementations based on `MOCK_MODE`:

```typescript
const api = createApi({ MOCK_MODE: true, apiBaseUrl: 'http://localhost:3000' });

// Same interface regardless of mock/real
await api.products.list({ category: 'electronics' });
```

### 2. Adapter Pattern

External services (Paystack, Maps, OTP, etc.) are abstracted through adapters:

```typescript
// Mock implementation
import { paystackAdapterMock } from './adapters/paystackAdapter.mock';

// Production implementation
import { paystackAdapterProd } from './adapters/paystackAdapter.prod';

// Usage
const adapter = MOCK_MODE ? paystackAdapterMock : paystackAdapterProd;
```

### 3. Context-Based State Management

Global state is managed through React Context:

- **AuthContext**: User authentication, tokens
- **CartContext**: Shopping cart state (persisted to AsyncStorage)
- **ConfigContext**: App configuration, environment variables
- **NetworkContext**: Online/offline status
- **LocalizationContext**: Language and formatting

### 4. Server State with TanStack Query

Server state (products, orders, etc.) is managed with TanStack Query:

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['products', category],
  queryFn: () => api.products.list({ category }),
});
```

Benefits:
- Automatic caching
- Background refetching
- Optimistic updates
- Offline support

### 5. Offline Queue Pattern

Actions that require network are queued when offline:

```typescript
const { queueAction } = useOfflineQueue();

// Register action handler
registerActionHandler('checkout', async (payload) => {
  return api.orders.create(payload);
});

// Queue action (works offline)
await queueAction('checkout', orderData);
```

## Data Flow

### Authentication Flow

```
User enters phone → Request OTP → Verify OTP → Get tokens → Store in SecureStore → Update AuthContext
```

### Product Browsing Flow

```
User opens HomeFeed → TanStack Query fetches products → Display in ProductCard components → User taps product → Navigate to ProductDetail
```

### Checkout Flow

```
Cart items → CheckoutReview → AddressSelection → PaymentSelection → PaymentWebview → Order Confirmation
```

### Offline Flow

```
User action → Check network status → If offline: Queue action → When online: Process queue → Retry failed actions
```

## State Management Strategy

### When to Use Context

- **AuthContext**: User authentication state (global, infrequent changes)
- **CartContext**: Shopping cart (persisted, frequent updates)
- **ConfigContext**: App configuration (global, rarely changes)
- **NetworkContext**: Network status (global, reactive)

### When to Use TanStack Query

- Product listings
- Order history
- Wallet transactions
- Chat messages
- Notifications

### When to Use Local State

- Form inputs
- UI state (modals, dropdowns)
- Component-specific state

## Navigation Structure

```
AppNavigator
├── AuthStack (if not authenticated)
│   ├── Splash
│   ├── RoleSelector
│   ├── PhoneInput
│   ├── OTPVerify
│   └── Onboarding
└── CustomerStack (if authenticated)
    ├── Home (bottom tab)
    ├── Vendors (bottom tab)
    ├── Wallet (bottom tab)
    ├── Messages (bottom tab)
    ├── Profile (bottom tab)
    └── Stack Screens
        ├── Search
        ├── ProductDetail
        ├── Cart
        ├── CheckoutReview
        ├── OrdersList
        ├── OrderDetail
        ├── LiveTracking
        ├── ChatWindow
        └── ...
```

## Security Considerations

1. **Token Storage**: Tokens stored in `expo-secure-store` (encrypted)
2. **No PII in AsyncStorage**: Only non-sensitive data (cart, preferences)
3. **HTTPS Only**: All API calls use HTTPS in production
4. **Input Validation**: Client-side validation + server-side validation required
5. **Token Refresh**: Automatic token refresh on expiration

## Performance Optimizations

1. **Image Optimization**: Lazy loading, progressive loading
2. **Code Splitting**: Lazy-loaded screens
3. **Memoization**: React.memo for expensive components
4. **Virtual Lists**: FlatList for long lists
5. **Query Caching**: TanStack Query caching reduces API calls

## Testing Strategy

### Unit Tests
- Context providers
- Custom hooks
- Utility functions
- Adapters (mock implementations)

### Integration Tests
- Complete user flows (login → browse → checkout)
- Navigation flows
- Offline queue processing

### E2E Tests
- Critical paths (signup, checkout)
- Payment flows
- Order tracking

## Deployment

### Development
- Run with `npx expo start`
- Uses mock data by default
- Hot reload enabled

### Staging/Production
- Build with EAS: `eas build --profile staging`
- Environment variables from `eas.json`
- OTA updates via Expo Updates

## Environment Configuration

Configuration is managed through:
1. `.env.development`, `.env.staging`, `.env.production` files
2. `eas.json` for build-time environment variables
3. `ConfigContext` for runtime access

## Future Enhancements

1. **Real Voice Search**: Integrate speech-to-text API
2. **Real Maps**: Integrate Google Maps SDK
3. **Push Notifications**: Expo Push Notifications
4. **Analytics**: Amplitude/Firebase Analytics
5. **Error Monitoring**: Sentry integration
6. **Offline Database**: SQLite for offline data storage
7. **Image Caching**: Better image caching strategy

## Contributing

When adding new features:
1. Follow the existing directory structure
2. Use TypeScript for type safety
3. Add proper error handling
4. Include accessibility labels
5. Support offline mode where applicable
6. Update this documentation

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [TanStack Query](https://tanstack.com/query/latest)



