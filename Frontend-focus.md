Below is a focused, frontend-first blueprint. The app is  **customer only** . Vendor & rider flows are limited to the signup/login screens that **only** present a brief purpose screen and a “Get Vendor/Rider App” button that opens the vendor/rider app link (App Store / Play Store / web landing). No backend implementation is performed here — instead the frontend will be complete, mockable, and ready for backend teams to implement APIs later.

---

---

# 2. Core Principles for Frontend-Only App

* **Separation of concerns:** UI + client state only. All server interactions go through a single `services/api.ts` facade that defaults to mocks and supports environment switches (`MOCK=true` for local/demo).
* **Contract-first:** Provide JSON schemas for every API the frontend expects; backend can implement these later.
* **Offline resilience:** Local caching and action queueing implemented client-side so flows can be tested without a backend.
* **Pluggable integrations:** Provide adapter interfaces for Paystack, Maps, OTP provider, push notifications — adapters return mock data until real keys are provided.
* **Testable UIs:** Comprehensive unit & snapshot tests with mocked services.

---

# 3. App Scope (what the frontend will implement)

**Implemented fully in the frontend**

* Auth (phone OTP flow) — UI, OTP resend, failover UI, local mock OTP provider.
* Role selector at onboarding: Customer, Vendor, Rider. Vendor/Rider choice shows brief purpose & **single button** "Get Vendor/Rider App" → opens configured store URL.
* Home Feed (mocked data): Local Mart, Featured, Categories, Stores. go and  check @hamepage.md
* Search (client-side with demo dataset) and barcode/camera placeholder.
* Product Listing & Product Details (full UI, variants, images, reviews using mock data).
* Cart (local state) with per-item notes, coupon UI (mock validation), cost breakdown.
* Checkout flow: address selection (map pin UI with mock geocoding), delivery options, payment selection UI with Paystack adapter (mocked), order confirmation UI.
* Wallet UI (mock balance, top-up simulator).
* Orders & Order Tracking UI (mock live tracking via simulated WebSocket).
* Chat UI (mock messaging with optimistic UI and local storage for history).
* Notifications page (in-app, mocked push events).
* Profile, Settings, Address Book (client storage).
* Accessibility & localization (English, Pidgin, Hausa resource skeletons).
* Analytics hooks (Amplitude events are fired to an internal analytics adapter — no keys required).
* Monitoring hooks (Sentry adapter stub).
* Environment management (dev, staging, prod config with `ConfigurationContext`).
* CI / EAS friendly build config and README for backend wiring later.

**Not implemented in frontend**

* Real payment execution, SMS delivery, server-side verification, real WebSocket server. These are substitutable by mocks/adapters and documented contracts.

---

# 4. File & Directory Structure (frontend-ready)

```
src/
  assets/
  i18n/
    en.json
    pidgin.json
    hausa.json
  navigation/
    AppNavigator.tsx
    CustomerStack.tsx
    AuthStack.tsx
  screens/
    auth/
      Splash.tsx
      RoleSelector.tsx
      PhoneInput.tsx
      OTPVerify.tsx
      Onboarding.tsx
    home/
      HomeFeed.tsx
      Search.tsx
    product/
      ProductList.tsx
      ProductDetail.tsx
    cart/
      Cart.tsx
      CheckoutReview.tsx
      PaymentWebview.tsx
      Confirmation.tsx
    orders/
      OrdersList.tsx
      OrderDetail.tsx
      LiveTracking.tsx
    chat/
      ConversationList.tsx
      ChatWindow.tsx
    profile/
      Profile.tsx
      AddressBook.tsx
      Wallet.tsx
    misc/
      Notifications.tsx
      HelpCenter.tsx
  components/
    common/ (AppHeader, BottomNav, LoadingSkeleton, OfflineBanner)
    product/ (ProductCard, VariantPicker)
    forms/ (FormInput, Select, GeoPicker)
  contexts/
    AuthContext.tsx
    CartContext.tsx
    ConfigContext.tsx
    NetworkContext.tsx
    LocalizationContext.tsx
  services/
    api.ts             # facade: switches mocks <-> real
    mocks/
      mockServer.ts    # demo datasets + handlers
    adapters/
      paystackAdapter.ts
      mapsAdapter.ts
      otpAdapter.ts
      pushAdapter.ts
    socket.ts
  hooks/
    useDebouncedSearch.ts
    useOfflineQueue.ts
  utils/
    validators.ts
    formatters.ts
  theme/
    theme.ts
  App.tsx
```

---

# 5. Navigation & Auth UX (customer only + vendor/rider download links)

**Navigation flow (high level):**

* `App.tsx` -> `AuthResolver` reads tokens from `SecureStore`:
  * If no token -> `AuthStack`:
    * `Splash` -> `RoleSelector` -> *If Customer selected* -> `PhoneInput` -> `OTPVerify` -> `Onboarding` -> `CustomerStack`
    * *If Vendor or Rider selected* -> `RolePurposeModal` with a short description + prominent “Get Vendor/Rider App” button (opens `Linking.openURL(config.vendorAppUrl)`), and a link “Proceed as Customer” to continue.
  * If token present -> `CustomerStack` (main app)

**RolePurposeModal content (brief):**

* Title: “Vendor / Rider?”
* Short copy: “Wakanda-X customers use this app. Vendors and riders should use their dedicated apps for seller/delivery features.”
* Primary button: “Get Vendor App” (opens store link)
* Secondary: “Get Rider App” (opens rider link)
* Tertiary: “Continue as Customer”

This ensures vendor/rider are not onboarded into the customer app internally.

---

# 6. API / Data Contracts (frontend expects — contract first)

Provide backend engineers with the minimal request/response shapes used by the frontend. Frontend ships with `src/services/api.ts` exposing the functions below. When `MOCK=true`, these functions return demo data. When `MOCK=false`, they call configured endpoints using `ConfigurationContext.apiBaseUrl`.

### Example contract shapes (JSON Schema style, abbreviated)

**Auth**

* `POST /auth/request-otp`
  * Request: `{ "phone": "+2348012345678" }`
  * Response (200): `{ "otp_session_id": "string", "ttl_seconds": 300 }`
* `POST /auth/verify-otp`
  * Request: `{ "otp_session_id": "string", "code": "123456" }`
  * Response (200): `{ "access_token": "jwt", "refresh_token":"jwt", "user": { "id":"uuid", "phone":"...","name":"...","role":"customer" } }`

**Products**

* `GET /products?category=&q=&page=&lat=&lng=`
  * Response: `{ "items": [ { "id","title","price","currency","vendor_id","images":[], "variants":[], "rating": 4.5 } ], "meta": { "page":1,"total":100 } }`

**Cart**

* Client-side only: cart is maintained locally (CartContext). On checkout frontend calls `POST /orders/create` with order payload.

**Orders**

* Expected order create request shape:

```json
{
  "user_id":"uuid",
  "items":[{ "product_id":"uuid", "qty":2, "price": 1200 }],
  "delivery_address": { "lat": 11.11, "lng": 12.12, "text":"Near mosque, Damagum" },
  "payment_method":"paystack",
  "meta": { "delivery_slot":"ASAP", "instructions":"Leave with neighbour" }
}
```

* Response:

```json
{ "order_id":"uuid", "status":"pending", "total":2400, "eta":"2025-11-05T10:00:00Z" }
```

**Realtime (mocked)**

* Frontend expects a `socket` that emits `order:update` events with `{ order_id, status, eta, rider: { id, lat, lng } }`.

> All contract specifications are included as `contracts/*.json` in the repo for backend reference.

---

# 7. Mocking & Demo Mode (how the frontend runs without backend)

* `ConfigurationContext` exposes `MOCK_MODE` and `apiBaseUrl`. Default `MOCK_MODE=true` in `.env.development`.
* `services/api.ts` checks `Config.MOCK_MODE` and routes calls to `mocks/mockServer.ts`.
* `mocks/mockServer.ts` contains static JSON datasets + deterministic fake latency and simulated failures for testing failure paths.
* A debug screen (`/debug`) allows toggling network latency, forcing payment success/fail, and clearing local storage.

This ensures full UX testing end-to-end without backend availability.

---

# 8. Adapters: Pluggable external integrations

Create adapters with well-defined interfaces so backend/environment owners can plug in real keys later.

**Example: `adapters/paystackAdapter.ts`**

```ts
export interface PaystackAdapter {
  initiatePayment(orderId: string, amount: number): Promise<{ authorization_url?: string, reference?: string }>;
  verifyPayment(reference: string): Promise<{ status: 'success'|'failed', gateway_response?: string }>;
}
```

* `adapters/paystackAdapter.mock.ts` implements above with local behavior.
* `adapters/paystackAdapter.prod.ts` wraps real Paystack webview/native SDK integration.

Same pattern for Maps, OTP providers, Push.

---

# 9. Local State, Persistence & Offline (frontend implementation)

**Contexts**

* `AuthContext` — token storage in `expo-secure-store`, profile in memory, signOut method.
* `CartContext` — in-memory + persisted to `AsyncStorage`, optimistic updates.
* `NetworkContext` — NetInfo listener; exposes `isOnline`.
* `QueueManager` (hook `useOfflineQueue`) — stores pending actions (checkout, sendMessage) in persistent queue and replays when `isOnline` becomes true.

**Persistence**

* Small local DB for messages & orders: `expo-sqlite` or `@react-native-async-storage/async-storage` (for MVP). Provide abstraction `storage/*` to switch later.

**Offline UX**

* Show `OfflineBanner` with actionable hints.
* For queued actions show status badges (Queued / Sending / Failed).

---

# 10. Component Contracts & Props (example)

**`ProductCard`**

```ts
type ProductCardProps = {
  id: string;
  title: string;
  price: number;
  currency?: string;
  images?: string[];
  onAddToCart?: (productId:string) => void;
  onPress?: (productId:string) => void;
  small?: boolean;
}
```

Design all shared components with clear prop-types and documented behavior.

---

# 11. Accessibility & Localization (front-end deliverables)

* All screens include `accessibilityLabel` and `accessibilityHint`.
* Texts support `allowFontScaling`.
* i18next is configured; strings provided in `i18n/en.json`, skeletons in `pidgin.json` and `hausa.json`.
* Provide a localization switch in `Settings` for testing.

---

# 13. Security Considerations (frontend only)

* Store sensitive tokens in `expo-secure-store`.
* Avoid storing unnecessary PII on device; allow user to clear personal data.
* OTP flow uses mocked OTP provider; explain in README how to replace adapter with real SMS provider.
* All network calls via HTTPS when a real `apiBaseUrl` is set.

---

# 14. Monitoring & Analytics (frontend hooks only)

* Provide `analyticsAdapter` and `monitoringAdapter` with no-ops when no keys provided. When keys are set:
  * `analyticsAdapter.track(event, props)`
  * `monitoringAdapter.captureException(error)`
* Ship amplitude event list (names + payload shapes) to backend/analytics owners.

---

# 15. Developer & Backend Handoff Artifacts

Frontend repo ships:

* `contracts/` folder with JSON request/response schemas used by frontend.
* `mock-responses/` with demo payloads for each endpoint.
* `README.md` with:
  * How to run in mock mode: `yarn start:dev` (`MOCK=true`)
  * How to toggle to backend endpoints: set `.env` variables (`MOCK=false`, `API_BASE_URL`, `PAYSTACK_KEY`, `MAPS_KEY`, etc.)
  * How to replace adapters with production implementations.
* A `backend-handoff.md` with:
  * Priority API endpoints required for initial backend wiring (Auth, Products, Orders, Payments, Chats).
  * Example webhook definitions (order status update).
  * Realtime socket event names & payload spec.
  * Security requirements (token format, refresh policy).

This lets backend engineers implement server endpoints to the exact contracts used by the frontend.

---

# 16. Implementation Checklist (Sprint-ready)

**Sprint 0: scaffolding**

* Create project with Expo + TypeScript + ESLint + Prettier.
* Add `ConfigurationContext`, theme, i18n skeletons.
* Implement navigation & role selector flow with vendor/rider download links.

**Sprint 1: core UI**

* Home feed, product list/detail, product card components, search.
* CartContext + Cart screen + local persistence.

**Sprint 2: checkout & orders**

* CheckoutReview screen, address picker (map mock), payment selection UI with Paystack adapter mock.
* OrdersList + OrderDetail + mock live tracking.

**Sprint 3: chat & profile**

* ConversationList + ChatWindow with local storage.
* Profile, AddressBook, Wallet (mock).

**Sprint 4: polish & testing**

* Accessibility pass, localization wiring, unit tests, e2e test scaffolding, CI.

---

# 17. Example Mock Data (short sample)

**Product example**

```json
{
  "id":"prod_001",
  "title":"Groundnut Oil - 1L",
  "price":1200.00,
  "currency":"NGN",
  "vendor_id":"vend_001",
  "images":["/assets/images/oil1.jpg"],
  "variants":[{"id":"v1","label":"1L","price":1200},{"id":"v2","label":"2L","price":2200}],
  "rating":4.6
}
```

**Order example**

```json
{
  "order_id":"order_001",
  "status":"out_for_delivery",
  "eta":"2025-11-05T10:00:00Z",
  "rider": { "id":"r_01", "name":"Ibrahim", "lat":11.11, "lng":12.12 }
}
```

---
