Multi-Vendor Marketplace Platform - Complete Vendor System

Target Market: Nigerian E-Commerce
________________________________________
📋 Executive Summary
This document provides the complete blueprint for building the Vendor Portal within the Wakanda-X multi-vendor marketplace. It transforms the application from a single-sided consumer app into a comprehensive multi-sided marketplace where vendors can manage their entire business operations from their mobile devices.
Key Highlights:
•	Mobile-first vendor management system
•	Product browsing integrated into vendor dashboard
•	Offline-first architecture for Nigerian market
•	Multi-language support (English, Pidgin, Hausa, igbo, yoroba)
•	Enterprise-grade tools in mobile package
________________________________________
📚 Table of Contents
1.	System Analysis & Foundation
2.	Architecture & Navigation
3.	Core Features & Requirements
4.	Technical Implementation
5.	Data Models & API
6.	UI/UX Design System
7.	Integration & Security
8.	Implementation Roadmap
________________________________________
1. System Analysis & Foundation
1.1 Current State Assessment
Existing Technology Stack:
Framework: React Native + Expo SDK 54
Language: TypeScript
UI Library: React Native Paper (Material Design 3)
Navigation: React Navigation 6 (Stack + Bottom Tabs)
State: React Context + TanStack Query
Storage: expo-secure-store + AsyncStorage
API: Axios with mock/real adapter pattern
What Exists:
•	✅ Multi-role authentication (customer, vendor, rider, admin)
•	✅ Basic Vendor data model
•	✅ VendorCard, VendorLogo components
•	✅ VendorDirectory placeholder
•	✅ API contracts defined
•	✅ Offline-first architecture
•	✅ Multi-language support
What's Missing:
•	❌ Vendor dashboard and navigation
•	❌ Product management for vendors
•	❌ Order fulfillment workflow
•	❌ Financial/wallet management
•	❌ Analytics and reporting
•	❌ Vendor-customer communication
1.2 User Personas & Context
Primary Users:
•	Small to medium Nigerian merchants
•	Mid-range Android devices (3-4GB RAM)
•	Intermittent network connectivity
•	Moderate tech literacy
•	Multi-language preference
Use Cases:
1.	New vendor onboarding and KYC
2.	Daily product/inventory management
3.	Real-time order processing
4.	Financial tracking and payouts
5.	Customer communication
6.	Business performance monitoring
________________________________________
2. Architecture & Navigation
2.1 Role-Based Navigation Flow 
2.2 Vendor Navigation Structure
Bottom Tab Navigation (5 Tabs):
VendorStack (Bottom Tabs)
├── 🏠 Dashboard (Home)
│   ├── Stats cards Big Quick actions bottun (“Sell Your product”)
│   ├── Stats Overview | Total Sales (Today/Week/Month), Total Orders, Average Rating
│   ├── Product Browsing (Marketplace View) -  # Product browsing just as Customer site (you can connect with the customer  Product browsing page)
│   ├── Recent Orders
│   └── Notifications Center 
│
├── 📦 Products
│   ├── Product List (with filters)
│   ├── Add Product (FAB)
│   ├── Edit Product
│   ├── Inventory Management
│   └── Bulk Upload
│
├── 🛒 Orders
│   ├── Active Orders
│   ├── Order History
│   ├── Order Detail
│   ├── Returns/Refunds
│   └── Customer Chat Integration
│
├── 💰 Wallet (NEW - Primary Financial Tab)
│   ├── Balance Overview
│   ├── Earnings Dashboard(pending, approved)
│   ├── Transaction History
│   ├── Payout Management
│   ├── Analytics Summary
│   └── Financial Reports
│
└── 👤 Profile
    ├── Shop Profile
    ├── Business Info
    ├── Bank Settings
    ├── App Settings
    └── Support Center
Stack Screens (Pushed):
├── ProductForm (Add/Edit)
├── ProductDetail
├── OrderDetail
├── AnalyticsDetail
├── PayoutRequest
├── ChatWindow
├── SettingsDetail
└── KYCUpload
2.3 Directory Structure
src/
├── navigation/
│   ├── VendorStack.tsx              # NEW: Main vendor navigation
│   ├── types.ts                      # UPDATE: Add vendor routes
│   └── RootNavigator.tsx             # UPDATE: Add role-based switching
│
├── screens/vendor/                   # NEW: All vendor screens
│   ├── auth/
│   │   ├── VendorSignUp.tsx
│   │   ├── VendorOnboarding.tsx
│   │   └── KYCUpload.tsx
│   ├── dashboard/
│   │   ├── VendorDashboard.tsx      # Homepage with product browsing
│   │   └── components/
│   │       ├── StatsOverview.tsx
│   │       ├── ProductBrowsing.tsx   # NEW: Marketplace view for vendors
│   │       ├── QuickActions.tsx
│   │       └── RecentOrdersList.tsx
│   ├── products/
│   │   ├── ProductList.tsx
│   │   ├── ProductForm.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── InventoryManager.tsx
│   │   └── BulkUpload.tsx
│   ├── orders/
│   │   ├── OrderList.tsx
│   │   ├── OrderDetail.tsx
│   │   ├── OrderStatusUpdate.tsx
│   │   └── ReturnsList.tsx
│   ├── wallet/                       # NEW: Primary financial tab
│   │   ├── WalletDashboard.tsx
│   │   ├── EarningsOverview.tsx
│   │   ├── TransactionHistory.tsx
│   │   ├── PayoutManagement.tsx
│   │   ├── AnalyticsSummary.tsx     # Analytics moved here
│   │   └── FinancialReports.tsx
│   ├── profile/
│   │   ├── ShopProfile.tsx
│   │   ├── BusinessInfo.tsx
│   │   ├── BankSettings.tsx
│   │   └── Settings.tsx
│   └── chat/
│       └── VendorChatList.tsx
│
├── components/vendor/                # NEW: Vendor components
│   ├── StatCard.tsx
│   ├── OrderCard.tsx
│   ├── ProductCard.tsx
│   ├── WalletCard.tsx               # NEW
│   ├── TransactionItem.tsx          # NEW
│   ├── EarningsChart.tsx            # NEW
│   ├── ProductBrowser.tsx           # NEW
│   ├── InventoryAlert.tsx
│   └── QuickActionButton.tsx
│
├── contexts/
│   ├── VendorContext.tsx            # NEW: Vendor state
│   └── VendorWalletContext.tsx      # NEW: Financial state
│
├── services/
│   └── api.ts                        # UPDATE: Add vendor endpoints
│
└── types/
    └── vendor.ts                     # NEW: Vendor types
________________________________________
3. Core Features & Requirements
3.1 Authentication & Onboarding
3.1.1 Vendor Registration Flow
Step-by-Step Journey:
1. Phone Input → OTP Verification
2. Role Selection (Choose "Vendor")
3. Basic Info (Name, Email)
4. Business Type (Individual/Business/Corporation)
5. Shop Details (Name, Description, Categories)
6. Location & Address
7. KYC Upload (ID, Business Reg, Tax Docs)
9. Review & Submit
10. Admin Approval Wait
11. Dashboard Access Granted
KYC Documents Required:
•	 Valid ID (National ID, Driver's License, Int'l Passport)
•	 Business Registration (CAC for companies) (OPTIONAL)
•	 Tax ID / VAT Number(OPTIONAL)
•	 Bank Account Statement (last 3 months) (OPTIONAL)
•	 Proof of Address(OPTIONAL)
KYC Status Workflow:
Not Submitted → Pending → Under Review → Approved/Rejected
                                      ↓
                              Resubmission Required
3.2 Vendor Dashboard (Home Tab)
PRIMARY FEATURES:
3.2.1 Stats Overview Cards
┌─────────────────────────────────────┐
│ Today's Performance                  │
├─────────────────────────────────────┤
| SELL YOUR PRODUCT
|─────────────────────────────────────┤
│ ┌───────┐ ┌───────┐ ┌───────┐      │
│ │₦45.2K │ │  12   │ │ 4.8⭐ │      │
│ │ Sales │ │Orders │ │Rating │      │
│ └───────┘ └───────┘ └───────┘      │
│                                     │
│ ┌───────┐ ┌───────┐ ┌───────┐      │
│ │  156  │ │   3   │ │   8   │      │
│ │Active │ │ Low   │ │Pending│      │
│ │ Prods │ │ Stock │ │Orders │      │
│ └───────┘ └───────┘ └───────┘      │
└─────────────────────────────────────┘
3.2.2 Product Browsing Section (NEW!)
Integration with Customer Product View:
•	Display vendor's own products in marketplace layout with other tab for the market products
•	Same UI as customer product browsing
•	Grid/List view toggle
•	Quick actions for vendors product: Edit, Update Stock, View Analytics
•	Filter by: Category, Status, Stock Level
•	Sort by: Sales, Rating, Date Added
•	Search functionality
•	Purpose: Let vendors see their products as customers see them, and add other tab where he will see other prople product in the market
Sample Implementation:
// Reuse existing ProductList component with vendor context
<ProductBrowsing
  vendorId={currentVendor.id}
  isVendorView={true}
  showQuickActions={true}
  onProductPress={(product) => navigateToEdit(product)}
/>
3.2.3 Quick Actions
Large, prominent action buttons:
•	🛍️ "Sell Your Product" (Add new product)
•	📦 View All Orders
•	📊 View Analytics
•	💬 Messages
3.2.4 Recent Orders List
•	Last 5-10 orders
•	Status badges
•	Quick accept/view actions
•	Swipe gestures for actions
3.2.5 Notifications Center
•	Bell icon with badge count
•	Order alerts
•	Low stock warnings
•	Payment notifications
•	Customer messages
3.3 Products Tab
Full CRUD Operations:
3.3.1 Product List View
Features:
•	Grid (2 columns) / List toggle
•	Search bar (name, SKU)
•	Filters:
•	Category dropdown
•	Status (Active/Inactive)
•	Stock Level (In Stock/Low/Out)
•	Sort options:
•	Date Added (newest/oldest)
•	Price (low/high)
•	Sales (best-selling first)
•	Rating
•	Bulk selection mode
•	Pull-to-refresh
Product Card:
┌─────────────────────────┐
│ [Image]  Product Name   │
│          ₦12,500        │
│          Stock: 45 🟢   │
│          [⚙️] [Active]  │
└─────────────────────────┘
3.3.2 Add/Edit Product Form
Multi-Step Form:
Step 1: Basic Info
•	Product Title* (10-200 chars)
•	Description* (Rich text, 50-5000 chars)
•	Category* (Multi-level selector)
•	Tags (Keywords for search)
Step 2: Pricing
•	Base Price* (NGN)
•	Compare at Price (for discounts)
•	Cost Price (for profit tracking)
Step 3: Media
•	Image Upload (up to 10 images)
•	Drag to reorder
•	Set primary image
•	Auto-compression
•	Video Upload (optional, max 30MB)
Step 4: Inventory
•	SKU (auto-gen or manual)
•	Barcode (optional)
•	Track Quantity? (toggle)
•	Quantity Available*
•	Low Stock Alert Threshold
•	Allow Backorders? (toggle)
Step 5: Variants (Optional)
•	Add Options (Size, Color, Material)
•	Generate Variants
•	Per-variant settings:
•	Price override
•	SKU override
•	Quantity
•	Image
Step 6: Shipping
•	Weight (kg)
•	Dimensions (L x W x H cm)
•	Require Shipping? (toggle)
•	Fragile Item? (toggle)
Step 7: Review & Publish
•	Preview product card
•	SEO preview
•	Publish or Save as Draft
3.3.3 Inventory Management
Features:
•	Real-time stock tracking
•	Low stock alerts (push notifications)
•	Stock history/audit log
•	Bulk update (CSV import)
•	Restock reminders
•	Variant-level inventory
•	Stock adjustment reasons (sale, damaged, returned)
3.3.4 Bulk Operations
•	Download CSV template
•	Import products (CSV/Excel)
•	Bulk price update
•	Bulk inventory adjustment
•	Bulk activate/deactivate
•	Progress tracking for large imports
3.4 Orders Tab
Order Management Workflow:
3.4.1 Order Status Flow
AcceptDeclineNew OrderVendor ActionAcceptedCancelledPreparingReady for PickupOut for DeliveryDeliveredCompletedCancelledReturn Request
3.4.2 Order Tabs
•	🆕 New (Requires action)
•	🔄 Active (Accepted, Preparing, Ready)
•	🚚 In Transit (Out for Delivery)
•	✅ Completed (Last 30 days)
•	❌ Cancelled
•	🔙 Returns
3.4.3 Order Card Display
┌────────────────────────────────┐
│ ORD-12345        [New 🔴]      │
│ John Doe         2 items        │
│ ₦25,400          2h ago         │
│ [Accept] [View] [Contact]      │
└────────────────────────────────┘
3.4.4 Order Detail Screen
Sections:
1.	Status Timeline
●─────●─────○─────○─────○
New  Accept Ready  Ship  Deliver
2.	Customer Info
•	Name, Phone, Avatar
•	Delivery Address (map preview)
•	Special Instructions
•	Contact Buttons: 📞 Call | 💬 Chat | WhatsApp
3.	Order Items
•	Product images
•	Variant details
•	Quantities
•	Prices
•	Item notes
•	Delivery agent
4.	Pricing Breakdown
Subtotal:          ₦20,000
Delivery Fee:       ₦2,000
Platform Fee (5%):  ₦1,000
─────────────────────────
Total:            ₦23,000
Your Earning:     ₦19,000
5.	Actions
•	Accept Order (if New)
•	Decline Order (with reason)
•	Update Status
•	Adjust Prep Time (15, 30, 45, 60 mins)
•	Print Invoice
•	Contact Customer
•	Contact Rider
•	Report Issue
3.4.5 Push Notifications
Real-time alerts:
•	🔔 New order received (sound + vibration)
•	⚠️ Order cancelled by customer
•	🚴 Rider assigned
•	✅ Order delivered
•	⭐ Customer review submitted
•	🔙 Return request
Notification Settings:
•	Enable/disable by type
•	Sound on/off
•	Vibration on/off
•	Quiet hours (e.g., 10 PM - 7 AM)
3.5 Wallet Tab (PRIMARY FINANCIAL TAB)
3.5.1 Wallet Dashboard
Balance Card:
┌─────────────────────────────────┐
│ Available Balance                │
│ ₦156,750.00                      │
│ [Request Payout]                 │
│                                  │
│ Pending:    ₦ 45,200.00          │
│ Next Payout: Nov 27 (Monday)     │
└─────────────────────────────────┘
Quick Stats:
•	Today's Earnings
•	This Week's Revenue
•	This Month's Total
•	Total Lifetime Earnings
3.5.2 Earnings Overview
Revenue Breakdown:
┌─────────────────────────────────┐
│ Earnings This Month              │
│ ┌─────────────────────────────┐ │
│ │    [Sales Chart]            │ │
│ └─────────────────────────────┘ │
│                                  │
│ Gross Sales:      ₦320,500.00   │
│ Platform Fees:    -₦16,025.00   │
│ Transaction Fees:  -₦3,205.00   │
│ ──────────────────────────────  │
│ Net Earnings:     ₦301,270.00   │
└─────────────────────────────────┘
Charts:
•	Sales trend (daily/weekly/monthly)
•	Revenue vs Expenses
•	Top-selling products
•	Peak sales times
3.5.3 Transaction History
Transaction List:
┌────────────────────────────────┐
│ Nov 23, 10:30 AM               │
│ Order #ORD-12345               │
│ + ₦12,500.00           [View]  │
├────────────────────────────────┤
│ Nov 23, 09:15 AM               │
│ Payout to Bank ****3456        │
│ - ₦50,000.00           [View]  │
└────────────────────────────────┘
Filters:
•	Date range
•	Transaction type (Sales, Payouts, Refunds, Fees)
•	Status (Completed, Pending, Failed)
Transaction Details:
•	Transaction ID
•	Type & Category
•	Amount
•	Status
•	Fee breakdown
•	Related order
•	Receipt download
3.5.4 Payout Management
Payout Request:
┌─────────────────────────────────┐
│ Request Payout                   │
│                                  │
│ Available: ₦156,750.00           │
│                                  │
│ Amount: [₦ ___________]          │
│                                  │
│ Bank: GTBank ****3456            │
│ [Change]                         │
│                                  │
│ Processing Time: immediate and instance time- │
│ days                             │
│                                  │
│ [Request Payout]                 │
└─────────────────────────────────┘
Payout History:
•	Date requested
•	Amount
•	Bank account
•	Status (Pending/Processing/Completed/Failed)
•	Receipt download
3.5.5 Analytics Summary (Moved from separate tab)
Key Metrics:
•	Sales overview (daily/weekly/monthly)
•	Order analytics
•	Total orders
•	Acceptance rate
•	Avg fulfillment time
•	Cancellation rate
•	Product performance
•	Best sellers (top 10)
•	Worst performers
•	Stock turnover
•	Customer insights
•	Total customers
•	Repeat rate
•	Avg spend
•	Location heatmap
3.5.6 Financial Reports
Available Reports:
•	Daily Sales Summary
•	Weekly Performance
•	Monthly Financial Statement
•	Quarterly Report
•	Tax Summary
•	Fee Breakdown
Export Options:
•	PDF format
•	CSV/Excel format
•	Email delivery
•	Scheduled reports (auto-email)
Custom Reports:
•	Date range selector
•	Metric selection
•	Chart type preference
•	Report scheduling
3.6 Profile Tab
3.6.1 Shop Profile
Editable Fields:
•	Shop Name*
•	Shop Logo (square, 512x512px)
•	Cover Banner (1200x400px)
•	Business Description (max 500 chars)
•	Business Categories (multi-select)
•	Operating Hours
•	Set for each day
•	Mark closed days
•	Special hours (holidays)
•	Contact Information
•	Phone
•	Email
•	WhatsApp Business
•	Social Media Links
•	Facebook
•	Instagram
•	Twitter
•	Physical Store Address
•	Service/Delivery Areas
•	Select cities/states
•	Min order amount per zone
3.6.2 Business Information
•	Legal Business Name
•	Business Registration Number (CAC)
•	Tax ID / VAT Number
•	Business Type (Individual/LLC/Corporation)
•	KYC Documents
•	View uploaded docs
•	Re-upload if rejected
•	Verification status
3.6.3 Bank & Payment Settings
Bank Account:
┌─────────────────────────────────┐
│ Primary Bank Account             │
│                                  │
│ Bank: GTBank                     │
│ Account: 0123456789              │
│ Name: Shop Name Ltd              │
│ BVN: ••••••••89                  │
│ Status: Verified ✓               │
│                                  │
│ [Change Bank Account]            │
└─────────────────────────────────┘
Payout Preferences:
•	Auto-payout enabled?
•	Payout schedule
•	Minimum payout amount
3.6.4 Policies
•	Return Policy
•	Shipping Policy
•	Terms of Service
•	Privacy Policy
3.6.5 App Settings
•	Language (English/Pidgin/Hausa)
•	Dark Mode toggle
•	Currency format
•	Date/Time format
•	Units (Metric/Imperial)
•	Notification Preferences
•	Order alerts
•	Payment alerts
•	Low stock alerts
•	Marketing updates
•	Platform news
•	Printer Settings (for receipts)
•	Barcode Scanner toggle
3.6.6 Support Center
•	Help Articles/FAQs
•	Video Tutorials
•	Contact Support
•	In-app chat
•	Email
•	Phone
•	Report a Problem
•	Feature Requests
•	Platform Updates
________________________________________
4. Technical Implementation
4.1 Frontend Architecture
4.1.1 State Management
VendorContext:
// src/contexts/VendorContext.tsx
interface VendorContextType {
  vendor: Vendor | null;
  shop: Shop | null;
  stats: VendorStats | null;
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  refreshVendor: () => Promise<void>;
  updateShop: (data: Partial<Shop>) => Promise<void>;
  updateBankDetails: (bank: BankDetails) => Promise<void>;
}
const VendorContext = createContext<VendorContextType>({} as VendorContextType);
export const VendorProvider: React.FC = ({ children }) => {
  const { user } = useAuth();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  
  // Implementation...
  
  return (
    <VendorContext.Provider value={/* ... */}>
      {children}
    </VendorContext.Provider>
  );
};
export const useVendor = () => useContext(VendorContext);
VendorWalletContext (NEW):
// src/contexts/VendorWalletContext.tsx
interface VendorWalletContextType {
  balance: number;
  pendingBalance: number;
  transactions: Transaction[];
  payouts: Payout[];
  
  // Actions
  requestPayout: (amount: number) => Promise<void>;
  refreshWallet: () => Promise<void>;
  getTransactionHistory: (filters: TransactionFilters) => Promise<Transaction[]>;
}
4.1.2 TanStack Query Integration
// Vendor-specific query keys
export const vendorKeys = {
  all: ['vendor'] as const,
  vendor: (id: string) => ['vendor', id] as const,
  shop: (id: string) => ['vendor', id, 'shop'] as const,
  products: (id: string, filters?: ProductFilters) => 
    ['vendor', id, 'products', filters] as const,
  orders: (id: string, status?: OrderStatus) => 
    ['vendor', id, 'orders', status] as const,
  wallet: (id: string) => ['vendor', id, 'wallet'] as const,
  transactions: (id: string, filters?: TransactionFilters) =>
    ['vendor', id, 'transactions', filters] as const,
  analytics: (id: string, range: DateRange) => 
    ['vendor', id, 'analytics', range] as const,
};
// Usage example
const useVendorProducts = (vendorId: string) => {
  return useQuery({
    queryKey: vendorKeys.products(vendorId),
    queryFn: () => api.vendor.products.list(vendorId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
4.1.3 Offline Support
Offline Capabilities:
// AsyncStorage keys
const VENDOR_STORAGE = {
  PROFILE: '@vendor:profile',
  PRODUCTS: '@vendor:products',
  ACTIVE_ORDERS: '@vendor:activeOrders',
  WALLET: '@vendor:wallet',
  OFFLINE_QUEUE: '@vendor:offlineQueue',
};
// Offline queue for actions
interface OfflineAction {
  id: string;
  type: 'UPDATE_ORDER_STATUS' | 'ADD_PRODUCT' | 'UPDATE_INVENTORY';
  payload: any;
  timestamp: number;
  retryCount: number;
}
// Process queue when online
const processOfflineQueue = async () => {
  const queue = await getOfflineQueue();
  for (const action of queue) {
    try {
      await executeAction(action);
      await removeFromQueue(action.id);
    } catch (error) {
      if (action.retryCount < 3) {
        await incrementRetryCount(action.id);
      }
    }
  }
};
4.1.4 Real-Time Updates (WebSocket)
// Vendor socket events
enum VendorSocketEvents {
  NEW_ORDER = 'vendor:new_order',
  ORDER_CANCELLED = 'vendor:order_cancelled',
  ORDER_DELIVERED = 'vendor:order_delivered',
  RIDER_ASSIGNED = 'vendor:rider_assigned',
  NEW_REVIEW = 'vendor:new_review',
  PAYOUT_PROCESSED = 'vendor:payout_processed',
  PAYOUT_FAILED = 'vendor:payout_failed',
  LOW_STOCK = 'vendor:low_stock',
  MESSAGE_RECEIVED = 'vendor:message_received',
}
// Socket listener setup
useEffect(() => {
  if (!vendor) return;
  
  socket.on(VendorSocketEvents.NEW_ORDER, handleNewOrder);
  socket.on(VendorSocketEvents.PAYOUT_PROCESSED, handlePayoutSuccess);
  socket.on(VendorSocketEvents.LOW_STOCK, handleLowStockAlert);
  
  return () => {
    socket.off(VendorSocketEvents.NEW_ORDER);
    socket.off(VendorSocketEvents.PAYOUT_PROCESSED);
    socket.off(VendorSocketEvents.LOW_STOCK);
  };
}, [vendor]);
________________________________________
5. Data Models & API
5.1 Extended Type Definitions
// src/types/vendor.ts
export interface Vendor {
  // Core fields
  id: string;
  user_id: string;
  shop_name: string;
  shop_slug: string;
  description: string;
  
  // Location
  location?: {
    lat: number;
    lng: number;
  };
  address_text: string;
  
  // Media
  logo?: string;
  cover_image?: string;
  
  // Business info
  business_type: 'individual' | 'business' | 'corporation';
  business_email: string;
  business_phone: string;
  business_registration?: string;
  tax_id?: string;
  vat_number?: string;
  
  // Categories
  category_ids: string[];
  
  // KYC
  kyc_status: 'not_submitted' | 'pending' | 'under_review' | 'approved' | 'rejected';
  kyc_documents?: KYCDocument[];
  kyc_rejection_reason?: string;
  
  // Financial
  bank_account?: BankDetails;
  payout_schedule: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'manual';
  commission_rate: number; // Platform commission %
  
  // Settings
  operating_hours: BusinessHours[];
  service_areas: ServiceArea[];
  shop_policies: {
    return_policy?: string;
    shipping_policy?: string;
    terms?: string;
  };
  
  // Stats
  rating: number;
  review_count: number;
  total_orders: number;
  total_sales: number;
  
  // Status
  is_active: boolean;
  is_verified: boolean;
  is_featured: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}
export interface BankDetails {
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  account_type: 'savings' | 'current';
  bvn?: string;
  verified: boolean;
  verified_at?: string;
}
export interface BusinessHours {
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday = 0
  open_time: string; // "09:00"
  close_time: string; // "18:00"
  is_closed: boolean;
}
export interface ServiceArea {
  state: string;
  city: string;
  delivery_fee: number;
  min_order_amount: number;
  max_delivery_time_hours: number;
}
export interface VendorStats {
  // Today
  today_sales: number;
  today_orders: number;
  
  // Overall
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_revenue: number;
  total_products: number;
  active_products: number;
  low_stock_products: number;
  
  // Performance
  average_rating: number;
  response_rate: number;
  fulfillment_rate: number;
  average_prep_time_minutes: number;
}
export interface VendorWallet {
  vendor_id: string;
  balance: number; // Available for withdrawal
  pending_balance: number; // From recent orders
  lifetime_earnings: number;
  total_withdrawn: number;
  currency: string; // NGN
}
export interface Transaction {
  id: string;
  vendor_id: string;
  type: 'sale' | 'payout' | 'refund' | 'fee' | 'adjustment';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  related_order_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}
export interface Payout {
  id: string;
  vendor_id: string;
  amount: number;
  fee: number;
  net_amount: number;
  bank_details: BankDetails;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  reference: string;
  failure_reason?: string;
  requested_at: string;
  processed_at?: string;
}
5.2 Complete API Endpoints
Base URL: /api/v1/vendor
Authentication & Onboarding
POST   /auth/register           - Register new vendor
POST   /auth/login              - Vendor login (phone OTP)
POST   /auth/verify-otp         - Verify OTP
POST   /kyc/upload              - Upload KYC documents
GET    /kyc/status              - Get KYC status
PUT    /kyc/resubmit            - Resubmit rejected KYC
Vendor Profile
GET    /me                      - Get vendor profile
PUT    /me                      - Update vendor profile
PUT    /shop                    - Update shop details
PUT    /bank                    - Update bank details
PUT    /settings                - Update app settings
PUT    /operating-hours         - Update business hours
PUT    /service-areas           - Update delivery zones
Products
GET    /products                - List vendor's products
POST   /products                - Create product
GET    /products/:id            - Get product details
PUT    /products/:id            - Update product
DELETE /products/:id            - Delete product
PATCH  /products/:id/status     - Toggle active status
PUT    /products/:id/inventory  - Update stock
POST   /products/bulk           - Bulk create/update (CSV)
POST   /products/:id/images     - Upload images
DELETE /products/:id/images/:imageId - Delete image
GET    /products/low-stock      - Get low stock alerts
Orders
GET    /orders                  - List orders (with filters)
GET    /orders/:id              - Get order details
POST   /orders/:id/accept       - Accept order
POST   /orders/:id/decline      - Decline order (with reason)
PUT    /orders/:id/status       - Update order status
PUT    /orders/:id/prep-time    - Update prep time
POST   /orders/:id/issue        - Report issue
GET    /orders/stats            - Get order statistics
POST   /orders/:id/receipt      - Generate receipt PDF
Wallet & Finance (NEW - Primary)
GET    /wallet                  - Get wallet balance
GET    /wallet/transactions     - Transaction history (with filters)
GET    /wallet/transactions/:id - Transaction details
POST   /wallet/payout/request   - Request payout
GET    /wallet/payouts          - Payout history
GET    /wallet/payouts/:id      - Payout details
PUT    /wallet/payout-schedule  - Update auto-payout settings
GET    /wallet/analytics        - Financial analytics
GET    /wallet/reports          - Generate financial report
POST   /wallet/reports/export   - Export report (PDF/CSV)
Analytics (Consolidated in Wallet)
GET    /analytics/dashboard     - Dashboard summary
GET    /analytics/sales         - Sales analytics
GET    /analytics/products      - Product performance
GET    /analytics/customers     - Customer insights
GET    /analytics/revenue       - Revenue trends
Communication
GET    /chats                   - List customer chats
GET    /chats/:id               - Get chat messages
POST   /chats/:id/messages      - Send message
PUT    /chats/:id/read          - Mark as read
Notifications
GET    /notifications           - List notifications
PUT    /notifications/:id/read  - Mark as read
PUT    /notifications/read-all  - Mark all as read
PUT    /notifications/settings  - Update preferences
Reviews
GET    /reviews                 - List all reviews
GET    /reviews/:id             - Get review details
POST   /reviews/:id/response    - Respond to review
POST   /reviews/:id/flag        - Flag inappropriate review
________________________________________
6. UI/UX Design System
6.1 Design Principles
1.	Mobile-First: Optimized for one-hand operation
2.	Speed: Common tasks within 2 taps
3.	Clarity: Visual hierarchy, clear CTAs
4.	Offline-Ready: Graceful degradation
5.	Accessible: WCAG 2.1 AA compliance
6.	Consistent: Material Design 3
6.2 Color System
const VendorColors = {
  // Status colors
  orderNew: '#2196F3',      // Blue
  orderActive: '#FF9800',   // Orange
  orderReady: '#4CAF50',    // Green
  orderComplete: '#9E9E9E', // Grey
  orderCancelled: '#F44336',// Red
  
  // Stock colors
  inStock: '#4CAF50',
  lowStock: '#FF9800',
  outOfStock: '#F44336',
  
  // Financial colors
  earnings: '#4CAF50',
  expenses: '#F44336',
  pending: '#FF9800',
  
  // Wallet specific
  walletPrimary: '#1E88E5',
  walletSecondary: '#43A047',
};
6.3 Component Specifications
StatCard
<StatCard
  icon="shopping-bag"
  title="Total Sales"
  value="₦45,200"
  change="+12%"
  changeType="positive"
  onPress={() => navigation.navigate('Analytics')}
/>
OrderCard
<OrderCard
  order={order}
  onAccept={() => acceptOrder(order.id)}
  onView={() => viewOrder(order.id)}
  onContact={() => contactCustomer(order.customer_id)}
/>
TransactionItem (NEW)
<TransactionItem
  type="sale"
  amount={12500}
  description="Order #ORD-12345"
  timestamp={new Date()}
  status="completed"
  onPress={() => viewTransaction(id)}
/>

6.4 Screen Wireframes
Dashboard Screen (with Product Browsing)
├─────────────────────────────────┤
│ 📦 Main Marketplace tab | Your Products (Marketplace)  tab│
│ [Grid] [List]    [🔍 Search]    │
│ ┌────────┐ ┌────────┐           │
│ │ [Img]  │ │ [Img]  │           │
│ │Product1│ │Product2│           │
│ │₦2,500  │ │₦5,000  │           │
│ │buy │ │⚙️ Edit │           │
│ └────────┘ └────────┘           │
Wallet Dashboard 
┌─────────────────────────────────┐
│ 💰 Wallet                 [⚙️]  │
├─────────────────────────────────┤
│ Available Balance                │
│ ₦156,750.00                      │
│ [Request Payout]                 │
│ Pending: ₦45,200.00              │
├─────────────────────────────────┤
│ 📊 This Month's Earnings         │
│ ┌─────────────────────────────┐ │
│ │    [Sales Chart]            │ │
│ └─────────────────────────────┘ │
│ Gross: ₦320K | Net: ₦301K       │
├─────────────────────────────────┤
│ 📋 Recent Transactions           │
│ ┌─────────────────────────────┐ │
│ │ + ₦12,500  Order #001  [→] │ │
│ │ - ₦50,000  Payout      [→] │ │
│ └─────────────────────────────┘ │
│                                  │
│ [View All] [Reports] [Analytics]│
└─────────────────────────────────┘
________________________________________
7. Integration & Security
7.1 Shared Services Integration
Reuse from Customer App:
•	AuthContext (extend for vendor role)
•	API client (add vendor endpoints)
•	Chat service
•	Theme system
•	Localization (i18n)
•	Offline queue
•	Image picker/uploader
•	Form components
7.2 External Integrations
Payment (Paystack):
•	Vendor payout processing
•	Split payment configuration
•	Transaction verification
•	Webhook handlers
Cloud Storage:
•	Product image uploads (Cloudinary/AWS S3)
•	KYC document storage
•	Report PDF generation
Notifications:
•	Expo Push Notifications
•	SMS (Termii for Nigeria)
•	Email (SendGrid)
7.3 Security Requirements
Authentication:
•	Role-based access control (RBAC)
•	Secure token storage (expo-secure-store)
•	Token refresh mechanism
•	Session management
Data Protection:
•	Encryption at rest (sensitive data)
•	HTTPS/TLS 1.3 in transit
•	BVN encryption
•	PII minimization
Nigerian Compliance:
•	CAC registration verification
•	Tax ID validation
•	BVN verification (bank account)
•	NDPR compliance (data protection)
•	NITDA guidelines adherence
Fraud Prevention:
•	KYC mandatory before activation
•	Suspicious activity monitoring
•	Rate limiting on sensitive actions
•	30-day payout hold for new vendors
________________________________________
10. FAQs & Decision Points
Business Model Questions
Q2: Payout schedule?
•	Immediate and instance payment
Q3: Are there listing fees?
•	Recommendation: No listing fees (free to list)
•	Optional: Featured listing (₦5,000/month)
Q4: KYC approval SLA?
•	Recommendation: 24-48 hours for manual review
•	Auto-approve for verified businesses (CAC check)
Q5: Product approval required?
•	Recommendation: Auto-approve for category whitelists
•	Manual review for restricted categories (food, health)
Q6: Vendor can decline orders?
•	Yes, but impacts rating if >10% decline rate
•	Valid reasons: Out of stock, location issue
Q7: Return/refund - vendor or platform managed?
•	Platform-managed (better customer experience)
•	Vendor liability for defective products
________________________________________
11. Glossary
•	CAC: Corporate Affairs Commission (Nigeria)
•	BVN: Bank Verification Number (Nigeria)
•	KYC: Know Your Customer
•	SKU: Stock Keeping Unit
•	GMV: Gross Merchandise Value
•	FAB: Floating Action Button
•	OTP: One-Time Password
•	NDPR: Nigerian Data Protection Regulation
________________________________________
12. Conclusion & Next Steps

✅ Complete technical specifications
✅ Nigerian market considerations
✅ Mobile-first design principles
✅ Offline-capable architecture

Immediate Next Steps:
1.	Technical Setup
•	Create VendorStack navigation
•	Set up type definitions
•	Configure demo backend endpoints
2.	Design Phase
•	Create high-fidelity mockups
•	Design component library
•	Create clickable prototype
3.	Development Kickoff
Ready to start implementation? Let's build! 🚀

