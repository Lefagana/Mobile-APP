import {
    Vendor,
    VendorStats,
    VendorWallet,
    VendorTransaction,
    Payout,
    VendorProduct,
    VendorOrder,
    BankDetails,
    BusinessHours,
    ServiceArea,
    KYCDocument,
    SalesAnalytics,
    ProductPerformance,
    CustomerInsights,
} from '../../types/vendor';

// Mock Vendor Profiles (Extended with full vendor details)
export const mockVendors: Vendor[] = [
    {
        id: 'vend_001',
        user_id: 'user_v001',
        shop_name: 'LocalMart Pro',
        shop_slug: 'localmart-pro',
        description: 'Your one-stop shop for fresh groceries and household items. We deliver quality products across Abuja.',
        location: { lat: 9.0765, lng: 7.3986 },
        address_text: 'Wuse Market, Abuja',
        logo: 'https://ui-avatars.com/api/?name=LocalMart+Pro&background=4CAF50&color=fff',
        cover_image: 'https://source.unsplash.com/1200x400?grocery,store',

        business_type: 'business',
        business_email: 'contact@localmartpro.ng',
        business_phone: '+2348012345678',
        business_registration: 'RC1234567',
        tax_id: 'TIN-1234567890',

        category_ids: ['groceries', 'household'],

        kyc_status: 'approved',
        kyc_documents: [
            {
                id: 'kyc_001',
                type: 'national_id',
                url: 'https://example.com/kyc/id_001.jpg',
                status: 'approved',
                uploaded_at: '2024-01-15T10:00:00Z',
                verified_at: '2024-01-16T14:30:00Z',
            },
            {
                id: 'kyc_002',
                type: 'business_reg',
                url: 'https://example.com/kyc/business_001.pdf',
                status: 'approved',
                uploaded_at: '2024-01-15T10:05:00Z',
                verified_at: '2024-01-16T14:30:00Z',
            },
        ],

        bank_account: {
            bank_name: 'GTBank',
            bank_code: '058',
            account_number: '0123456789',
            account_name: 'LocalMart Pro Ltd',
            account_type: 'current',
            bvn: '22334455667',
            verified: true,
            verified_at: '2024-01-17T09:00:00Z',
        },
        payout_schedule: 'manual',
        commission_rate: 5,

        operating_hours: [
            { day: 1, open_time: '08:00', close_time: '20:00', is_closed: false },
            { day: 2, open_time: '08:00', close_time: '20:00', is_closed: false },
            { day: 3, open_time: '08:00', close_time: '20:00', is_closed: false },
            { day: 4, open_time: '08:00', close_time: '20:00', is_closed: false },
            { day: 5, open_time: '08:00', close_time: '20:00', is_closed: false },
            { day: 6, open_time: '09:00', close_time: '18:00', is_closed: false },
            { day: 0, open_time: '10:00', close_time: '16:00', is_closed: false },
        ],

        service_areas: [
            {
                state: 'FCT',
                city: 'Abuja',
                delivery_fee: 1500,
                min_order_amount: 5000,
                max_delivery_time_hours: 2,
            },
            {
                state: 'Niger',
                city: 'Suleja',
                delivery_fee: 2500,
                min_order_amount: 10000,
                max_delivery_time_hours: 4,
            },
        ],

        shop_policies: {
            return_policy: '7-day return policy for unopened items. Perishables cannot be returned.',
            shipping_policy: 'Free delivery for orders above ₦20,000 within Abuja.',
            terms: 'All prices are subject to change. We reserve the right to cancel orders.',
        },

        rating: 4.8,
        review_count: 342,
        total_orders: 1567,
        total_sales: 12450000,

        is_active: true,
        is_verified: true,
        is_featured: true,

        created_at: '2023-06-01T00:00:00Z',
        updated_at: '2024-11-20T15:30:00Z',
    },
    {
        id: 'vend_002',
        user_id: 'user_v002',
        shop_name: 'TechHub Nigeria',
        shop_slug: 'techhub-nigeria',
        description: 'Premium electronics and gadgets. Authorized dealer for Samsung, Apple, and more.',
        location: { lat: 6.5244, lng: 3.3792 },
        address_text: 'Computer Village, Ikeja, Lagos',
        logo: 'https://ui-avatars.com/api/?name=TechHub+Nigeria&background=2196F3&color=fff',
        cover_image: 'https://source.unsplash.com/1200x400?electronics,gadgets',

        business_type: 'business',
        business_email: 'info@techhub.ng',
        business_phone: '+2348098765432',
        business_registration: 'RC7654321',
        tax_id: 'TIN-9876543210',

        category_ids: ['electronics', 'gadgets'],

        kyc_status: 'approved',
        kyc_documents: [
            {
                id: 'kyc_003',
                type: 'national_id',
                url: 'https://example.com/kyc/id_002.jpg',
                status: 'approved',
                uploaded_at: '2023-09-10T11:00:00Z',
                verified_at: '2023-09-11T10:00:00Z',
            },
        ],

        bank_account: {
            bank_name: 'Access Bank',
            bank_code: '044',
            account_number: '9876543210',
            account_name: 'TechHub Nigeria Ltd',
            account_type: 'current',
            verified: true,
            verified_at: '2023-09-12T08:00:00Z',
        },
        payout_schedule: 'manual',
        commission_rate: 5,

        operating_hours: [
            { day: 1, open_time: '09:00', close_time: '19:00', is_closed: false },
            { day: 2, open_time: '09:00', close_time: '19:00', is_closed: false },
            { day: 3, open_time: '09:00', close_time: '19:00', is_closed: false },
            { day: 4, open_time: '09:00', close_time: '19:00', is_closed: false },
            { day: 5, open_time: '09:00', close_time: '19:00', is_closed: false },
            { day: 6, open_time: '10:00', close_time: '17:00', is_closed: false },
            { day: 0, open_time: '', close_time: '', is_closed: true },
        ],

        service_areas: [
            {
                state: 'Lagos',
                city: 'Ikeja',
                delivery_fee: 2000,
                min_order_amount: 10000,
                max_delivery_time_hours: 24,
            },
            {
                state: 'Lagos',
                city: 'Victoria Island',
                delivery_fee: 3000,
                min_order_amount: 15000,
                max_delivery_time_hours: 24,
            },
        ],

        shop_policies: {
            return_policy: '14-day return policy with original packaging. Warranty available on all electronics.',
            shipping_policy: 'Same-day delivery available in Ikeja. Next-day delivery for other Lagos areas.',
            terms: 'All products are genuine and come with manufacturer warranty.',
        },

        rating: 4.7,
        review_count: 189,
        total_orders: 892,
        total_sales: 45600000,

        is_active: true,
        is_verified: true,
        is_featured: true,

        created_at: '2023-09-01T00:00:00Z',
        updated_at: '2024-11-22T12:00:00Z',
    },
    // Vendor with pending KYC
    {
        id: 'vend_003',
        user_id: 'user_v003',
        shop_name: 'Fashionista Boutique',
        shop_slug: 'fashionista-boutique',
        description: 'Trendy African fashion and accessories. Custom tailoring available.',
        location: { lat: 6.5244, lng: 3.3792 },
        address_text: 'Yaba Market, Lagos',
        logo: 'https://ui-avatars.com/api/?name=Fashionista+Boutique&background=E91E63&color=fff',

        business_type: 'individual',
        business_email: 'fashionista@example.com',
        business_phone: '+2347012345678',

        category_ids: ['fashion', 'clothing'],

        kyc_status: 'under_review',
        kyc_documents: [
            {
                id: 'kyc_004',
                type: 'national_id',
                url: 'https://example.com/kyc/id_003.jpg',
                status: 'pending',
                uploaded_at: '2024-11-20T14:00:00Z',
            },
        ],

        payout_schedule: 'manual',
        commission_rate: 7,

        operating_hours: [
            { day: 1, open_time: '10:00', close_time: '18:00', is_closed: false },
            { day: 2, open_time: '10:00', close_time: '18:00', is_closed: false },
            { day: 3, open_time: '10:00', close_time: '18:00', is_closed: false },
            { day: 4, open_time: '10:00', close_time: '18:00', is_closed: false },
            { day: 5, open_time: '10:00', close_time: '18:00', is_closed: false },
            { day: 6, open_time: '10:00', close_time: '16:00', is_closed: false },
            { day: 0, open_time: '', close_time: '', is_closed: true },
        ],

        service_areas: [
            {
                state: 'Lagos',
                city: 'Yaba',
                delivery_fee: 1500,
                min_order_amount: 5000,
                max_delivery_time_hours: 3,
            },
        ],

        shop_policies: {
            return_policy: 'No returns on custom-tailored items. 3-day return for ready-made items.',
        },

        rating: 4.9,
        review_count: 78,
        total_orders: 156,
        total_sales: 2340000,

        is_active: false,
        is_verified: false,
        is_featured: false,

        created_at: '2024-11-15T00:00:00Z',
        updated_at: '2024-11-20T14:00:00Z',
    },
];

// Demo vendor stats for LocalMart Pro (vend_001)
export const mockVendorStats: VendorStats = {
    today_sales: 45200,
    today_orders: 12,

    total_orders: 1567,
    pending_orders: 8,
    completed_orders: 1489,
    total_revenue: 12450000,
    total_products: 156,
    active_products: 148,
    low_stock_products: 3,

    average_rating: 4.8,
    response_rate: 98.5,
    fulfillment_rate: 95.2,
    average_prep_time_minutes: 25,
};

// Demo wallet for LocalMart Pro
export const mockVendorWallet: VendorWallet = {
    vendor_id: 'vend_001',
    balance: 156750.00,
    pending_balance: 45200.00,
    lifetime_earnings: 11827500.00,
    total_withdrawn: 10000000.00,
    currency: 'NGN',
};

// Demo transactions
export const mockVendorTransactions: VendorTransaction[] = [
    {
        id: 'txn_001',
        vendor_id: 'vend_001',
        type: 'sale',
        amount: 12500.00,
        description: 'Order #ORD-12345 - Groundnut Oil 1L x 10',
        status: 'completed',
        reference: 'TXN-20241124-001',
        related_order_id: 'order_001',
        created_at: '2024-11-24T10:30:00Z',
    },
    {
        id: 'txn_002',
        vendor_id: 'vend_001',
        type: 'payout',
        amount: -50000.00,
        description: 'Payout to GTBank ****6789',
        status: 'completed',
        reference: 'PAYOUT-20241123-001',
        created_at: '2024-11-23T09:15:00Z',
    },
    {
        id: 'txn_003',
        vendor_id: 'vend_001',
        type: 'fee',
        amount: -625.00,
        description: 'Platform fee (5%) - Order #ORD-12345',
        status: 'completed',
        related_order_id: 'order_001',
        created_at: '2024-11-24T10:30:00Z',
    },
    {
        id: 'txn_004',
        vendor_id: 'vend_001',
        type: 'sale',
        amount: 8500.00,
        description: 'Order #ORD-12346 - Rice 50kg x 17',
        status: 'completed',
        reference: 'TXN-20241124-002',
        related_order_id: 'order_002',
        created_at: '2024-11-24T11:45:00Z',
    },
    {
        id: 'txn_005',
        vendor_id: 'vend_001',
        type: 'refund',
        amount: -3200.00,
        description: 'Refund - Order #ORD-12290',
        status: 'completed',
        related_order_id: 'order_290',
        created_at: '2024-11-23T16:20:00Z',
    },
    {
        id: 'txn_006',
        vendor_id: 'vend_001',
        type: 'sale',
        amount: 24300.00,
        description: 'Order #ORD-12347 - Palm Oil 5L x 6',
        status: 'pending',
        reference: 'TXN-20241124-003',
        related_order_id: 'order_003',
        created_at: '2024-11-24T14:15:00Z',
    },
];

// Demo payouts
export const mockPayouts: Payout[] = [
    {
        id: 'payout_001',
        vendor_id: 'vend_001',
        amount: 50000.00,
        fee: 100.00,
        net_amount: 49900.00,
        bank_details: {
            bank_name: 'GTBank',
            bank_code: '058',
            account_number: '0123456789',
            account_name: 'LocalMart Pro Ltd',
            account_type: 'current',
            verified: true,
        },
        status: 'completed',
        reference: 'PAYOUT-20241123-001',
        requested_at: '2024-11-23T08:00:00Z',
        processed_at: '2024-11-23T09:15:00Z',
    },
    {
        id: 'payout_002',
        vendor_id: 'vend_001',
        amount: 75000.00,
        fee: 150.00,
        net_amount: 74850.00,
        bank_details: {
            bank_name: 'GTBank',
            bank_code: '058',
            account_number: '0123456789',
            account_name: 'LocalMart Pro Ltd',
            account_type: 'current',
            verified: true,
        },
        status: 'completed',
        reference: 'PAYOUT-20241120-001',
        requested_at: '2024-11-20T10:00:00Z',
        processed_at: '2024-11-20T11:30:00Z',
    },
    {
        id: 'payout_003',
        vendor_id: 'vend_001',
        amount: 100000.00,
        fee: 200.00,
        net_amount: 99800.00,
        bank_details: {
            bank_name: 'GTBank',
            bank_code: '058',
            account_number: '0123456789',
            account_name: 'LocalMart Pro Ltd',
            account_type: 'current',
            verified: true,
        },
        status: 'processing',
        reference: 'PAYOUT-20241124-001',
        requested_at: '2024-11-24T07:00:00Z',
    },
];

// Demo vendor products
export const mockVendorProducts: VendorProduct[] = [
    {
        id: 'prod_v001',
        vendor_id: 'vend_001',
        title: 'Groundnut Oil - 1L',
        description: 'Premium quality groundnut oil, locally produced in Northern Nigeria. 100% pure with no additives.',
        price: 1200.00,
        currency: 'NGN',
        images: [
            'https://source.unsplash.com/600x600?groundnut,oil',
            'https://source.unsplash.com/600x600?cooking,oil',
        ],

        category: 'groceries',
        tags: ['oil', 'cooking', 'groundnut', 'kitchen'],

        sku: 'GMO-1L-001',
        track_quantity: true,
        quantity: 85,
        low_stock_threshold: 20,
        allow_backorders: false,

        has_variants: false,

        requires_shipping: true,
        weight_kg: 1.1,
        dimensions: { length_cm: 10, width_cm: 10, height_cm: 25 },
        is_fragile: true,

        views: 456,
        sales_count: 234,
        rating: 4.7,
        review_count: 89,

        status: 'active',

        created_at: '2024-01-10T00:00:00Z',
        updated_at: '2024-11-20T15:00:00Z',
    },
    {
        id: 'prod_v002',
        vendor_id: 'vend_001',
        title: 'Rice 50kg - Ofada',
        description: 'Local Ofada rice, freshly harvested. Perfect for special occasions and jollof rice.',
        price: 42000.00,
        compare_at_price: 45000.00,
        cost_price: 38000.00,
        currency: 'NGN',
        images: [
            'https://source.unsplash.com/600x600?rice,bag',
        ],

        category: 'groceries',
        tags: ['rice', 'ofada', 'local', 'grain'],

        sku: 'RICE-OFADA-50KG',
        track_quantity: true,
        quantity: 15,
        low_stock_threshold: 10,
        allow_backorders: true,

        has_variants: false,

        requires_shipping: true,
        weight_kg: 50,
        dimensions: { length_cm: 60, width_cm: 40, height_cm: 15 },
        is_fragile: false,

        views: 789,
        sales_count: 145,
        rating: 4.8,
        review_count: 67,

        status: 'active',

        created_at: '2024-02-15T00:00:00Z',
        updated_at: '2024-11-22T10:00:00Z',
    },
    {
        id: 'prod_v003',
        vendor_id: 'vend_001',
        title: 'Palm Oil - 5 Litres',
        description: 'Pure red palm oil from the best plantations. Rich in vitamins and perfect for Nigerian soups.',
        price: 4500.00,
        currency: 'NGN',
        images: [
            'https://source.unsplash.com/600x600?palm,oil',
        ],

        category: 'groceries',
        tags: ['palm oil', 'cooking oil', 'red oil'],

        sku: 'PALM-OIL-5L',
        track_quantity: true,
        quantity: 8,
        low_stock_threshold: 15,
        allow_backorders: false,

        has_variants: false,

        requires_shipping: true,
        weight_kg: 5.5,
        is_fragile: true,

        views: 234,
        sales_count: 89,
        rating: 4.6,
        review_count: 34,

        status: 'active',

        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-11-23T14:30:00Z',
    },
    {
        id: 'prod_v004',
        vendor_id: 'vend_001',
        title: 'Beans - Brown (Olotu) 5kg',
        description: 'Premium brown beans, perfect for moin moin and akara. Well cleaned and sorted.',
        price: 3200.00,
        currency: 'NGN',
        images: [
            'https://source.unsplash.com/600x600?beans,brown',
        ],

        category: 'groceries',
        tags: ['beans', 'brown beans', 'olotu', 'protein'],

        sku: 'BEANS-BROWN-5KG',
        track_quantity: true,
        quantity: 45,
        low_stock_threshold: 20,
        allow_backorders: true,

        has_variants: false,

        requires_shipping: true,
        weight_kg: 5,

        views: 345,
        sales_count: 123,
        rating: 4.5,
        review_count: 56,

        status: 'active',

        created_at: '2024-04-10T00:00:00Z',
        updated_at: '2024-11-21T09:00:00Z',
    },
    {
        id: 'prod_v005',
        vendor_id: 'vend_001',
        title: 'Garri - White (10kg)',
        description: 'Fine white garri from cassava. Perfect for eba and soaking.',
        price: 2800.00,
        currency: 'NGN',
        images: [
            'https://source.unsplash.com/600x600?cassava,garri',
        ],

        category: 'groceries',
        tags: ['garri', 'cassava', 'white garri', 'carbohydrate'],

        sku: 'GARRI-WHITE-10KG',
        track_quantity: false,
        quantity: 0,
        low_stock_threshold: 0,
        allow_backorders: true,

        has_variants: false,

        requires_shipping: true,
        weight_kg: 10,

        views: 567,
        sales_count: 234,
        rating: 4.7,
        review_count: 112,

        status: 'active',

        created_at: '2024-05-05T00:00:00Z',
        updated_at: '2024-11-24T08:00:00Z',
    },
    // Draft product
    {
        id: 'prod_v006',
        vendor_id: 'vend_001',
        title: 'Honey - Pure (500ml)',
        description: 'Pure organic honey from Nigerian bees. No additives or preservatives.',
        price: 3500.00,
        currency: 'NGN',
        images: [],

        category: 'groceries',
        tags: ['honey', 'organic', 'pure honey'],

        sku: 'HONEY-PURE-500ML',
        track_quantity: true,
        quantity: 0,
        low_stock_threshold: 10,
        allow_backorders: false,

        has_variants: false,
        requires_shipping: true,

        views: 0,
        sales_count: 0,
        rating: 0,
        review_count: 0,

        status: 'draft',

        created_at: '2024-11-24T12:00:00Z',
        updated_at: '2024-11-24T12:00:00Z',
    },
];

// Demo vendor orders
export const mockVendorOrders: VendorOrder[] = [
    {
        id: 'order_001',
        order_id: 'ORD-12345',
        customer_id: 'user_001',
        customer_name: 'Ibrahim Musa',
        customer_phone: '+2348012345678',
        customer_avatar: 'https://ui-avatars.com/api/?name=Ibrahim+Musa',

        items: [
            {
                id: 'item_001',
                product_id: 'prod_v001',
                product_name: 'Groundnut Oil - 1L',
                product_image: 'https://source.unsplash.com/600x600?groundnut,oil',
                quantity: 10,
                price: 1200.00,
            },
            {
                id: 'item_002',
                product_id: 'prod_v004',
                product_name: 'Beans - Brown (Olotu) 5kg',
                product_image: 'https://source.unsplash.com/600x600?beans,brown',
                quantity: 1,
                price: 3200.00,
            },
        ],

        subtotal: 15200.00,
        delivery_fee: 1500.00,
        platform_fee: 760.00,
        total: 16700.00,
        vendor_earning: 14440.00,
        currency: 'NGN',

        status: 'new',

        delivery_address: {
            text: '12 Wuse Zone 4, Abuja',
            lat: 9.0765,
            lng: 7.3986,
            landmark: 'Near Shoprite',
            instructions: 'Please call when you arrive',
        },

        created_at: '2024-11-24T14:30:00Z',
        updated_at: '2024-11-24T14:30:00Z',
    },
    {
        id: 'order_002',
        order_id: 'ORD-12346',
        customer_id: 'user_002',
        customer_name: 'Amina Hassan',
        customer_phone: '+2348023456789',

        items: [
            {
                id: 'item_003',
                product_id: 'prod_v002',
                product_name: 'Rice 50kg - Ofada',
                product_image: 'https://source.unsplash.com/600x600?rice,bag',
                quantity: 2,
                price: 42000.00,
                notes: 'Please ensure the bags are well sealed',
            },
        ],

        subtotal: 84000.00,
        delivery_fee: 2500.00,
        platform_fee: 4200.00,
        total: 86500.00,
        vendor_earning: 79800.00,
        currency: 'NGN',

        status: 'accepted',
        prep_time_minutes: 30,
        estimated_pickup_time: '2024-11-24T16:30:00Z',

        delivery_address: {
            text: '45 Gwarinpa Housing Estate, Abuja',
            lat: 9.1128,
            lng: 7.4110,
        },

        rider: {
            id: 'rider_001',
            name: 'Chukwudi Okafor',
            phone: '+2348034567890',
        },

        created_at: '2024-11-24T13:00:00Z',
        updated_at: '2024-11-24T14:00:00Z',
        accepted_at: '2024-11-24T13:15:00Z',
    },
    {
        id: 'order_003',
        order_id: 'ORD-12347',
        customer_id: 'user_003',
        customer_name: 'Fatima Bello',
        customer_phone: '+2348045678901',

        items: [
            {
                id: 'item_004',
                product_id: 'prod_v003',
                product_name: 'Palm Oil - 5 Litres',
                product_image: 'https://source.unsplash.com/600x600?palm,oil',
                quantity: 3,
                price: 4500.00,
            },
            {
                id: 'item_005',
                product_id: 'prod_v005',
                product_name: 'Garri - White (10kg)',
                product_image: 'https://source.unsplash.com/600x600?cassava,garri',
                quantity: 4,
                price: 2800.00,
            },
        ],

        subtotal: 24700.00,
        delivery_fee: 1500.00,
        platform_fee: 1235.00,
        total: 26200.00,
        vendor_earning: 23465.00,
        currency: 'NGN',

        status: 'preparing',
        prep_time_minutes: 25,

        delivery_address: {
            text: 'Kubwa Village, Abuja',
            lat: 9.0092,
            lng: 7.3454,
        },

        rider: {
            id: 'rider_002',
            name: 'Mohammed Sani',
            phone: '+2348056789012',
        },

        created_at: '2024-11-24T12:00:00Z',
        updated_at: '2024-11-24T14:15:00Z',
        accepted_at: '2024-11-24T12:10:00Z',
    },
    {
        id: 'order_004',
        order_id: 'ORD-12320',
        customer_id: 'user_004',
        customer_name: 'John Obi',
        customer_phone: '+2348067890123',

        items: [
            {
                id: 'item_006',
                product_id: 'prod_v001',
                product_name: 'Groundnut Oil - 1L',
                product_image: 'https://source.unsplash.com/600x600?groundnut,oil',
                quantity: 5,
                price: 1200.00,
            },
        ],

        subtotal: 6000.00,
        delivery_fee: 1500.00,
        platform_fee: 300.00,
        total: 7500.00,
        vendor_earning: 5700.00,
        currency: 'NGN',

        status: 'completed',

        delivery_address: {
            text: 'Maitama District, Abuja',
            lat: 9.0820,
            lng: 7.4870,
        },

        created_at: '2024-11-22T10:00:00Z',
        updated_at: '2024-11-22T15:30:00Z',
        accepted_at: '2024-11-22T10:05:00Z',
        completed_at: '2024-11-22T13:45:00Z',
    },
];

// Demo analytics data
export const mockSalesAnalytics: SalesAnalytics = {
    period: 'week',
    total_sales: 286500,
    total_orders: 45,
    average_order_value: 6367,
    data_points: [
        { date: '2024-11-18', sales: 32400, orders: 6 },
        { date: '2024-11-19', sales: 45600, orders: 8 },
        { date: '2024-11-20', sales: 38900, orders: 7 },
        { date: '2024-11-21', sales: 52300, orders: 9 },
        { date: '2024-11-22', sales: 48700, orders: 8 },
        { date: '2024-11-23', sales: 36200, orders: 5 },
        { date: '2024-11-24', sales: 32400, orders: 2 },
    ],
};

export const mockProductPerformance: ProductPerformance[] = [
    {
        product_id: 'prod_v001',
        product_name: 'Groundnut Oil - 1L',
        product_image: 'https://source.unsplash.com/600x600?groundnut,oil',
        sales_count: 234,
        revenue: 280800,
        views: 456,
        conversion_rate: 51.3,
        stock_turnover: 2.8,
    },
    {
        product_id: 'prod_v005',
        product_name: 'Garri - White (10kg)',
        product_image: 'https://source.unsplash.com/600x600?cassava,garri',
        sales_count: 234,
        revenue: 655200,
        views: 567,
        conversion_rate: 41.3,
        stock_turnover: 3.2,
    },
    {
        product_id: 'prod_v002',
        product_name: 'Rice 50kg - Ofada',
        product_image: 'https://source.unsplash.com/600x600?rice,bag',
        sales_count: 145,
        revenue: 6090000,
        views: 789,
        conversion_rate: 18.4,
        stock_turnover: 9.7,
    },
];

export const mockCustomerInsights: CustomerInsights = {
    total_customers: 842,
    repeat_customer_rate: 34.5,
    average_spend: 8934,
    top_locations: [
        { city: 'Abuja', state: 'FCT', order_count: 456 },
        { city: 'Suleja', state: 'Niger', order_count: 123 },
        { city: 'Kuje', state: 'FCT', order_count: 89 },
    ],
};
