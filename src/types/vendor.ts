// Vendor Domain Types
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
    legal_business_name?: string;
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

export interface KYCDocument {
    id: string;
    type: 'national_id' | 'drivers_license' | 'passport' | 'voters_card' |
    'business_reg' | 'tax_id' | 'bank_statement' | 'proof_of_address' |
    'cac_certificate' | 'tax_clearance' | 'business_license';
    url: string;
    file_name?: string;
    file_size?: number;
    status: 'pending' | 'approved' | 'rejected';
    uploaded_at: string;
    verified_at?: string;
    rejection_reason?: string;
    document_number?: string;
    expiry_date?: string;
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

export interface VendorTransaction {
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

// Vendor Product (extends base Product for vendor-specific fields)
export interface VendorProduct {
    id: string;
    vendor_id: string;
    title: string;
    description: string;
    price: number;
    compare_at_price?: number; // For discounts
    cost_price?: number; // For profit tracking
    currency: string;
    images: string[];
    video?: string;

    // Category
    category: string;
    tags: string[];

    // Inventory
    sku: string;
    barcode?: string;
    track_quantity: boolean;
    quantity: number;
    low_stock_threshold: number;
    allow_backorders: boolean;

    // Variants
    has_variants: boolean;
    variants?: ProductVariant[];

    // Shipping
    weight_kg?: number;
    dimensions?: {
        length_cm: number;
        width_cm: number;
        height_cm: number;
    };
    requires_shipping: boolean;
    is_fragile: boolean;

    // Performance
    views: number;
    sales_count: number;
    rating: number;
    review_count: number;

    // Status
    status: 'draft' | 'active' | 'inactive' | 'out_of_stock';

    // Timestamps
    created_at: string;
    updated_at: string;
}

export interface ProductVariant {
    id: string;
    label: string;
    sku?: string;
    price?: number; // Override base price
    quantity?: number;
    image?: string;
    attributes: Record<string, string>; // e.g., { color: 'Red', size: 'Large' }
}

// Vendor Order (extends base Order for vendor view)
export interface VendorOrder {
    id: string;
    order_id: string;
    customer_id: string;
    customer_name: string;
    customer_phone: string;
    customer_avatar?: string;

    items: VendorOrderItem[];

    subtotal: number;
    delivery_fee: number;
    platform_fee: number;
    total: number;
    vendor_earning: number;
    currency: string;

    status: 'new' | 'accepted' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'completed' | 'cancelled' | 'return_requested';

    delivery_address: {
        text: string;
        lat: number;
        lng: number;
        landmark?: string;
        instructions?: string;
    };

    rider?: {
        id: string;
        name: string;
        phone: string;
        photo?: string;
    };

    prep_time_minutes?: number;
    estimated_pickup_time?: string;

    decline_reason?: string;
    cancellation_reason?: string;

    created_at: string;
    updated_at: string;
    accepted_at?: string;
    completed_at?: string;
}

export interface VendorOrderItem {
    id: string;
    product_id: string;
    product_name: string;
    product_image: string;
    variant_id?: string;
    variant_label?: string;
    quantity: number;
    price: number;
    notes?: string;
}

// Analytics Types
export interface SalesAnalytics {
    period: 'today' | 'week' | 'month' | 'year';
    total_sales: number;
    total_orders: number;
    average_order_value: number;
    data_points: {
        date: string;
        sales: number;
        orders: number;
    }[];
}

export interface ProductPerformance {
    product_id: string;
    product_name: string;
    product_image: string;
    sales_count: number;
    revenue: number;
    views: number;
    conversion_rate: number;
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

export interface VendorTransaction {
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

// Vendor Product (extends base Product for vendor-specific fields)
export interface VendorProduct {
    id: string;
    vendor_id: string;
    title: string;
    description: string;
    price: number;
    compare_at_price?: number; // For discounts
    cost_price?: number; // For profit tracking
    currency: string;
    images: string[];
    video?: string;

    // Category
    category: string;
    tags: string[];

    // Inventory
    sku: string;
    barcode?: string;
    track_quantity: boolean;
    quantity: number;
    low_stock_threshold: number;
    allow_backorders: boolean;

    // Variants
    has_variants: boolean;
    variants?: ProductVariant[];

    // Shipping
    weight_kg?: number;
    dimensions?: {
        length_cm: number;
        width_cm: number;
        height_cm: number;
    };
    requires_shipping: boolean;
    is_fragile: boolean;

    // Performance
    views: number;
    sales_count: number;
    rating: number;
    review_count: number;

    // Status
    status: 'draft' | 'active' | 'inactive' | 'out_of_stock';

    // Timestamps
    created_at: string;
    updated_at: string;
}

export interface ProductVariant {
    id: string;
    label: string;
    sku?: string;
    price?: number; // Override base price
    quantity?: number;
    image?: string;
    attributes: Record<string, string>; // e.g., { color: 'Red', size: 'Large' }
}

// Vendor Order (extends base Order for vendor view)
export interface VendorOrder {
    id: string;
    order_id: string;
    customer_id: string;
    customer_name: string;
    customer_phone: string;
    customer_avatar?: string;

    items: VendorOrderItem[];

    subtotal: number;
    delivery_fee: number;
    platform_fee: number;
    total: number;
    vendor_earning: number;
    currency: string;

    status: 'new' | 'accepted' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'completed' | 'cancelled' | 'return_requested';

    delivery_address: {
        text: string;
        lat: number;
        lng: number;
        landmark?: string;
        instructions?: string;
    };

    rider?: {
        id: string;
        name: string;
        phone: string;
        photo?: string;
    };

    prep_time_minutes?: number;
    estimated_pickup_time?: string;

    decline_reason?: string;
    cancellation_reason?: string;

    created_at: string;
    updated_at: string;
    accepted_at?: string;
    completed_at?: string;
}

export interface VendorOrderItem {
    id: string;
    product_id: string;
    product_name: string;
    product_image: string;
    variant_id?: string;
    variant_label?: string;
    quantity: number;
    price: number;
    notes?: string;
}

// Analytics Types
export interface SalesAnalytics {
    period: 'today' | 'week' | 'month' | 'year';
    total_sales: number;
    total_orders: number;
    average_order_value: number;
    data_points: {
        date: string;
        sales: number;
        orders: number;
    }[];
}

export interface ProductPerformance {
    product_id: string;
    product_name: string;
    product_image: string;
    sales_count: number;
    revenue: number;
    views: number;
    conversion_rate: number;
    stock_turnover: number;
}

export interface CustomerInsights {
    total_customers: number;
    repeat_customers: number;
    repeat_rate: number;
    average_spend: number;
    top_locations: Array<{
        city: string;
        count: number;
    }>;
}

// Onboarding Types
export interface BusinessTypeData {
    business_type: 'individual' | 'business' | 'corporation';
    legal_business_name: string;
    cac_number?: string;
    tax_id?: string;
}

export interface ShopDetailsData {
    shop_name: string;
    description: string;
    categories: string[];
    business_phone: string;
    business_email: string;
    whatsapp_number?: string;
    operating_hours: OperatingHours;
    social_media?: SocialMediaLinks;
    logo_url?: string;
    cover_photo_url?: string;
}

export interface OperatingHours {
    [key: string]: {
        is_open: boolean;
        open_time?: string; // HH:mm format
        close_time?: string;
    };
}

export interface SocialMediaLinks {
    facebook?: string;
    instagram?: string;
    twitter?: string;
}

export interface LocationData {
    latitude: number;
    longitude: number;
    address_text: string;
    landmark?: string;
    street_address: string;
    city: string;
    state: string;
    postal_code?: string;
    country: string;
    delivery_areas: DeliveryArea[];
}

export interface DeliveryArea {
    type: 'radius' | 'city' | 'state';
    value: string | number; // km for radius, name for city/state
    min_order_amount?: number;
    delivery_fee?: number;
}
