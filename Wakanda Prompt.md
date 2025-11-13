# Wakanda -X- — Frontend Functional Requirements & Implementation

Blueprint (Customer-Only App with Expo / React Native)

---

Wakanda -X- — Frontend-Centric Functional Requirements & Implementation
Blueprint Below is a focused, frontend-first blueprint. The app is customer
only. Vendor & rider flows are limited to the signup/login and screens that
only present a brief purpose screen and a “Get Vendor/Rider App” button that
opens the vendor/rider app link (App Store / Play Store / web landing). No
backend implementation is performed here — instead the frontend will be
complete, mockable, and ready for backend teams to implement APIs later.

**Act Like:** Frontend engineers, product managers,
designers, QA.

**Assumptions:** Expo SDK (managed or bare as
needed), React Navigation (stack + bottom tabs), React Context for state,
i18next for localization, custom light/dark theme, existing modules (Main
screen, Navigation, Contexts). Use demo/placeholders where backend is required.

---

# 1. High-Level Vision & Personas

**Goal:** Build a production-quality, Expo + React Native mobile app
for customers in Nigeria. The app is fully client-side ready (UI, navigation,
contexts, offline queues, mocks, feature flags, analytics hooks, integration
adapters for Paystack/Maps/Push) and exposes clear API contracts (OpenAPI-style
shapes) for backend implementation later.

**Key constraints**

* Customer-only in-app flows. Vendors and riders do not
  use this app beyond download links.
* No direct backend logic shipped in the frontend — use
  local mocks and environment toggles to simulate server behavior.
* Ready for EAS builds, OTA updates, and continuous
  integration.

**Primary personas**

1. **Customer
   (Nigerian shopper)**

o
Needs: quick local goods, clear prices in NGN,
ability to pay with Paystack/USSD/bank transfer, simple address selection for
non-standard addresses, repeat orders, loyalty & coupons.

oDevice/Network: mid-range Android, intermittent
connectivity, limited storage.

2. **Vendor
   (store owner / merchant)**

o
After signup/login flow show brief app purpose
screen + button “Get Vendor/Rider App” which opens link (App Store/Play Store
or web landing). Customer button proceeds to signup/login flow.

**3.
****Rider / Delivery Agent**

o
After signup/login flow show brief app purpose
screen + button “Get Vendor/Rider App” which opens link (App Store/Play Store
or web landing)..

**Nigeria-specific nuances**

·
Primary currency: NGN; show 2 decimal places,
localized number separators.

·
Payment behavior: card + Paystack, USSD, bank
transfers, wallets, cash-on-delivery.

·
Addressing: many non-standard addresses
(landmarks, junctions, area names) → allow free-text + map pin + community
pickups; support "deliver to neighbor" options.

·
Connectivity: offline caching, background sync,
lightweight assets, progressive image loading.

·
Local languages: English, Pidgin, Hausa
supported via i18next. Support LTR; prepare for future RTL.

·
Regulatory: KYC for value transactions; privacy

---

# 2. Feature Matrix (Core + Advanced)

|  **Area**                     |  **Core features**                                                                                                                 |  **Advanced

| features / Notes**                                                                 |                                                            |  |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------- | - |
| Auth & Onboarding                                                                  | Splash, Signup (OTP                                        |  |
| SMS), Login (OTP), role selector (Customer/Vendor/Rider)                           | Social login (Google, Apple), biometric unlock (Face/Touch |  |
| ID)                                                                                |                                                            |  |
| Discovery                                                                          | Home feed, search (camera                                  |  |
| search icon), categories, vendor directories``go and check @hamepage.md and |                                                            |  |
| @homepage details folder                                                           | Personalized recommendations, trending, AI product         |  |
| summaries, voice search                                                            |                                                            |  |
| Product                                                                            | Product card,                                              |  |
| details, variants, reviews, related items                                          | Dynamic pricing, price negotiation for wholesalers         |  |
| Cart & Checkout                                                                    | Cart, coupon/promo,                                        |  |
| checkout review, shipping options, multiple payment methods (Paystack,             |                                                            |  |
| wallet, COD)                                                                       | Split payments, escrow for high-value orders               |  |
| Payments & Wallet                                                                  | Wallet top-up,                                             |  |
| Paystack integration, transaction history                                          | USSD flow support, bank transfer reconciliation, scheduled |  |
| auto-topups                                                                        |                                                            |  |
| Orders                                                                             | Orders list, order                                         |  |
| detail, receipts (PDF), order tracking (live)                                      | ETA prediction, scheduled deliveries, multi-stop orders    |  |
| Logistics                                                                          | Choose delivery type                                       |  |
| (pickup/delivery/rider), map-based address selection, real-time tracking           | 3PL integrations, route optimization, dynamic fees by      |  |
| distance                                                                           |                                                            |  |
| Messaging                                                                          | WhatsApp-like chat                                         |  |
| (customer ↔ vendor ↔ rider), attachments, read receipts                          | Automated bot for FAQs, templated messages for order       |  |
| updates                                                                            |                                                            |  |
| Notifications                                                                      | Push notifications                                         |  |
| (order updates, promos), in-app notifications page                                 | Actionable rich notifications (deep link)                  |  |
| Support & Trust                                                                    | Help center,                                               |  |
| returns/refunds workflow, dispute resolution, reviews moderation                   | In-app call, auto-assign support tickets                   |  |
| Security & Compliance                                                              | Encrypted secure                                           |  |
| storage, token refresh, session management                                         | Anti-fraud scoring, rate limiting, PCI guidance            |  |
| Analytics & Monitoring                                                             | Amplitude events,                                          |  |
| Sentry errors, Clarity sessions                                                    | Custom dashboards, alerting thresholds                     |  |
| Accessibility & Localization                                                       | i18next strings,                                           |  |
| large font scaling, a11y labels                                                    | TTS, voice commands, offline language packs                |  |

---

# 3. User Flows & UX Considerations

Format: step sequence + UX notes + failure paths + offline behavior.

---

## 3.1 Auth & Role Selection (Customer / Vendor / Rider)

1. **Splash**
   → checks token + environment flags.
2. If
   no token: show  **Role Selector** : Customer |
   Vendor | Rider (icons + short copy).

oIf **Vendor/Rider**
chosen → show brief app purpose screen + button “Get Vendor/Rider App” which
opens link (App Store/Play Store or web landing). Customer button proceeds to
signup/login flow.

3. **Signup
   (Customer)** : Phone number → OTP (SMS) → optional Name, Profile
   Pic, locale selection. Optionally ask for address later.
4. Post-signup:
   **Onboarding carousel** (permissions: push,
   location; benefits: quick checkout). Option to skip.

**UX notes:**

·
Use progressive disclosure: collect minimal info
to get in app; collect KYC later.

·
For OTP flows, show resend timer, retry via
voice call.

·
Biometric opt-in after first passwordless auth.

**Failure paths:** OTP fail (show resend, failover
to voice, contact support). No SMS: allow manual verification later with
support.

**Offline:** Allow read-only browsing of cached
feed; block sensitive actions (checkout) and show offline checkout queuing.

---

## 3.2 Address Selection & Non-standard Address Flow

1. **Address
   Entry** : Map pin (Google Maps) + Free-text "landmark" +
   "delivery instructions" fields + Save as Address type
   (Home/Work/Other).
2. Provide
   **Smart Suggestions** : nearest known places, last
   used addresses, or community pickup points.
3. When
   placing order, allow manual confirmation of rider-accessibility (stairs, gate
   code) and offer "Deliver to neighbor" toggle.

**Failure:** Map fails to load → fallback to text
entry with structured fields (State, LGA, Town, Landmark).

**Offline:** Allow saving address locally; mark as
unsynced until network available.

---

## 3.3 Product Browsing → Cart → Checkout

1. **Browse
   / Search** → Product detail → Add to Cart (select variant/qty).
2. **Cart** :
   list items, editable qty, per-item notes, coupon field, estimated delivery fee
   (via distance estimate).
3. **Checkout** :
   Address select or add; choose delivery slot (ASAP / schedule), choose payment
   (Wallet / Paystack / COD / USSD Bank Transfer).
4. **Paystack
   flow** : open Paystack webview/native SDK, get payment token →
   verify with backend → show confirmation screen & push notification.
5. **Order
   placed** : show order summary, ETA, track button.

**UX notes:**

·
Show cost breakdown with tax, delivery,
discounts.

·
For failed payments show clear actionable
options: retry, switch payment, contact support.

**Failure paths:**

·
Payment declined: show decline reason
(insufficient funds, network) and allow retry.

·
Vendor cancels shortly after placing order:
notify user, offer refund or alternative items.

**Offline:** allow “Checkout later” where cart is
saved and user prompted to complete when online.

---

## 3.4 Order Tracking & Delivery

1. Order
   created → vendor accepts → rider assigned → rider receiving push & in-app
   job list.
2. Live
   tracking: track rider on map, ETA updates, order status timeline (Preparing →
   Out for delivery → Delivered).
3. In-app
   actions: Contact rider (call/chat), change delivery instructions, mark as
   received.

**Failure:** GPS updates drop: show last known
location and “retry” option. Rider cancels: auto-assign next rider or offer
alternate pickup.

---

## 3.5 Chat (WhatsApp-like)

1. ConversationList
   shows threads (order pinned).
2. ChatWindow:
   messages, attachments (images/invoice), quick replies (Order status templates).
   Read receipts + typing indicator.
3. Support
   channel: escalate to support ticket with details.

**Notes:** Use optimistic UI; persist chat locally
for offline reading. Encrypt messages at rest on device.

---

## 3.6 Returns / Refunds

1. Customer
   initiates return from OrderDetail → choose item(s), reason, photos, preferred
   resolution (refund/store credit).
2. Vendor/Support
   reviews → approve → RPC to payments provider for refund (if needed) → update
   order status.

**UX:** show expected refund timeline and status.
For escrow/hold orders, indicate when funds will be disbursed.

---

# 4. Technical Architecture (Mobile)

```
App (Expo)
```

```
│
```

```
├─ UI Layer (screens, components)           -> src/screens, src/components
```

```
├─ Navigation (React Navigation: stacks + bottom tabs)
```

```
├─ State Layer (React Context + lightweight caches)
```

```
│    ├─ AuthContext
```

```
│    ├─ CartContext
```

```
│    ├─ Config/EnvironmentContext
```

```
│    ├─ NetworkContext (connectivity status / queue)
```

```
│    └─ LocalizationContext (i18next)
```

```
├─ Networking (api client)                  -> src/utils/api
```

```
│    ├─ REST / GraphQL client (axios / fetch/urql)
```

```
│    ├─ WebSocket (chat / tracking)
```

```
├─ Persistence (async-storage / secure-store)
```

```
├─ Media & Assets (expo-file-system, progressive images)
```

```
└─ Native Integrations (Paystack, Maps, Push Notifs)
```

**Key design principles**

·
Keep UI stateless where possible; derive state
from contexts.

·
Networking: centralized API client with
automatic token refresh and environment switching.

·
Caching: read-through cache for feeds, products;
invalidate on context changes.

·
Offline queue: actions like place-order, chat
send enqueued when offline and retried.

·
Background sync: periodic sync on app
open/resume.

---

# 5. Data Models, Demo SQL Schema & Example Queries

Use these as an implementation-ready blueprint. Names use snake_case for
SQL.

### Core tables (simplified)

```
-- users
```

```
CREATE TABLE users (
```

```
  id UUID PRIMARY KEY,
```

```
  phone VARCHAR NOT NULL UNIQUE,
```

```
  name VARCHAR,
```

```
  role VARCHAR CHECK (role IN ('customer','vendor','rider','admin')),
```

```
  email VARCHAR,
```

```
  profile_pic VARCHAR,
```

```
  created_at TIMESTAMP DEFAULT NOW()
```

```
);
```

```

```

```
-- vendors
```

```
CREATE TABLE vendors (
```

```
  id UUID PRIMARY KEY,
```

```
  user_id UUID REFERENCES users(id),
```

```
  shop_name VARCHAR,
```

```
  location GEOGRAPHY, -- lat/lng
```

```
  address_text TEXT,
```

```
  kyc_status VARCHAR,
```

```
  created_at TIMESTAMP DEFAULT NOW()
```

```
);
```

```

```

```
-- products
```

```
CREATE TABLE products (
```

```
  id UUID PRIMARY KEY,
```

```
  vendor_id UUID REFERENCES vendors(id),
```

```
  title VARCHAR,
```

```
  description TEXT,
```

```
  price NUMERIC(12,2),
```

```
  currency VARCHAR DEFAULT 'NGN',
```

```
  inventory INTEGER,
```

```
  images JSONB,
```

```
  variants JSONB,
```

```
  created_at TIMESTAMP DEFAULT NOW()
```

```
);
```

```

```

```
-- orders
```

```
CREATE TABLE orders (
```

```
  id UUID PRIMARY KEY,
```

```
  user_id UUID REFERENCES users(id),
```

```
  vendor_id UUID REFERENCES vendors(id),
```

```
  total NUMERIC(12,2),
```

```
  currency VARCHAR DEFAULT 'NGN',
```

```
  status VARCHAR, -- pending, accepted, preparing, out_for_delivery, delivered, cancelled, refunded
```

```
  delivery_address JSONB,
```

```
  payment_info JSONB,
```

```
  created_at TIMESTAMP DEFAULT NOW()
```

```
);
```

```

```

```
-- order_items
```

```
CREATE TABLE order_items (
```

```
  id UUID PRIMARY KEY,
```

```
  order_id UUID REFERENCES orders(id),
```

```
  product_id UUID REFERENCES products(id),
```

```
  qty INTEGER,
```

```
  price NUMERIC(12,2)
```

```
);
```

```

```

```
-- chats
```

```
CREATE TABLE chats (
```

```
  id UUID PRIMARY KEY,
```

```
  order_id UUID REFERENCES orders(id),
```

```
  participants UUID[],
```

```
  last_message TEXT,
```

```
  updated_at TIMESTAMP DEFAULT NOW()
```

```
);
```

```

```

```
-- messages
```

```
CREATE TABLE messages (
```

```
  id UUID PRIMARY KEY,
```

```
  chat_id UUID REFERENCES chats(id),
```

```
  sender_id UUID REFERENCES users(id),
```

```
  content TEXT,
```

```
  attachments JSONB,
```

```
  created_at TIMESTAMP DEFAULT NOW()
```

```
);
```

### Example REST endpoints (frontend expectations)

·
`<span>POST /auth/otp</span>` — request OTP

·
`<span>POST /auth/verify</span>` — verify OTP -> returns token, refresh_token,
user profile

·
`<span>GET /products?category=...&q=...&lat=...&lng=...</span>` —
product listing

·
`<span>GET /vendors/:id</span>` — vendor profile & catalog

·
`<span>POST /cart/checkout</span>` — create order

·
`<span>POST /payments/paystack/verify</span>` — verify payment token

·
`<span>WS /ws</span>`
— for chat and live-tracking subscriptions

---

# 6. Integrations & External Systems

·
**Payments:**
Paystack (primary). Use tokenization and server-side verification. Avoid
storing card PAN on device. Support Paystack wallet, bank transfers, USSD
flows. Provide a fallback WebView-based payment flow.

·
**Maps & Addressing:**
Google Maps SDK (Geocoding, Places Autocomplete). Fallback to manual fields
when geolocation is unavailable.

·
**Push Notifications:**
FCM via Expo push service (or native push for bare). Use deep links to open
specific order/chat screens.

·
**Chat / Realtime:**
WebSocket / socket.io or Firebase Realtime DB. Use message ack + optimistic UI.
Persist messages locally (Indexed DB / AsyncStorage).

·
**SMS/OTP:**
Third-party SMS provider (Twilio, Africa’s Talking). Support OTP fallback via
voice.

·
**Analytics / Monitoring:**
Amplitude events, Sentry for crash/error, Microsoft Clarity for session replay
(web fallback). Track key funnel events (signup, add-to-cart, checkout, payment
success/failure).

---

# 7. Component & Screen Catalog (Mapping & Guidelines)

**Directory patterns**

```
src/
```

```
  screens/
```

```
  components/
```

```
  contexts/
```

```
  services/       # API clients, socket manager
```

```
  hooks/
```

```
  utils/
```

```
  assets/
```

```
  i18n/
```

**Key screens**

·
Auth: Splash, RoleSelector, PhoneInputOTP,
Onboarding

·
Home: HomeFeed, Search, CategoryList

·
Product: ProductList, ProductDetail

·
Cart & Checkout: Cart, CheckoutReview,
PaymentFlow, Confirmation

·
Orders: OrdersList, OrderDetail, LiveTracking

·
Profile: Profile, Settings, AddressBook,
PaymentMethods, Wallet

·
Chat: ConversationList, ChatWindow

·
Vendor: VendorProfile, VendorCatalog,
VendorContact

·
Support: HelpCenter, ReturnRequest

**Reusable components**

·
`<span>AppHeader</span>`
(location + search + notifications)

·
`<span>ProductCard</span>`
(variant + quick-add)

·
`<span>VendorCard</span>`

·
`<span>Badge</span>`
(promo/stock)

·
`<span>FormInput</span>`,
`<span>Select</span>`, `<span>GeoPicker</span>`

·
`<span>BottomActionBar</span>`
(for cart quick view)

·
`<span>MapView</span>`
wrapper (with marker + clustering)

·
`<span>OfflineBanner</span>`,
`<span>LoadingSkeleton</span>`, `<span>ErrorState</span>`

**Styling & Theming**

·
Central `<span>theme.ts</span>`
for colors, spacing, typography. Use Tailwind-like utility classes optionally
via libraries. Support dark/light toggles persisted in Context.

**Component best practices**

·
Keep components small and testable.

·
Use prop-driven styles, avoid inline heavy
logic.

·
Accessibility attributes (`<span>accessibilityLabel</span>`, `<span>accessible</span>`, proper role semantics).

---

# 8. Data Management & State Strategy

**Principles**

·
Use React Context for global concerns: Auth,
Config, Cart, Localization, Network.

·
Use local cache via `<span>react-query</span>` or a lightweight cache layer
for REST to simplify stale/remote data patterns (recommended). If you prefer
minimal dependencies, implement a cache + revalidation layer in `<span>services/apiClient</span>`.

·
Use optimistic updates for cart, likes, and chat
messages.

·
Long-term persistent storage for: auth tokens
(SecureStore), cart (AsyncStorage), user settings, messages (local DB e.g.,
WatermelonDB or SQLite for large-scale data).

**Offline patterns**

·
Detect connectivity with NetInfo; switch to
offline mode.

·
Use an action queue: store pending API calls
(place-order, send-message) and replay when online. Show UI indicators for
queued actions.

·
For critical flows (payments), block until
online or show explicit queue-warn.

**Subscriptions & realtime**

·
Use WebSocket for order updates and chat.
Provide reconnection and backfill on reconnected.

---

# 9. Security, Privacy & Compliance

**Security**

·
Store tokens in SecureStore (expo-secure-store).
Do not store refresh tokens in AsyncStorage unless encrypted.

·
Use HTTPS everywhere; certificate pinning
recommended for extra security.

·
Session management: token expiration handling
and forced logout if token invalidated.

·
Input validation on client but never trust
client-only validations.

**Payments & PCI**

·
Do not transmit raw card info to backend. Use
Paystack SDK or tokenization. For card entry, use webview/native SDK supplied
by provider. Ensure server-side verification before marking order paid.

**Anti-fraud**

·
Client-side heuristics: rapid order bursts,
suspicious geolocation patterns. Send analytics events to server for scoring.

·
Implement throttles on OTP and login attempts.

**Privacy**

·
Collect minimal PII; show clear privacy policy
in onboarding. Allow data removal requests routed to support. Encrypt sensitive
PII at rest on device.

---

# 10. Testing & Monitoring Strategy

**Unit & Integration**

·
Jest + React Native Testing Library for
components and hooks.

·
Mock contexts (AuthContext, CartContext) in
tests.

**E2E**

·
Detox or Playwright for RN (with EAS devices for
CI). Test critical flows: signup, search, add-to-cart, checkout (mock payment),
order tracking.

**Performance testing**

·
Profile with React Native Performance Monitor
and Sentry performance traces. Monitor startup time, JSI interaction, large
image loads.

**Monitoring & Alerts**

·
Sentry for crashes + performance.

·
Amplitude for funnel analytics (user retention,
checkout conversion).

·
Define alert thresholds: crash rate > X% per
release, payment failure surge. Integrate Slack/email.

**Release pipeline**

·
Use GitHub Actions + EAS build (managed) for
production/beta builds. Use staged rollout and feature flags (remote config)
for gradual feature release.

---

# 11. Scalability & Performance Recommendations

·
 **Code splitting &
lazy loading** : lazy-load heavy screens (Vendor admin, reports).

·
 **Image optimization** :
serve resized images via CDN; use progressive loading.

·
 **Bundle size** :
trim unnecessary libs; use Hermes for JS performance.

·
 **OTA updates** :
Expo Updates (EAS) for bug fixes and minor UI changes; keep breaking changes
for full builds.

·
 **Caching &
pagination** : infinite scroll with server pagination; cache keys
per user/location.

·
 **Network efficiency** :
compress payloads; batch small API calls.

---

# 12. Extending Existing Modules & Refactor Suggestions

·
 **Navigation** :
centralize routes in `<span>src/navigation/index.tsx</span>`.
Add role-aware stacks: `<span>CustomerStack</span>`,
`<span>VendorRedirect</span>` (links to
vendor/rider app), `<span>RiderRedirect</span>`.
Use feature flags in `<span>ConfigurationContext</span>`
for toggles.

·
 **Contexts** :
split `<span>MainContext</span>` into
focused contexts: `<span>AuthContext</span>`,
`<span>CartContext</span>`, `<span>OrderContext</span>`, `<span>NetworkContext</span>`. Encourage use of custom
hooks: `<span>useAuth()</span>`, `<span>useCart()</span>`.

·
 **API client** :
single `<span>src/services/apiClient.ts</span>`
with interceptor for dev/staging/prod environments via `<span>ConfigurationContext</span>`.

·
 **Main screen** :
refactor into modular sections (Featured, LocalMart, Categories) and lazy-load
heavy modules.

·
 **i18n** :
store translations in `<span>src/i18n/{en,pidgin,hausa}.json</span>`
and wrap app with `<span>I18nextProvider</span>`;
lazy-load language bundles.

---

# 13. Accessibility & Localization Details

·
 **Localization** :
i18next with language detector and fallback to English. Provide keys for
gender-neutral copy. Support pluralization and number/currency formatting via `<span>Intl</span>`.

·
 **Accessibility** :
all touch targets >= 44px; proper contrast ratios; screen reader labels;
focus management for modals; large-text support via font scaling.

·
 **Voice & TTS** :
voice search via microphone; provide textual fallback for voice-only features.

---

---

# 14. Sample Events & Analytics (Amplitude) — top events to track

·
`<span>signup_completed</span>`
(role, referral_code)

·
`<span>product_viewed</span>`
(product_id, vendor_id)

·
`<span>add_to_cart</span>`
(product_id, qty)

·
`<span>checkout_initiated</span>`
(cart_total, discounts)

·
`<span>payment_success</span>`
(order_id, payment_method)

·
`<span>payment_failed</span>`
(order_id, error_code)

·
`<span>order_delivered</span>`
(order_id)

·
`<span>chat_message_sent</span>`
(chat_id, message_length, participant_role)

---

# 15. Example UX Microcopy & Error States

·
OTP resend: “Code sent. Didn’t receive it? Tap
to resend or request a call.”

·
Payment error: show provider message + “Try
another payment method or contact support.”

·
Offline: “You’re offline. Some actions are
disabled. Your cart and messages will sync when you’re back online.”

---

# 16. Developer Deliverables (what to ship in frontend repo)

·
`<span>README.md</span>`
with environment setup (dev/staging/prod), EAS build instructions, testing
commands.

·
`<span>src/navigation/*</span>`,
`<span>src/screens/*</span>`, `<span>src/components/*</span>`, `<span>src/contexts/*</span>`, `<span>src/services/*</span>`, `<span>src/i18n/*</span>`.

·
Example env files: `<span>.env.development</span>`, `<span>.env.staging</span>`,
`<span>.env.production</span>` (use
ConfigurationContext to read).

·
Mock API fixtures for staging mode and demo
flows.

·
Unit tests for core components and behaviors.

·
CI workflow: lint + unit tests + build.

---

# 18. Final Notes & Practical Recommendations

·
 **Backend contract** :
produce an API spec (OpenAPI) from backend team early—front-end relies on
stable endpoints for payments, order webhooks, and real-time updates.

·
**Use feature flags**
(remote config) for experimental features and staged rollout.

·
 **Vendor & Rider apps** :
this is solemnly customer app lightweight; vendor/rider was implemented as
separate projects with focused feature sets. The customer app should redirect
vendor/rider after sign-ins to external download links as requested.

·
 **Maintainability** :
enforce code style (ESLint + Prettier), a shared component library, and clear
PR review process.

·
 **Localization** :
get professional translations for Hausa & Pidgin; keep copy short for
better UI fit.
