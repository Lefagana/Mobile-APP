<!-- a32614ad-d984-4d4c-9554-0d6a6ee20348 4e8d34a1-a42e-4fca-8856-ba0c6d6a20d6 -->
# Wakanda-X Frontend Complete Implementation Plan

## Technology Stack

- **Framework**: Expo (managed workflow) + React Native + TypeScript
- **UI Library**: React Native Paper (Material Design)
- **Navigation**: React Navigation v6 (Stack + Bottom Tabs)
- **State Management**: TanStack Query (React Query) + React Context
- **Styling**: React Native Paper theme system + custom theme extensions
- **Localization**: i18next
- **Storage**: expo-secure-store, @react-native-async-storage/async-storage
- **Voice**: expo-speech + expo-av (simulated initially, ready for real integration)

## Phase 1: Project Foundation & Configuration ✅

### 1.1 Project Initialization ✅

- ✅ Initialize new Expo project with TypeScript template
- ✅ Install core dependencies: React Navigation, React Native Paper, TanStack Query, i18next
- ✅ Configure TypeScript with strict mode
- ✅ Set up ESLint + Prettier for code quality
- ⏳ Create `.env.development`, `.env.staging`, `.env.production` files

### 1.2 Core Architecture Setup ✅

- ✅ **Directory Structure**: Create complete `src/` folder structure as per Frontend-focus.md
- ✅ `src/assets/` - images, fonts, icons
- ✅ `src/i18n/` - en.json, pidgin.json, hausa.json
- ✅ `src/navigation/` - AppNavigator, CustomerStack, AuthStack
- ✅ `src/screens/` - auth, home, product, cart, orders, chat, profile, misc
- ✅ `src/components/` - common, product, forms
- ✅ `src/contexts/` - Auth, Cart, Config, Network, Localization
- ✅ `src/services/` - api.ts, mocks/, adapters/
- ✅ `src/hooks/` - custom hooks
- ✅ `src/utils/` - validators, formatters
- ✅ `src/theme/` - theme configuration
- ✅ `src/types/` - TypeScript definitions
- ⏳ `contracts/` - API contract JSON schemas

### 1.3 Theme & Design System ✅

- ✅ Configure React Native Paper theme with Nigerian market colors
- ✅ Create custom theme extensions (spacing, typography, colors for light/dark modes)
- ✅ Define color palette: primary (brand), secondary, error, success, surface, background
- ⏳ Set up custom fonts if needed
- ⏳ Create design tokens file

## Phase 2: Core Infrastructure & Contexts ✅

### 2.1 Configuration Context ✅

- ✅ Create `ConfigContext.tsx` with environment management
- ✅ Support `MOCK_MODE`, `apiBaseUrl`, `paystackKey`, `mapsKey` switches
- ✅ Load from environment variables
- ✅ Provide debug mode toggle

### 2.2 Network Context ✅

- ✅ Implement `NetworkContext.tsx` using `@react-native-community/netinfo`
- ✅ Track online/offline status
- ⏳ Create offline action queue manager
- ⏳ Provide network status indicators

### 2.3 Auth Context ✅

- ✅ Create `AuthContext.tsx` with token management
- ✅ Implement secure token storage (expo-secure-store)
- ✅ Provide auth methods: login, logout, token refresh
- ✅ Store user profile in memory
- ✅ Auto-refresh token logic

### 2.4 Cart Context ✅

- ✅ Create `CartContext.tsx` for local cart state
- ✅ Persist cart to AsyncStorage
- ✅ Implement add, remove, update quantity, clear methods
- ✅ Calculate totals, apply coupons (mock validation)
- ✅ Support per-item notes

### 2.5 Localization Context ✅

- ✅ Set up i18next configuration
- ✅ Create language resource files (English, Pidgin, Hausa skeletons)
- ✅ Implement language switcher logic
- ✅ Support currency formatting (NGN)
- ✅ Provide translation hooks

## Phase 3: API Layer & Mock Infrastructure ✅

### 3.1 API Service Facade ✅

- ✅ Create `services/api.ts` as single entry point
- ✅ Implement environment-aware routing (mock vs. real)
- ✅ Define all API functions with TypeScript interfaces
- ✅ Add request/response interceptors for auth tokens
- ✅ Implement automatic retry logic

### 3.2 Mock Server ✅

- ✅ Create `services/mocks/mockServer.ts` with demo datasets
- ✅ Nigerian-specific mock data: products (Groundnut Oil, etc.), vendors, orders
- ✅ Simulate network latency (configurable)
- ✅ Mock failure scenarios for testing
- ✅ Provide realistic response structures

### 3.3 Mock Data Collections ✅

- ✅ **Products**: 50+ items across categories (Fashion, Electronics, Kids, Shoes, Local Mart items)
- ✅ **Vendors**: 10+ vendor profiles with ratings, locations
- ✅ **Orders**: Sample order history with various statuses
- ✅ **Users**: Sample customer profiles
- ⏳ **Chat messages**: Conversation history samples

### 3.4 API Contracts ⏳

- ⏳ Document all API contracts in `contracts/` folder as JSON schemas
- ⏳ Auth endpoints: `/auth/request-otp`, `/auth/verify-otp`
- ⏳ Product endpoints: `/products`, `/products/:id`
- ⏳ Order endpoints: `/orders/create`, `/orders/:id`
- ⏳ Chat endpoints: WebSocket event specifications
- ⏳ Payment verification endpoints

## Phase 4: Adapter Layer (Pluggable Integrations) ⏳

### 4.1 Paystack Adapter ⏳

- ⏳ Create `adapters/paystackAdapter.ts` interface
- ⏳ Implement `paystackAdapter.mock.ts` for demo mode
- ⏳ Stub `paystackAdapter.prod.ts` for real integration
- ⏳ Support payment initiation and verification flows
- ⏳ Handle payment success/failure UI states

### 4.2 Maps Adapter ⏳

- ⏳ Create `adapters/mapsAdapter.ts` interface
- ⏳ Mock geocoding and reverse geocoding
- ⏳ Stub Google Maps integration points
- ⏳ Support address suggestions and map pin selection

### 4.3 OTP Adapter ⏳

- ⏳ Create `adapters/otpAdapter.ts` interface
- ⏳ Mock OTP generation and verification
- ⏳ Document SMS provider integration points (Twilio, Africa's Talking)
- ⏳ Support voice call fallback (documented)

### 4.4 Push Notifications Adapter ⏳

- ⏳ Create `adapters/pushAdapter.ts` interface
- ⏳ Mock push notification triggers
- ⏳ Stub Expo push notification integration
- ⏳ Define notification payload structures

### 4.5 Analytics & Monitoring Adapters ⏳

- ⏳ Create `adapters/analyticsAdapter.ts` (Amplitude stub)
- ⏳ Create `adapters/monitoringAdapter.ts` (Sentry stub)
- ⏳ Define event tracking list with payload shapes
- ⏳ No-op implementations when keys not provided

## Phase 5: Navigation Structure ✅

### 5.1 Navigation Configuration ✅

- ✅ Set up `AppNavigator.tsx` as root navigator
- ✅ Create `AuthResolver` component to check token status
- ⏳ Configure deep linking schema
- ✅ Set up navigation type safety

### 5.2 Auth Stack ✅

- ✅ Create `AuthStack.tsx` with screens:
- ✅ Splash screen with token check
- ✅ RoleSelector (Customer/Vendor/Rider)
- ✅ RolePurposeModal (for Vendor/Rider with download links)
- ✅ PhoneInput screen
- ✅ OTPVerify screen with resend timer
- ✅ Onboarding carousel (permissions, benefits)

### 5.3 Customer Stack (Main App) ✅

- ✅ Create `CustomerStack.tsx` with bottom tab navigation:
- ✅ Home tab → HomeFeed
- ✅ Vendors tab → VendorDirectory
- ✅ Wallet tab → Wallet screen
- ✅ Messages tab → ConversationList
- ✅ Profile tab → Profile screen
- ⏳ Nest additional stack navigators for deep flows

## Phase 6: Authentication Screens ✅

### 6.1 Splash Screen ✅

- ✅ Loading animation
- ✅ Check for stored auth token
- ✅ Environment initialization
- ✅ Route to AuthStack or CustomerStack

### 6.2 Role Selector Screen ✅

- ✅ Three role options: Customer, Vendor, Rider
- ✅ Icons and short descriptions
- ✅ Customer proceeds to phone input
- ✅ Vendor/Rider trigger RolePurposeModal

### 6.3 Role Purpose Modal ✅

- ✅ Display for Vendor/Rider selections
- ✅ Title: "Vendor / Rider?"
- ✅ Copy: "Wakanda-X customers use this app..."
- ✅ Primary button: "Get Vendor App" (opens App Store link)
- ✅ Secondary: "Get Rider App" (opens Play Store link)
- ✅ Tertiary: "Continue as Customer"

### 6.4 Phone Input Screen ✅

- ✅ Nigerian phone number input (+234)
- ✅ Validation for phone format
- ✅ "Request OTP" button
- ✅ Loading state during OTP request

### 6.5 OTP Verification Screen ✅

- ✅ 6-digit OTP input
- ✅ Resend timer (60 seconds)
- ✅ "Resend OTP" button
- ✅ "Request Voice Call" option
- ✅ Auto-verify on complete input
- ✅ Error handling for invalid codes

### 6.6 Onboarding Carousel ✅

- ✅ 3-4 slides showcasing features
- ✅ Optional name and profile picture
- ✅ Permission requests (push, location)
- ✅ Skip option available
- ✅ "Get Started" final CTA

## Phase 7: Home Feed Screen (Priority - Pixel Perfect) ⏳

### 7.1 Header Section (Sticky Top Bar) ⏳

- ⏳ **Search Bar**: Full-width with "Search product" placeholder
- ⏳ Magnifying glass icon (left)
- ⏳ Camera icon button (right) for barcode/visual search
- ⏳ Tap to navigate to Search screen
- ⏳ **Utility Icons Row** (right side):
- ⏳ Shopping bag icon (cart) with badge count
- ⏳ Notification bell icon with unread indicator
- ⏳ User location indicator (small)

### 7.2 Primary Navigation (Sub-Header Tab Bar) ✅

- ✅ Horizontal tabs: Home | Vendors | Wallet | Message | Profile
- ✅ Icons + labels for each tab
- ✅ Active state: underline and color highlight
- ✅ Bottom tab navigation integration

### 7.3 Mart Selection Module ⏳

- ⏳ Two equal-width buttons side-by-side:
- ⏳ "Local Mart" (default selected)
- ⏳ "International Mart"
- ⏳ Vertical divider between buttons
- ⏳ Tap to toggle, filters content below
- ⏳ Visual state change (background color, border)

### 7.4 Logistics Module ⏳

- ⏳ "Send Package" button/section below marts
- ⏳ Icon: package/shipping box
- ⏳ Tap to navigate to logistics flow (future enhancement)

### 7.5 Explore Module (Store Logos Carousel) ⏳

- ⏳ Title: "Explore"
- ⏳ Horizontal scrollable row of 6+ vendor/store logos
- ⏳ Circular logo containers with brand images
- ⏳ Arrow button: "=> Stores Browse"
- ⏳ Tap logo to filter by vendor
- ⏳ Tap arrow to navigate to full vendor directory

### 7.6 Brand Module (Sponsored/Featured Vendors) ⏳

- ⏳ Single row of brand logos
- ⏳ Horizontal scroll
- ⏳ Square logo placeholders
- ⏳ 4-6 featured brands
- ⏳ Tap to view vendor collections

### 7.7 Featured Products Banner ⏳

- ⏳ Title: "Featured Products"
- ⏳ Full-width carousel banner
- ⏳ Hero image with product overlay
- ⏳ "Summer Outfit Collection" style promotions
- ⏳ AI-powered personalization (tie to user profile)
- ⏳ Dots indicator for multiple slides

### 7.8 Category Menu (Horizontal Tabs) ⏳

- ⏳ Pills: All | Fashion | Electronics | Kids | Shoes | [More...]
- ⏳ "All" selected by default
- ⏳ Tap to filter product feed
- ⏳ Horizontal scroll for overflow categories
- ⏳ Active state highlighting

### 7.9 Product Feed Stream (Infinite Scroll) ⏳

- ⏳ **Grid Layout**: 2 columns on mobile
- ⏳ **Product Card** (per design):
- ⏳ Vendor name (top-left, small text)
- ⏳ "Low Price" badge (prominent, red circle)
- ⏳ Product image (centered)
- ⏳ Product title (below image)
- ⏳ Price (NGN, bold)
- ⏳ Store badge (e.g., "Health Store")
- ⏳ Quick "Add to Cart" button
- ⏳ Infinite scroll with loading skeleton
- ⏳ Pull-to-refresh functionality

### 7.10 AI Features Integration ⏳

- ⏳ **AI Cart +**: Floating action button
- ⏳ Suggests bundle upsells
- ⏳ "Based on your style" modal
- ⏳ Subtle glow animation
- ⏳ **AI Person's Choice Section**:
- ⏳ Below product feed
- ⏳ Title: "AI Person's Choice"
- ⏳ Personalized product carousel
- ⏳ Toggle between "All persons choice" and personalized

### 7.11 Bottom Bar (Voice & Keyboard) ⏳

- ⏳ **Left**: Voice input button (microphone icon)
- ⏳ Tap to activate voice search
- ⏳ Triggers voice modal
- ⏳ **Center**: Live voice waveform visualization
- ⏳ Animated waveform using expo-av
- ⏳ Smooth sine waves, translucent glow
- ⏳ States: Idle → Listening → Processing → Done
- ⏳ Emotional feedback for voice interaction
- ⏳ **Right**: Keyboard switch button
- ⏳ Toggle input modes
- ⏳ Switch between voice, text, emoji

## Phase 8: Search & Discovery Screens ⏳

### 8.1 Search Screen ⏳

- ⏳ Search input with autofocus
- ⏳ Recent searches list
- ⏳ Category quick filters
- ⏳ Client-side search through demo dataset
- ⏳ Camera/barcode search button (UI placeholder)
- ⏳ Results with same ProductCard component
- ⏳ Empty state with suggestions

### 8.2 Camera Search Modal ⏳

- ⏳ Camera preview (placeholder)
- ⏳ Capture button
- ⏳ "Search by image" instructions
- ⏳ Mock search results on capture

## Phase 9: Product Screens ⏳

### 9.1 Product List Screen ⏳

- ⏳ Filter by category, vendor, price range
- ⏳ Sort options (price, rating, newest)
- ⏳ Grid/List view toggle
- ⏳ Product cards with quick add
- ⏳ Loading skeleton states

### 9.2 Product Detail Screen ⏳

- ⏳ Image carousel (swipeable)
- ⏳ Product title, price, rating
- ⏳ Vendor info card with link
- ⏳ Variant picker (size, color, etc.)
- ⏳ Quantity selector
- ⏳ "Add to Cart" and "Buy Now" buttons
- ⏳ Product description (expandable)
- ⏳ Reviews section with pagination
- ⏳ Related products carousel
- ⏳ Share button

## Phase 10: Cart & Checkout Flow ⏳

### 10.1 Cart Screen ⏳

- ⏳ List of cart items with thumbnails
- ⏳ Editable quantity per item
- ⏳ Per-item notes/instructions field
- ⏳ Remove item action
- ⏳ Coupon/promo code input with validation (mock)
- ⏳ Cost breakdown:
- ⏳ Subtotal
- ⏳ Delivery fee (distance-based estimate)
- ⏳ Discounts
- ⏳ Total (bold)
- ⏳ "Proceed to Checkout" button
- ⏳ Empty cart state with "Continue Shopping" CTA

### 10.2 Checkout Review Screen ⏳

- ⏳ **Address Selection**:
- ⏳ Current saved addresses list
- ⏳ "Add New Address" button
- ⏳ Selected address highlighted
- ⏳ **Delivery Options**:
- ⏳ ASAP delivery
- ⏳ Scheduled delivery (date/time picker)
- ⏳ Pickup option
- ⏳ **Order Summary**: Items, quantities, prices
- ⏳ **Delivery Instructions**: Free-text field
- ⏳ "Continue to Payment" button

### 10.3 Address Selection/Add Screen ⏳

- ⏳ Map view with pin (Google Maps mock)
- ⏳ Free-text "Landmark" field
- ⏳ "Delivery instructions" field
- ⏳ Address type selector (Home/Work/Other)
- ⏳ Smart suggestions: recent addresses, community pickup points
- ⏳ "Deliver to neighbor" toggle
- ⏳ Fallback: structured text fields (State, LGA, Town, Landmark)
- ⏳ Save address button
- ⏳ Offline: mark as unsynced

### 10.4 Payment Selection Screen ⏳

- ⏳ Payment method options:
- ⏳ Wallet (show balance)
- ⏳ Paystack (Card/Bank)
- ⏳ Cash on Delivery
- ⏳ USSD Bank Transfer
- ⏳ Selected method highlighted
- ⏳ "Place Order" button

### 10.5 Payment Webview (Paystack) ⏳

- ⏳ Open Paystack webview/native SDK
- ⏳ Handle payment callbacks
- ⏳ Loading state during verification
- ⏳ Success/failure handling

### 10.6 Confirmation Screen ⏳

- ⏳ Success animation (checkmark)
- ⏳ Order ID and summary
- ⏳ Estimated delivery time (ETA)
- ⏳ "Track Order" button
- ⏳ "Continue Shopping" button
- ⏳ Push notification sent

## Phase 11: Orders & Tracking ⏳

### 11.1 Orders List Screen ⏳

- ⏳ Tabs: Active | Completed | Cancelled
- ⏳ Order cards with:
- ⏳ Order ID, date
- ⏳ Items count and total
- ⏳ Status badge (color-coded)
- ⏳ Vendor info
- ⏳ "View Details" action
- ⏳ Pull-to-refresh
- ⏳ Empty states per tab

### 11.2 Order Detail Screen ⏳

- ⏳ Order status timeline:
- ⏳ Pending → Accepted → Preparing → Out for Delivery → Delivered
- ⏳ Items list with thumbnails
- ⏳ Vendor contact (call/chat buttons)
- ⏳ Rider info (if assigned): name, phone, photo
- ⏳ Delivery address
- ⏳ Payment details
- ⏳ Receipt download (PDF stub)
- ⏳ "Track Order" button (if in transit)
- ⏳ "Initiate Return" button (if eligible)
- ⏳ "Reorder" button

### 11.3 Live Tracking Screen ⏳

- ⏳ Full-screen map view
- ⏳ Rider marker (moving) with avatar
- ⏳ Customer location marker
- ⏳ Route polyline
- ⏳ ETA display at top
- ⏳ Rider info card at bottom:
- ⏳ Name, photo, phone
- ⏳ "Call Rider" and "Chat with Rider" buttons
- ⏳ Order status updates in real-time
- ⏳ Mock WebSocket for live updates with simulated movement

## Phase 12: Wallet & Payments ⏳

### 12.1 Wallet Screen ⏳

- ⏳ Current balance (large, prominent)
- ⏳ "Top Up" button
- ⏳ Transaction history list:
- ⏳ Type (credit/debit)
- ⏳ Description
- ⏳ Amount (color-coded)
- ⏳ Date/time
- ⏳ Status
- ⏳ Filter by date range
- ⏳ Empty state

### 12.2 Wallet Top-Up Modal ⏳

- ⏳ Amount input
- ⏳ Preset amounts (₦500, ₦1000, ₦5000, ₦10000)
- ⏳ Payment method selection
- ⏳ "Add Funds" button
- ⏳ Mock successful top-up animation

## Phase 13: Chat & Messaging ⏳

### 13.1 Conversation List Screen ⏳

- ⏳ List of chat threads
- ⏳ Each thread shows:
- ⏳ Contact name (vendor/rider/support)
- ⏳ Last message preview
- ⏳ Timestamp
- ⏳ Unread badge
- ⏳ Contact avatar
- ⏳ Order-related chats pinned to top
- ⏳ Search conversations
- ⏳ Empty state

### 13.2 Chat Window Screen ⏳

- ⏳ Message bubble layout (WhatsApp-like)
- ⏳ Customer messages (right, colored)
- ⏳ Other party messages (left, gray)
- ⏳ Timestamp on messages
- ⏳ Read receipts (double checkmarks)
- ⏳ Typing indicator
- ⏳ Image attachments support
- ⏳ Quick reply templates for order status
- ⏳ Input field with:
- ⏳ Text input
- ⏳ Attachment button (camera/gallery)
- ⏳ Send button
- ⏳ Optimistic UI for sent messages
- ⏳ Local persistence (AsyncStorage)
- ⏳ Empty state for new conversations

## Phase 14: Profile & Settings ⏳

### 14.1 Profile Screen ⏳

- ⏳ User avatar and name
- ⏳ Phone number display
- ⏳ Profile completion indicator
- ⏳ Menu items:
- ⏳ Edit Profile
- ⏳ Address Book
- ⏳ Payment Methods
- ⏳ Order History
- ⏳ Wallet
- ⏳ Notifications Settings
- ⏳ Language Selection
- ⏳ Help Center
- ⏳ About
- ⏳ Logout

### 14.2 Edit Profile Screen ⏳

- ⏳ Avatar upload (placeholder)
- ⏳ Name input
- ⏳ Email input (optional)
- ⏳ Phone (read-only)
- ⏳ Save button

### 14.3 Address Book Screen ⏳

- ⏳ List of saved addresses
- ⏳ Each address card:
- ⏳ Type (Home/Work/Other)
- ⏳ Full address text
- ⏳ Edit/Delete actions
- ⏳ "Add New Address" button
- ⏳ Set default address

### 14.4 Payment Methods Screen ⏳

- ⏳ Saved payment methods list (mock)
- ⏳ "Add Payment Method" button
- ⏳ Default payment indicator

### 14.5 Settings Screens ⏳

- ⏳ **Notifications Settings**: Toggle push notifications
- ⏳ **Language Selection**: English, Pidgin, Hausa radio buttons
- ⏳ **Theme Toggle**: Light/Dark mode switch
- ⏳ **About**: App version, terms, privacy policy links

## Phase 15: Notifications & Help ⏳

### 15.1 Notifications Screen ⏳

- ⏳ List of in-app notifications
- ⏳ Each notification:
- ⏳ Icon (type-specific)
- ⏳ Title
- ⏳ Message
- ⏳ Timestamp
- ⏳ Read/unread status
- ⏳ Deep link action
- ⏳ Mark all as read
- ⏳ Empty state

### 15.2 Help Center Screen ⏳

- ⏳ Search help articles
- ⏳ FAQ categories (accordion)
- ⏳ Contact support button (opens chat)
- ⏳ Live chat option

## Phase 16: Offline Support & Queue Management ⏳

### 16.1 Offline Banner Component ⏳

- ⏳ Shows when offline
- ⏳ "You're offline" message
- ⏳ Actionable hints
- ⏳ Dismissible

### 16.2 Action Queue Hook ⏳

- ⏳ Create `useOfflineQueue` hook
- ⏳ Queue pending actions: checkout, sendMessage
- ⏳ Persist queue to AsyncStorage
- ⏳ Replay on reconnection
- ⏳ Show status badges: Queued | Sending | Failed
- ⏳ Retry logic with exponential backoff

### 16.3 Cache Strategy ⏳

- ✅ TanStack Query for API data caching
- ✅ Configure stale times per data type
- ⏳ Cache invalidation on mutations
- ⏳ Optimistic updates for cart and chat

## Phase 17: Custom Hooks ⏳

### 17.1 Core Hooks ⏳

- ✅ `useAuth()` - access auth context
- ✅ `useCart()` - access cart context
- ✅ `useNetwork()` - check online status
- ✅ `useLocalization()` - translation and formatting
- ⏳ `useDebouncedSearch(query, delay)` - debounced search
- ⏳ `useOfflineQueue()` - queue management
- ⏳ `useVoiceSearch()` - voice input handling

## Phase 18: Common Components Library ⏳

### 18.1 Layout Components ⏳

- ⏳ `AppHeader` - sticky header with search and utilities
- ⏳ `BottomNav` - tab navigation bar
- ⏳ `ScreenContainer` - wrapper with safe areas
- ⏳ `ScrollContainer` - scrollable content with refresh

### 18.2 Product Components ⏳

- ⏳ `ProductCard` - grid/list product display
- ⏳ `ProductCardSkeleton` - loading placeholder
- ⏳ `VariantPicker` - size/color selection
- ⏳ `VendorCard` - vendor info display
- ⏳ `VendorLogo` - circular vendor avatar

### 18.3 Form Components ⏳

- ⏳ `FormInput` - text input with validation
- ⏳ `PhoneInput` - formatted phone number
- ⏳ `OTPInput` - 6-digit code input
- ⏳ `Select` - dropdown picker
- ⏳ `GeoPicker` - map-based address picker
- ⏳ `SearchBar` - search input with icons
- ⏳ `CouponInput` - promo code field

### 18.4 Feedback Components ⏳

- ⏳ `LoadingSkeleton` - content placeholder
- ⏳ `OfflineBanner` - offline indicator
- ⏳ `ErrorState` - error display with retry
- ⏳ `EmptyState` - no content display
- ⏳ `SuccessAnimation` - checkmark animation
- ⏳ `Badge` - notification badges
- ⏳ `StatusBadge` - order status indicators

### 18.5 Interactive Components ⏳

- ⏳ `BottomSheet` - modal from bottom
- ⏳ `ActionSheet` - action menu
- ⏳ `MapView` - map wrapper with markers
- ⏳ `ImageCarousel` - swipeable images
- ⏳ `VoiceWaveform` - animated waveform
- ⏳ `FAB` - floating action button (AI Cart)

## Phase 19: Voice & AI Features ⏳

### 19.1 Voice Search Implementation ⏳

- ⏳ Integrate expo-speech for text-to-speech
- ⏳ Integrate expo-av for audio recording
- ⏳ Create voice input modal
- ⏳ Animated waveform visualization:
- ⏳ Idle state: gentle pulse
- ⏳ Listening: reactive to volume
- ⏳ Processing: loading animation
- ⏳ Done: fade out
- ⏳ Convert voice to text (simulated, ready for API)
- ⏳ Execute search with voice query

### 19.2 AI Cart Suggestions ⏳

- ⏳ FAB button with glow animation
- ⏳ Modal shows bundle suggestions
- ⏳ "Based on your style" personalization
- ⏳ Mock recommendation engine
- ⏳ Add suggested items to cart

### 19.3 AI Person's Choice ⏳

- ⏳ Personalized product carousel
- ⏳ Toggle: All vs. Personalized
- ⏳ Filter based on mock user profile
- ⏳ Display reasoning: "Popular in your area"

## Phase 20: Localization & Accessibility ⏳

### 20.1 Localization Setup ✅

- ✅ Complete English translations (en.json)
- ✅ Pidgin skeleton (pidgin.json)
- ✅ Hausa skeleton (hausa.json)
- ✅ Currency formatting (NGN)
- ✅ Date/time formatting
- ✅ Number formatting with separators
- ⏳ Pluralization rules

### 20.2 Accessibility Implementation ⏳

- ⏳ Add accessibilityLabel to all interactive elements
- ⏳ Add accessibilityHint for complex actions
- ⏳ Proper accessibilityRole assignments
- ⏳ Keyboard navigation support
- ⏳ Font scaling support (allowFontScaling)
- ⏳ Color contrast compliance (WCAG AA)
- ⏳ Focus management for modals
- ⏳ Screen reader testing

## Phase 21: Testing & Quality Assurance ⏳

### 21.1 Unit Tests ⏳

- ✅ Jest configuration
- ⏳ Test contexts (Auth, Cart)
- ⏳ Test custom hooks
- ⏳ Test utility functions (validators, formatters)
- ⏳ Test adapters (mock implementations)
- ⏳ Target 70%+ coverage

### 21.2 Component Tests ⏳

- ⏳ React Native Testing Library setup
- ⏳ Test common components
- ⏳ Test form validation
- ⏳ Test user interactions
- ⏳ Snapshot tests for key screens

### 21.3 Integration Tests ⏳

- ⏳ Test complete user flows
- ⏳ Test offline queue
- ⏳ Test navigation flows
- ⏳ Test cart operations

## Phase 22: Build Configuration & DevOps ⏳

### 22.1 EAS Configuration ⏳

- ⏳ Create `eas.json` with build profiles
- ⏳ Configure development, preview, production builds
- ⏳ Set up environment variables per profile
- ⏳ Configure app icons and splash screens
- ✅ Set up app.json/app.config.js properly

### 22.2 CI/CD Setup ⏳

- ⏳ GitHub Actions workflow (or chosen platform)
- ⏳ Run linter on PR
- ⏳ Run tests on PR
- ⏳ Automated EAS builds on merge to main
- ⏳ OTA update workflow

### 22.3 Debug Tools ⏳

- ⏳ Create debug screen (`/debug`)
- ⏳ Toggle mock latency
- ⏳ Force payment success/fail
- ⏳ Clear all local storage
- ⏳ View cached data
- ⏳ Toggle feature flags
- ⏳ Environment info display

## Phase 23: Documentation & Handoff ⏳

### 23.1 Developer Documentation ⏳

- ✅ **README.md**: Project overview, setup instructions
- ⏳ Environment variables list
- ⏳ Run in mock mode: `yarn start:dev`
- ⏳ Toggle to backend: set `.env` variables
- ⏳ Build commands
- ⏳ Testing instructions
- ⏳ **Architecture documentation**
- ⏳ **Component usage examples**
- ⏳ **Adapter replacement guide**

### 23.2 Backend Handoff Documentation ⏳

- ⏳ **backend-handoff.md**:
- ⏳ Priority API endpoints
- ⏳ Request/response contracts
- ⏳ Authentication flow
- ⏳ WebSocket event specifications
- ⏳ Webhook definitions
- ⏳ Security requirements (token format, refresh)
- ⏳ Error response formats
- ⏳ **contracts/** folder with JSON schemas
- ⏳ **mock-responses/** folder with example payloads

### 23.3 API Contract Documentation ⏳

- ⏳ OpenAPI/Swagger specification
- ⏳ Endpoint documentation with examples
- ⏳ Authentication documentation
- ⏳ Error code reference
- ⏳ Webhook payload examples
- ⏳ WebSocket message formats

## Phase 24: Final Polish & Launch Prep ⏳

### 24.1 Performance Optimization ⏳

- ⏳ Image optimization and lazy loading
- ⏳ Code splitting for large screens
- ⏳ Bundle size analysis
- ⏳ Hermes engine enablement
- ⏳ Memory leak checks
- ⏳ Startup time optimization

### 24.2 Error Handling ⏳

- ⏳ Global error boundary
- ⏳ Network error handling
- ⏳ Payment failure scenarios
- ⏳ Validation error messages
- ⏳ Retry mechanisms
- ⏳ User-friendly error messages (Nigerian context)

### 24.3 Final Testing ⏳

- ⏳ Complete user flow testing
- ⏳ Offline mode testing
- ⏳ Payment flow testing (mock)
- ⏳ Voice feature testing
- ⏳ Multi-language testing
- ⏳ Device testing (various screen sizes)
- ⏳ Performance testing

### 24.4 App Store Preparation ⏳

- ⏳ App icons (all sizes)
- ⏳ Splash screens
- ⏳ Screenshots for store listing
- ⏳ App description (English, localized)
- ⏳ Privacy policy
- ⏳ Terms of service
- ⏳ Keywords and metadata

## Key Files Status

**Core Configuration** ✅:

- ✅ `App.tsx` - Root component
- ✅ `app.json` / `app.config.js` - Expo configuration
- ⏳ `eas.json` - EAS Build configuration
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `.eslintrc.js` - ESLint rules (assumed)
- ✅ `.prettierrc` - Prettier configuration (assumed)
- ⏳ `.env.development`, `.env.staging`, `.env.production` - Environment configs

**Key Implementation Files**:

- ✅ `src/navigation/AppNavigator.tsx`
- ✅ `src/contexts/AuthContext.tsx`
- ✅ `src/contexts/CartContext.tsx`
- ✅ `src/contexts/ConfigContext.tsx`
- ✅ `src/services/api.ts`
- ✅ `src/services/mocks/mockServer.ts`
- ✅ `src/theme/theme.ts`
- ✅ `src/i18n/index.ts`
- ⏳ `src/screens/home/HomeFeed.tsx` (placeholder only - PRIORITY)
- ⏳ `src/components/common/ProductCard.tsx` (PRIORITY)
- ⏳ `src/components/common/VoiceWaveform.tsx`

**Documentation**:

- ✅ `README.md`
- ⏳ `backend-handoff.md`
- ⏳ `ARCHITECTURE.md`
- ⏳ `contracts/auth.json`, `contracts/products.json`, etc.

## Progress Summary

### ✅ Completed Phases:
- **Phase 1**: Project Foundation & Configuration (95%)
- **Phase 2**: Core Infrastructure & Contexts (100%)
- **Phase 3**: API Layer & Mock Infrastructure (90%)
- **Phase 5**: Navigation Structure (95%)
- **Phase 6**: Authentication Screens (100%)
- **Phase 16**: Partial - Cache Strategy (TanStack Query configured)

### ⏳ In Progress / Next Priority:
1. **Phase 18**: Common Components Library (CRITICAL - needed for all screens)
2. **Phase 7**: Home Feed Screen (HIGH PRIORITY - main entry point)
3. **Phase 4**: Adapter Layer (needed for payments, maps, etc.)
4. **Phase 8-14**: Remaining screens (Search, Products, Cart, Orders, Wallet, Chat, Profile)

### 📊 Overall Progress: ~25% Complete

## Success Criteria Status

- ✅ App runs in mock mode without backend
- ⏳ All screens navigable and functional
- ⏳ Offline mode works with queue
- ⏳ Voice search UI responsive (simulated)
- ⏳ Homepage matches wireframe design
- ⏳ Cart and checkout flow complete
- ⏳ Order tracking with mock WebSocket
- ✅ Multi-language switching works
- ⏳ Accessibility standards met
- ⏳ Ready for EAS build
- ⏳ Documentation complete for backend handoff

