import { Product, Vendor, Order, User, CreateOrderRequest, CreateOrderResponse, AuthResponse, ProductListResponse, PaymentInitiateResponse, PaymentVerifyResponse, Wallet, WalletTransaction, Chat, Message, Notification, ProductReview, ReviewListResponse } from '../../types';
import { mockVendorProducts as vendorProducts, mockVendors as vendorMockData } from './vendorMockData';
import { VendorProduct } from '../../types/vendor';


// Simulated delay
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Users
const mockUsers: User[] = [
  {
    id: 'user_001',
    phone: '+2348012345678',
    name: 'Ibrahim Musa',
    email: 'ibrahim@example.com',
    role: 'customer',
    profile_pic: undefined,
  },
  {
    id: 'user_002',
    phone: '+2348023456789',
    name: 'Amina Hassan',
    email: 'amina@example.com',
    role: 'customer',
  },
  {
    id: 'user_v001',
    phone: '+2349011111111',
    name: 'Oluwaseun Adeyemi',
    email: 'seun@localmartpro.ng',
    role: 'vendor',
    profile_pic: 'https://ui-avatars.com/api/?name=Oluwaseun+Adeyemi&background=4CAF50&color=fff',
  },
];

// Mock Vendors
const mockVendors: Vendor[] = [
  {
    id: 'vend_001',
    user_id: 'user_v001',
    shop_name: 'LocalMart Pro',
    location: { lat: 9.0765, lng: 7.3986 }, // Abuja coordinates
    address_text: 'Wuse Market, Abuja',
    logo: undefined,
    rating: 4.6,
  },
  {
    id: 'vend_002',
    user_id: 'user_v002',
    shop_name: 'Health Store NG',
    location: { lat: 6.5244, lng: 3.3792 }, // Lagos coordinates
    address_text: 'Ikeja, Lagos',
    rating: 4.8,
  },
  {
    id: 'vend_003',
    user_id: 'user_v003',
    shop_name: 'Fashion Hub',
    location: { lat: 11.7469, lng: 11.9668 }, // Kano coordinates
    address_text: 'Sabon Gari, Kano',
    rating: 4.5,
  },
  {
    id: 'vend_004',
    user_id: 'user_v004',
    shop_name: 'TechZone Nigeria',
    location: { lat: 6.4541, lng: 3.3947 }, // Lagos Island
    address_text: 'Computer Village, Ikeja',
    rating: 4.7,
  },
  {
    id: 'vend_005',
    user_id: 'user_v005',
    shop_name: 'Kids Paradise',
    location: { lat: 6.5244, lng: 3.3792 }, // Lagos
    address_text: 'Surulere, Lagos',
    rating: 4.6,
  },
  {
    id: 'vend_006',
    user_id: 'user_v006',
    shop_name: 'Shoe Palace',
    location: { lat: 9.0765, lng: 7.3986 }, // Abuja
    address_text: 'Garki Area 1, Abuja',
    rating: 4.4,
  },
  {
    id: 'vend_007',
    user_id: 'user_v007',
    shop_name: 'Ankara World',
    location: { lat: 6.5244, lng: 3.3792 }, // Lagos
    address_text: 'Balogun Market, Lagos',
    rating: 4.9,
  },
  {
    id: 'vend_008',
    user_id: 'user_v008',
    shop_name: 'Gadget Express',
    location: { lat: 6.4541, lng: 3.3947 }, // Lagos
    address_text: 'Victoria Island, Lagos',
    rating: 4.8,
  },
];

// Helper function to convert VendorProduct to Product format
const convertVendorProductToProduct = (vendorProduct: VendorProduct): Product => {
  const vendor = vendorMockData.find(v => v.id === vendorProduct.vendor_id);

  return {
    id: vendorProduct.id,
    title: vendorProduct.title,
    name: vendorProduct.title,
    description: vendorProduct.description,
    price: vendorProduct.price,
    currency: vendorProduct.currency || 'NGN',
    vendor_id: vendorProduct.vendor_id,
    vendor_name: vendor?.shop_name || 'Unknown Vendor',
    vendor: vendor ? {
      id: vendor.id,
      user_id: vendor.user_id,
      shop_name: vendor.shop_name,
      location: vendor.location,
      address_text: vendor.address_text,
      rating: vendor.rating,
      logo: vendor.logo,
    } : undefined,
    images: vendorProduct.images || [],
    image_url: vendorProduct.images?.[0] || '',
    variants: vendorProduct.variants?.map(v => ({
      id: v.id,
      label: v.label,
      price: v.price || vendorProduct.price,
    })),
    rating: vendorProduct.rating || 4.5,
    review_count: vendorProduct.sales_count || 0,
    category: vendorProduct.category,
    inventory: vendorProduct.track_quantity ? vendorProduct.quantity : 999,
    is_low_price: false,
  };
};

// Mock Products - Nigerian market items (includes vendor products)
const mockProducts: Product[] = [
  ...vendorProducts.map(convertVendorProductToProduct),

  {
    id: 'prod_001',
    title: 'Groundnut Oil - 1L',
    name: 'Groundnut Oil - 1L',
    description: 'Premium quality groundnut oil, locally produced',
    price: 1200.00,
    currency: 'NGN',
    vendor_id: 'vend_001',
    vendor_name: 'LocalMart Pro',
    vendor: mockVendors[0],
    images: ['https://source.unsplash.com/featured/600x600?groundnut%20oil,bottle'],
    image_url: 'https://source.unsplash.com/featured/600x600?groundnut%20oil,bottle',
    variants: [
      { id: 'v1', label: '1L', price: 1200 },
      { id: 'v2', label: '2L', price: 2200 },
      { id: 'v3', label: '5L', price: 5500 },
    ],
    rating: 4.6,
    review_count: 245,
    category: 'groceries',
    inventory: 50,
    is_low_price: true,
  },
  {
    id: 'prod_002',
    title: 'Rice - 10kg Bag',
    name: 'Rice - 10kg Bag',
    description: 'Premium long grain rice, perfect for jollof',
    price: 8500.00,
    currency: 'NGN',
    vendor_id: 'vend_001',
    vendor_name: 'LocalMart Pro',
    vendor: mockVendors[0],
    images: ['https://source.unsplash.com/featured/600x600?rice%20bag,10kg'],
    image_url: 'https://source.unsplash.com/featured/600x600?rice%20bag,10kg',
    rating: 4.7,
    review_count: 189,
    category: 'groceries',
    inventory: 30,
  },
  {
    id: 'prod_003',
    title: 'Ankara Dress - Blue Pattern',
    name: 'Ankara Dress - Blue Pattern',
    description: 'Beautiful Ankara print dress, perfect for any occasion',
    price: 15000.00,
    currency: 'NGN',
    vendor_id: 'vend_003',
    vendor_name: 'Fashion Hub',
    vendor: mockVendors[2],
    images: ['https://source.unsplash.com/featured/600x600?ankara%20dress,african%20print'],
    image_url: 'https://source.unsplash.com/featured/600x600?ankara%20dress,african%20print',
    variants: [
      { id: 'v1', label: 'Small', price: 15000 },
      { id: 'v2', label: 'Medium', price: 15000 },
      { id: 'v3', label: 'Large', price: 16000 },
      { id: 'v4', label: 'XL', price: 17000 },
    ],
    rating: 4.5,
    review_count: 92,
    category: 'fashion',
    inventory: 25,
  },
  {
    id: 'prod_004',
    title: 'Samsung Galaxy A14',
    name: 'Samsung Galaxy A14',
    description: 'Latest smartphone with 64GB storage',
    price: 95000.00,
    currency: 'NGN',
    vendor_id: 'vend_004',
    vendor_name: 'TechZone Nigeria',
    vendor: mockVendors[3],
    images: ['https://source.unsplash.com/featured/600x600?samsung%20smartphone,galaxy'],
    image_url: 'https://source.unsplash.com/featured/600x600?samsung%20smartphone,galaxy',
    rating: 4.8,
    review_count: 156,
    category: 'electronics',
    inventory: 15,
  },
  {
    id: 'prod_005',
    title: "Children's School Uniform Set",
    name: "Children's School Uniform Set",
    description: 'Complete uniform set for primary school',
    price: 8500.00,
    currency: 'NGN',
    vendor_id: 'vend_005',
    vendor_name: 'Kids Paradise',
    vendor: mockVendors[4],
    images: ['https://source.unsplash.com/featured/600x600?school%20uniform,children'],
    image_url: 'https://source.unsplash.com/featured/600x600?school%20uniform,children',
    variants: [
      { id: 'v1', label: 'Size 6', price: 8500 },
      { id: 'v2', label: 'Size 8', price: 9000 },
      { id: 'v3', label: 'Size 10', price: 9500 },
    ],
    rating: 4.4,
    review_count: 67,
    category: 'kids',
    inventory: 40,
    is_low_price: true,
  },
  {
    id: 'prod_006',
    title: 'Leather Sandals - Brown',
    name: 'Leather Sandals - Brown',
    description: 'Comfortable leather sandals, handcrafted',
    price: 12000.00,
    currency: 'NGN',
    vendor_id: 'vend_006',
    vendor_name: 'Shoe Palace',
    vendor: mockVendors[5],
    images: ['https://source.unsplash.com/featured/600x600?leather%20sandals,brown'],
    image_url: 'https://source.unsplash.com/featured/600x600?leather%20sandals,brown',
    variants: [
      { id: 'v1', label: 'Size 40', price: 12000 },
      { id: 'v2', label: 'Size 42', price: 12000 },
      { id: 'v3', label: 'Size 44', price: 12500 },
    ],
    rating: 4.6,
    review_count: 134,
    category: 'shoes',
    inventory: 35,
  },
  {
    id: 'prod_007',
    title: 'Palm Oil - 2L',
    name: 'Palm Oil - 2L',
    description: 'Pure red palm oil, locally sourced',
    price: 1800.00,
    currency: 'NGN',
    vendor_id: 'vend_001',
    vendor_name: 'LocalMart Pro',
    vendor: mockVendors[0],
    images: ['https://source.unsplash.com/featured/600x600?palm%20oil,bottle'],
    image_url: 'https://source.unsplash.com/featured/600x600?palm%20oil,bottle',
    rating: 4.5,
    review_count: 203,
    category: 'groceries',
    inventory: 45,
    is_low_price: true,
  },
  {
    id: 'prod_008',
    title: 'Wireless Bluetooth Headphones',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality sound, long battery life',
    price: 15000.00,
    currency: 'NGN',
    vendor_id: 'vend_004',
    vendor_name: 'TechZone Nigeria',
    vendor: mockVendors[3],
    images: ['https://source.unsplash.com/featured/600x600?bluetooth%20headphones,product'],
    image_url: 'https://source.unsplash.com/featured/600x600?bluetooth%20headphones,product',
    rating: 4.7,
    review_count: 278,
    category: 'electronics',
    inventory: 20,
  },
  // Additional Products for Homepage
  // Fashion Products
  {
    id: 'prod_009',
    title: 'Ankara Two-Piece - Green',
    name: 'Ankara Two-Piece - Green',
    description: 'Elegant Ankara two-piece set for special occasions',
    price: 25000.00,
    currency: 'NGN',
    vendor_id: 'vend_007',
    vendor_name: 'Ankara World',
    vendor: mockVendors[6],
    images: ['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=600&fit=crop'],
    image_url: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=600&fit=crop',
    variants: [
      { id: 'v1', label: 'Small', price: 25000 },
      { id: 'v2', label: 'Medium', price: 25000 },
      { id: 'v3', label: 'Large', price: 26000 },
    ],
    rating: 4.9,
    review_count: 156,
    category: 'fashion',
    inventory: 20,
  },
  {
    id: 'prod_010',
    title: 'African Print Shirt - Men',
    name: 'African Print Shirt - Men',
    description: 'Stylish African print shirt for men',
    price: 12000.00,
    currency: 'NGN',
    vendor_id: 'vend_007',
    vendor_name: 'Ankara World',
    vendor: mockVendors[6],
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=600&fit=crop'],
    image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=600&fit=crop',
    variants: [
      { id: 'v1', label: 'Small', price: 12000 },
      { id: 'v2', label: 'Medium', price: 12000 },
      { id: 'v3', label: 'Large', price: 13000 },
    ],
    rating: 4.7,
    review_count: 98,
    category: 'fashion',
    inventory: 30,
  },
  // Electronics
  {
    id: 'prod_011',
    title: 'iPhone 13 - 128GB',
    name: 'iPhone 13 - 128GB',
    description: 'Latest iPhone 13 with 128GB storage',
    price: 450000.00,
    currency: 'NGN',
    vendor_id: 'vend_008',
    vendor_name: 'Gadget Express',
    vendor: mockVendors[7],
    images: ['https://images.unsplash.com/photo-1632633173522-c8d0a8a26a14?w=600&h=600&fit=crop'],
    image_url: 'https://images.unsplash.com/photo-1632633173522-c8d0a8a26a14?w=600&h=600&fit=crop',
    rating: 4.9,
    review_count: 234,
    category: 'electronics',
    inventory: 10,
  },
  {
    id: 'prod_012',
    title: 'Sony Headphones WH-1000XM4',
    name: 'Sony Headphones WH-1000XM4',
    description: 'Premium noise-cancelling headphones',
    price: 180000.00,
    currency: 'NGN',
    vendor_id: 'vend_004',
    vendor_name: 'TechZone Nigeria',
    vendor: mockVendors[3],
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop'],
    image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop',
    rating: 4.8,
    review_count: 189,
    category: 'electronics',
    inventory: 25,
  },
  // Kids
  {
    id: 'prod_013',
    title: "Baby Stroller - 3-in-1",
    name: "Baby Stroller - 3-in-1",
    description: 'Convertible baby stroller with car seat',
    price: 45000.00,
    currency: 'NGN',
    vendor_id: 'vend_005',
    vendor_name: 'Kids Paradise',
    vendor: mockVendors[4],
    images: ['https://images.unsplash.com/photo-1544963150-f8695fdb73fe?w=600&h=600&fit=crop'],
    image_url: 'https://images.unsplash.com/photo-1544963150-f8695fdb73fe?w=600&h=600&fit=crop',
    rating: 4.7,
    review_count: 112,
    category: 'kids',
    inventory: 18,
  },
  {
    id: 'prod_014',
    title: 'Toy Car Set - 10 Pieces',
    name: 'Toy Car Set - 10 Pieces',
    description: 'Educational toy car set for children',
    price: 5500.00,
    currency: 'NGN',
    vendor_id: 'vend_005',
    vendor_name: 'Kids Paradise',
    vendor: mockVendors[4],
    images: ['https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&h=600&fit=crop'],
    image_url: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&h=600&fit=crop',
    rating: 4.5,
    review_count: 87,
    category: 'kids',
    inventory: 50,
    is_low_price: true,
  },
  // Shoes
  {
    id: 'prod_015',
    title: 'Nike Air Max - Size 42',
    name: 'Nike Air Max - Size 42',
    description: 'Original Nike Air Max sneakers',
    price: 85000.00,
    currency: 'NGN',
    vendor_id: 'vend_006',
    vendor_name: 'Shoe Palace',
    vendor: mockVendors[5],
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop'],
    image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
    variants: [
      { id: 'v1', label: 'Size 40', price: 85000 },
      { id: 'v2', label: 'Size 42', price: 85000 },
      { id: 'v3', label: 'Size 44', price: 85000 },
    ],
    rating: 4.8,
    review_count: 201,
    category: 'shoes',
    inventory: 22,
  },
  {
    id: 'prod_016',
    title: 'Canvas Sneakers - White',
    name: 'Canvas Sneakers - White',
    description: 'Classic white canvas sneakers',
    price: 9500.00,
    currency: 'NGN',
    vendor_id: 'vend_006',
    vendor_name: 'Shoe Palace',
    vendor: mockVendors[5],
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=600&fit=crop'],
    image_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=600&fit=crop',
    variants: [
      { id: 'v1', label: 'Size 38', price: 9500 },
      { id: 'v2', label: 'Size 40', price: 9500 },
      { id: 'v3', label: 'Size 42', price: 9500 },
    ],
    rating: 4.5,
    review_count: 167,
    category: 'shoes',
    inventory: 40,
    is_low_price: true,
  },
  // More Groceries
  {
    id: 'prod_017',
    title: 'Spaghetti - 500g Pack',
    name: 'Spaghetti - 500g Pack',
    description: 'Premium spaghetti pasta',
    price: 650.00,
    currency: 'NGN',
    vendor_id: 'vend_001',
    vendor_name: 'LocalMart Pro',
    vendor: mockVendors[0],
    images: ['https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=600&fit=crop'],
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=600&fit=crop',
    rating: 4.4,
    review_count: 278,
    category: 'groceries',
    inventory: 100,
    is_low_price: true,
  },
  {
    id: 'prod_018',
    title: 'Tomato Paste - 400g',
    name: 'Tomato Paste - 400g',
    description: 'Pure tomato paste for cooking',
    price: 850.00,
    currency: 'NGN',
    vendor_id: 'vend_001',
    vendor_name: 'LocalMart Pro',
    vendor: mockVendors[0],
    images: ['https://images.unsplash.com/photo-1546548970-71785318a17b?w=600&h=600&fit=crop'],
    image_url: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=600&h=600&fit=crop',
    rating: 4.6,
    review_count: 312,
    category: 'groceries',
    inventory: 80,
    is_low_price: true,
  },
];

// Mock Orders
const mockOrders: Order[] = [
  {
    id: 'order_001',
    order_id: 'ORD-2024-001',
    user_id: 'user_001',
    vendor_id: 'vend_001',
    vendor: mockVendors[0],
    items: [
      {
        id: 'oi_001',
        product_id: 'prod_001',
        product: mockProducts[0],
        qty: 2,
        price: 1200,
      },
    ],
    total: 3400,
    currency: 'NGN',
    status: 'delivered',
    delivery_address: {
      lat: 9.0765,
      lng: 7.3986,
      text: 'Wuse 2, Near Mosque, Abuja',
      type: 'home',
    },
    payment_info: {
      method: 'paystack',
      reference: 'TXN_001',
      status: 'success',
    },
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order_002',
    order_id: 'ORD-2024-002',
    user_id: 'user_001',
    vendor_id: 'vend_002',
    vendor: mockVendors[1],
    items: [
      {
        id: 'oi_002',
        product_id: 'prod_005',
        product: mockProducts[4],
        qty: 1,
        price: 8500,
      },
      {
        id: 'oi_003',
        product_id: 'prod_006',
        product: mockProducts[5],
        qty: 3,
        price: 1200,
      },
    ],
    total: 12100,
    currency: 'NGN',
    status: 'out_for_delivery',
    delivery_address: {
      lat: 9.0765,
      lng: 7.3986,
      text: 'Plot 123, Garki II, Abuja',
      landmark: 'Near Zenith Bank',
      type: 'work',
      instructions: 'Ring doorbell twice',
    },
    payment_info: {
      method: 'wallet',
      reference: 'TXN_002',
      status: 'success',
    },
    rider: {
      id: 'rider_001',
      name: 'Ibrahim Musa',
      phone: '+2348123456789',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      lat: 9.0700,
      lng: 7.3900,
    },
    eta: '25 minutes',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order_003',
    order_id: 'ORD-2024-003',
    user_id: 'user_001',
    vendor_id: 'vend_003',
    vendor: mockVendors[2],
    items: [
      {
        id: 'oi_004',
        product_id: 'prod_012',
        product: mockProducts[11],
        qty: 2,
        price: 4500,
      },
    ],
    total: 9000,
    currency: 'NGN',
    status: 'preparing',
    delivery_address: {
      lat: 9.0765,
      lng: 7.3986,
      text: 'Block 45, Wuse Zone 3, Abuja',
      type: 'home',
    },
    payment_info: {
      method: 'paystack',
      reference: 'TXN_003',
      status: 'success',
    },
    eta: '45 minutes',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'order_004',
    order_id: 'ORD-2024-004',
    user_id: 'user_001',
    vendor_id: 'vend_001',
    vendor: mockVendors[0],
    items: [
      {
        id: 'oi_005',
        product_id: 'prod_003',
        product: mockProducts[2],
        qty: 1,
        price: 3200,
      },
    ],
    total: 3200,
    currency: 'NGN',
    status: 'accepted',
    delivery_address: {
      lat: 9.0765,
      lng: 7.3986,
      text: 'Wuse 2, Near Mosque, Abuja',
      type: 'home',
    },
    payment_info: {
      method: 'paystack',
      reference: 'TXN_004',
      status: 'success',
    },
    eta: '60 minutes',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'order_005',
    order_id: 'ORD-2024-005',
    user_id: 'user_001',
    vendor_id: 'vend_004',
    vendor: mockVendors[3],
    items: [
      {
        id: 'oi_006',
        product_id: 'prod_015',
        product: mockProducts[14],
        qty: 1,
        price: 5500,
      },
    ],
    total: 5500,
    currency: 'NGN',
    status: 'pending',
    delivery_address: {
      lat: 9.0765,
      lng: 7.3986,
      text: 'Flat 12, Block C, Maitama, Abuja',
      type: 'home',
    },
    payment_info: {
      method: 'paystack',
      reference: 'TXN_005',
      status: 'pending',
    },
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'order_006',
    order_id: 'ORD-2024-006',
    user_id: 'user_001',
    vendor_id: 'vend_002',
    vendor: mockVendors[1],
    items: [
      {
        id: 'oi_007',
        product_id: 'prod_008',
        product: mockProducts[7],
        qty: 2,
        price: 2800,
      },
    ],
    total: 5600,
    currency: 'NGN',
    status: 'cancelled',
    delivery_address: {
      lat: 9.0765,
      lng: 7.3986,
      text: 'Plot 123, Garki II, Abuja',
      type: 'work',
    },
    payment_info: {
      method: 'paystack',
      reference: 'TXN_006',
      status: 'refunded',
    },
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Wallet Data
const mockWalletTransactions: Record<string, WalletTransaction[]> = {
  user_001: [
    {
      id: 'txn_001',
      type: 'credit',
      amount: 5000,
      description: 'Top-up via Paystack',
      reference: 'TXN_TOPUP_001',
      status: 'completed',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn_002',
      type: 'debit',
      amount: 3400,
      description: 'Order payment - ORD-2024-001',
      reference: 'TXN_ORDER_001',
      status: 'completed',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn_003',
      type: 'credit',
      amount: 10000,
      description: 'Top-up via Bank Transfer',
      reference: 'TXN_TOPUP_002',
      status: 'completed',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn_004',
      type: 'debit',
      amount: 12100,
      description: 'Order payment - ORD-2024-002',
      reference: 'TXN_ORDER_002',
      status: 'completed',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn_005',
      type: 'credit',
      amount: 5000,
      description: 'Top-up via Paystack',
      reference: 'TXN_TOPUP_003',
      status: 'pending',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn_006',
      type: 'debit',
      amount: 9000,
      description: 'Order payment - ORD-2024-003',
      reference: 'TXN_ORDER_003',
      status: 'completed',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ],
};

const calculateWalletBalance = (userId: string): number => {
  const transactions = mockWalletTransactions[userId] || [];
  return transactions.reduce((balance, txn) => {
    if (txn.status === 'completed') {
      return balance + (txn.type === 'credit' ? txn.amount : -txn.amount);
    }
    return balance;
  }, 0);
};

// Mock Chat Data
const mockChats: Chat[] = [
  {
    id: 'chat_001',
    order_id: 'ORD-2024-002',
    participants: ['user_001', 'vend_002'],
    last_message: 'Your order is out for delivery. ETA: 25 minutes',
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    unread_count: 2,
  },
  {
    id: 'chat_002',
    order_id: 'ORD-2024-003',
    participants: ['user_001', 'vend_003'],
    last_message: 'We are preparing your order now',
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unread_count: 0,
  },
  {
    id: 'chat_003',
    participants: ['user_001', 'rider_001'],
    last_message: 'I am on my way to your location',
    updated_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    unread_count: 1,
  },
  {
    id: 'chat_004',
    participants: ['user_001', 'vend_001'],
    last_message: 'Thank you for your order!',
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    unread_count: 0,
  },
];

const mockMessages: Record<string, Message[]> = {
  chat_001: [
    {
      id: 'msg_001',
      chat_id: 'chat_001',
      sender_id: 'vend_002',
      content: 'Hello! Your order ORD-2024-002 has been confirmed.',
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: 'msg_002',
      chat_id: 'chat_001',
      sender_id: 'user_001',
      content: 'Thank you! When will it be delivered?',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: 'msg_003',
      chat_id: 'chat_001',
      sender_id: 'vend_002',
      content: 'Your order is being prepared. It should be ready in 30 minutes.',
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: 'msg_004',
      chat_id: 'chat_001',
      sender_id: 'vend_002',
      content: 'Your order is out for delivery. ETA: 25 minutes',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: false,
    },
  ],
  chat_002: [
    {
      id: 'msg_005',
      chat_id: 'chat_002',
      sender_id: 'vend_003',
      content: 'We received your order ORD-2024-003',
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: 'msg_006',
      chat_id: 'chat_002',
      sender_id: 'vend_003',
      content: 'We are preparing your order now',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ],
  chat_003: [
    {
      id: 'msg_007',
      chat_id: 'chat_003',
      sender_id: 'rider_001',
      content: 'I am on my way to your location',
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      read: false,
    },
  ],
  chat_004: [
    {
      id: 'msg_008',
      chat_id: 'chat_004',
      sender_id: 'vend_001',
      content: 'Thank you for your order!',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ],
};

// Mock Notifications
const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order ORD-2024-001 has been confirmed by LocalMart Pro',
    icon: 'package-variant',
    read: false,
    deep_link: {
      screen: 'OrderDetail',
      params: { orderId: 'order_001' },
    },
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif_002',
    type: 'delivery',
    title: 'Order Out for Delivery',
    message: 'Your order is on the way! Rider Ibrahim will arrive in 25 minutes',
    icon: 'truck-delivery',
    read: false,
    deep_link: {
      screen: 'LiveTracking',
      params: { orderId: 'order_001' },
    },
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif_003',
    type: 'message',
    title: 'New Message',
    message: 'Health Store NG: Your order is out for delivery. ETA: 25 minutes',
    icon: 'message-text',
    read: false,
    deep_link: {
      screen: 'ChatWindow',
      params: { chatId: 'chat_001' },
    },
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif_004',
    type: 'promotion',
    title: 'Special Offer',
    message: 'Get 20% off on all electronics! Limited time offer',
    icon: 'tag',
    read: true,
    deep_link: {
      screen: 'Home',
    },
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif_005',
    type: 'order',
    title: 'Order Delivered',
    message: 'Your order ORD-2024-002 has been delivered successfully',
    icon: 'check-circle',
    read: true,
    deep_link: {
      screen: 'OrderDetail',
      params: { orderId: 'order_002' },
    },
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif_006',
    type: 'payment',
    title: 'Payment Successful',
    message: 'Your payment of ₦12,500 for order ORD-2024-001 has been processed',
    icon: 'credit-card-check',
    read: true,
    deep_link: {
      screen: 'OrderDetail',
      params: { orderId: 'order_001' },
    },
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif_007',
    type: 'system',
    title: 'App Update Available',
    message: 'New features and improvements are available. Update now!',
    icon: 'update',
    read: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif_008',
    type: 'order',
    title: 'Order Preparing',
    message: 'Fashion Hub has started preparing your order ORD-2024-003',
    icon: 'package-variant-closed',
    read: true,
    deep_link: {
      screen: 'OrderDetail',
      params: { orderId: 'order_003' },
    },
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// OTP Sessions storage (in-memory) - now includes role
const otpSessions: Map<string, { phone: string; otp: string; expiresAt: number; role?: 'customer' | 'vendor' | 'rider' }> = new Map();

// Generate random OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Mock API implementation
export const mockServer = {
  // Auth APIs
  auth: {
    requestOTP: async (phone: string, role?: 'customer' | 'vendor' | 'rider'): Promise<{ otp_session_id: string; ttl_seconds: number; otp?: string }> => {
      await delay(1500);

      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const otp = generateOTP();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

      // Determine role based on phone number if not provided
      let userRole = role;
      if (!userRole) {
        // Check if this is the demo vendor phone
        if (phone === '+2349011111111') {
          userRole = 'vendor';
        } else {
          userRole = 'customer';
        }
      }

      otpSessions.set(sessionId, { phone, otp, expiresAt, role: userRole });

      console.log(`[MOCK] OTP for ${phone} (${userRole}): ${otp} (Session: ${sessionId})`);

      return {
        otp_session_id: sessionId,
        ttl_seconds: 300,
        otp: otp, // Include OTP in response for development (only in mock mode)
      };
    },

    verifyOTP: async (sessionId: string, code: string): Promise<AuthResponse> => {
      await delay(1200);

      const session = otpSessions.get(sessionId);

      if (!session) {
        throw new Error('Invalid session ID');
      }

      if (Date.now() > session.expiresAt) {
        otpSessions.delete(sessionId);
        throw new Error('OTP session expired');
      }

      if (session.otp !== code) {
        throw new Error('Invalid OTP code');
      }

      // Clean up session
      otpSessions.delete(sessionId);

      // Find user by phone or create new user with appropriate role
      let user = mockUsers.find(u => u.phone === session.phone);

      if (!user) {
        // Create new user with role from session
        user = {
          id: `user_${Date.now()}`,
          phone: session.phone,
          name: undefined,
          role: session.role || 'customer',  // Use role from OTP session
        };
        mockUsers.push(user);
      }

      return {
        access_token: `mock_token_${Date.now()}`,
        refresh_token: `mock_refresh_${Date.now()}`,
        user,
      };
    },
  },

  // Product APIs
  products: {
    list: async (params?: {
      category?: string;
      q?: string;
      page?: number;
      lat?: number;
      lng?: number;
    }): Promise<ProductListResponse> => {
      await delay(600);

      let filtered = [...mockProducts];

      // Filter by category
      if (params?.category && params.category !== 'all') {
        filtered = filtered.filter((p) => p.category === params.category);
      }

      // Search query
      if (params?.q) {
        const query = params.q.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query)
        );
      }

      const page = params?.page || 1;
      const perPage = 20;
      const start = (page - 1) * perPage;
      const end = start + perPage;

      return {
        items: filtered.slice(start, end),
        meta: {
          page,
          total: filtered.length,
          per_page: perPage,
        },
      };
    },

    getById: async (id: string): Promise<Product> => {
      await delay(500);

      const product = mockProducts.find((p) => p.id === id);
      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    },

    getReviews: async (productId: string, page: number = 1): Promise<ReviewListResponse> => {
      await delay(600);

      // Mock reviews for products
      const mockReviews: ProductReview[] = [
        {
          id: 'rev_001',
          product_id: productId,
          user_id: 'user_002',
          user_name: 'Amina Hassan',
          user_avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          rating: 5,
          title: 'Excellent quality!',
          comment: 'This product exceeded my expectations. Great value for money and fast delivery.',
          verified_purchase: true,
          helpful_count: 12,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'rev_002',
          product_id: productId,
          user_id: 'user_003',
          user_name: 'Chinedu Okoro',
          user_avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
          rating: 4,
          title: 'Good product',
          comment: 'Works as described. Would recommend to others.',
          verified_purchase: true,
          helpful_count: 8,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'rev_003',
          product_id: productId,
          user_id: 'user_004',
          user_name: 'Fatima Adebayo',
          user_avatar: 'https://randomuser.me/api/portraits/women/66.jpg',
          rating: 5,
          title: 'Amazing!',
          comment: 'Best purchase I\'ve made in a while. Quality is top-notch.',
          verified_purchase: true,
          helpful_count: 15,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          images: ['https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200&h=200&fit=crop'],
        },
        {
          id: 'rev_004',
          product_id: productId,
          user_id: 'user_005',
          user_name: 'Ibrahim Bello',
          user_avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          rating: 3,
          title: 'Average',
          comment: 'It\'s okay, nothing special. Could be better.',
          verified_purchase: true,
          helpful_count: 3,
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'rev_005',
          product_id: productId,
          user_id: 'user_006',
          user_name: 'Aisha Mohammed',
          user_avatar: 'https://randomuser.me/api/portraits/women/77.jpg',
          rating: 5,
          title: 'Perfect!',
          comment: 'Exactly what I needed. Fast shipping and great customer service.',
          verified_purchase: true,
          helpful_count: 20,
          created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      const perPage = 10;
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginatedReviews = mockReviews.slice(start, end);

      const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;

      return {
        reviews: paginatedReviews,
        meta: {
          page,
          total: mockReviews.length,
          per_page: perPage,
          average_rating: averageRating,
        },
      };
    },

    getRelated: async (productId: string, limit: number = 6): Promise<Product[]> => {
      await delay(500);

      const product = mockProducts.find((p) => p.id === productId);
      if (!product) {
        return [];
      }

      // Get products from same category or vendor
      const related = mockProducts
        .filter(
          (p) =>
            p.id !== productId &&
            (p.category === product.category || p.vendor_id === product.vendor_id)
        )
        .slice(0, limit);

      // If not enough related products, fill with random products
      if (related.length < limit) {
        const additional = mockProducts
          .filter((p) => p.id !== productId && !related.find((r) => r.id === p.id))
          .slice(0, limit - related.length);
        related.push(...additional);
      }

      return related;
    },
  },

  // Vendor APIs
  vendors: {
    list: async (): Promise<Vendor[]> => {
      await delay(500);
      return mockVendors;
    },

    getById: async (id: string): Promise<Vendor> => {
      await delay(400);
      const vendor = mockVendors.find((v) => v.id === id);
      if (!vendor) {
        throw new Error('Vendor not found');
      }
      return vendor;
    },

    products: {
      create: async (vendorId: string, productData: Partial<VendorProduct>): Promise<VendorProduct> => {
        await delay();
        const newProduct: VendorProduct = {
          id: `prod_${Date.now()}`,
          vendor_id: vendorId,
          title: productData.title || 'New Product',
          description: productData.description || '',
          price: productData.price || 0,
          compare_at_price: productData.compare_at_price,
          cost_price: productData.cost_price,
          category: productData.category || 'other',
          tags: productData.tags || [],

          images: productData.images || [],
          video: productData.video,

          sku: productData.sku || `SKU-${Date.now()}`,
          barcode: productData.barcode,
          track_quantity: productData.track_quantity ?? true,
          quantity: productData.quantity || 0,
          low_stock_threshold: productData.low_stock_threshold || 5,
          allow_backorders: productData.allow_backorders ?? false,

          has_variants: productData.has_variants ?? false,
          variants: productData.variants || [],

          requires_shipping: productData.requires_shipping ?? true,
          weight_kg: productData.weight_kg,
          dimensions: productData.dimensions,
          is_fragile: productData.is_fragile ?? false,

          status: productData.status || 'active',
          sales_count: 0,
          rating: 0,
          review_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Update both vendor products and global products
        vendorProducts.push(newProduct);
        mockProducts.push(convertVendorProductToProduct(newProduct));

        return newProduct;
      },

      update: async (vendorId: string, productId: string, updates: Partial<VendorProduct>): Promise<VendorProduct> => {
        await delay();
        const index = vendorProducts.findIndex(p => p.id === productId);
        if (index === -1) throw new Error('Product not found');

        const updatedProduct = {
          ...vendorProducts[index],
          ...updates,
          updated_at: new Date().toISOString()
        };

        vendorProducts[index] = updatedProduct;

        // Update global products mock as well
        const globalIndex = mockProducts.findIndex(p => p.id === productId);
        if (globalIndex !== -1) {
          mockProducts[globalIndex] = convertVendorProductToProduct(updatedProduct);
        }

        return updatedProduct;
      },

      delete: async (vendorId: string, productId: string): Promise<void> => {
        await delay();
        const index = vendorProducts.findIndex(p => p.id === productId);
        if (index !== -1) {
          vendorProducts.splice(index, 1);
        }

        const globalIndex = mockProducts.findIndex(p => p.id === productId);
        if (globalIndex !== -1) {
          mockProducts.splice(globalIndex, 1);
        }
      }
    }
  },

  // Cart APIs
  cart: {
    validateCoupon: async (code: string): Promise<boolean> => {
      await delay(800);
      // Mock validation - accept 'WELCOME10' or 'SAVE20'
      return code.toUpperCase() === 'WELCOME10' || code.toUpperCase() === 'SAVE20';
    },
  },

  // Order APIs
  orders: {
    create: async (request: CreateOrderRequest): Promise<CreateOrderResponse> => {
      await delay(1500);

      const orderId = `ORD-${Date.now()}`;
      const eta = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour from now

      return {
        order_id: orderId,
        status: 'pending',
        total: request.items.reduce((sum, item) => sum + item.price * item.qty, 0),
        eta,
      };
    },

    list: async (userId: string): Promise<Order[]> => {
      await delay(600);
      return mockOrders.filter((o) => o.user_id === userId);
    },

    getById: async (id: string): Promise<Order> => {
      await delay(500);
      const order = mockOrders.find((o) => o.id === id || o.order_id === id);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    },
  },

  // Payment APIs
  payments: {
    initiate: async (orderId: string, amount: number): Promise<PaymentInitiateResponse> => {
      await delay(1000);
      return {
        authorization_url: `https://paystack.com/pay/${orderId}`,
        reference: `ref_${Date.now()}`,
        access_code: `access_${Date.now()}`,
      };
    },

    verify: async (reference: string): Promise<PaymentVerifyResponse> => {
      await delay(800);
      // Mock verification - always succeeds for demo
      return {
        status: 'success',
        gateway_response: 'Successful',
        reference,
      };
    },
  },

  // Wallet APIs
  wallet: {
    get: async (userId: string): Promise<Wallet> => {
      await delay(600);
      const transactions = mockWalletTransactions[userId] || [];
      const balance = calculateWalletBalance(userId);

      return {
        balance,
        currency: 'NGN',
        transactions: transactions.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ),
      };
    },

    topUp: async (userId: string, amount: number, method: string = 'paystack'): Promise<WalletTransaction> => {
      await delay(1500);

      const newTransaction: WalletTransaction = {
        id: `txn_${Date.now()}`,
        type: 'credit',
        amount,
        description: `Top-up via ${method}`,
        reference: `TXN_TOPUP_${Date.now()}`,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      // Add to user's transactions
      if (!mockWalletTransactions[userId]) {
        mockWalletTransactions[userId] = [];
      }
      mockWalletTransactions[userId].unshift(newTransaction);

      // Simulate payment processing - after 2 seconds, mark as completed
      setTimeout(() => {
        const txn = mockWalletTransactions[userId].find(t => t.id === newTransaction.id);
        if (txn) {
          txn.status = 'completed';
        }
      }, 2000);

      return newTransaction;
    },

    transactions: async (userId: string, params?: { limit?: number; offset?: number }): Promise<WalletTransaction[]> => {
      await delay(500);
      const transactions = mockWalletTransactions[userId] || [];
      const sorted = transactions.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      if (params?.limit) {
        return sorted.slice(params.offset || 0, (params.offset || 0) + params.limit);
      }

      return sorted;
    },
  },

  // Chat APIs
  chat: {
    list: async (userId: string): Promise<Chat[]> => {
      await delay(600);
      return mockChats.filter((chat) => chat.participants.includes(userId));
    },

    getById: async (chatId: string): Promise<Chat> => {
      await delay(400);
      const chat = mockChats.find((c) => c.id === chatId);
      if (!chat) {
        throw new Error('Chat not found');
      }
      return chat;
    },

    messages: async (chatId: string, params?: { limit?: number; offset?: number }): Promise<Message[]> => {
      await delay(500);
      const messages = mockMessages[chatId] || [];
      const sorted = messages.sort((a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      if (params?.limit) {
        return sorted.slice(params.offset || 0, (params.offset || 0) + params.limit);
      }

      return sorted;
    },

    sendMessage: async (chatId: string, senderId: string, content: string): Promise<Message> => {
      await delay(800);

      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        chat_id: chatId,
        sender_id: senderId,
        content,
        created_at: new Date().toISOString(),
        read: false,
      };

      // Add to messages
      if (!mockMessages[chatId]) {
        mockMessages[chatId] = [];
      }
      mockMessages[chatId].push(newMessage);

      // Update chat's last message
      const chat = mockChats.find((c) => c.id === chatId);
      if (chat) {
        chat.last_message = content;
        chat.updated_at = new Date().toISOString();
      }

      return newMessage;
    },

    markAsRead: async (chatId: string, userId: string): Promise<void> => {
      await delay(300);
      const messages = mockMessages[chatId] || [];
      messages.forEach((msg) => {
        if (msg.sender_id !== userId) {
          msg.read = true;
        }
      });

      // Update unread count
      const chat = mockChats.find((c) => c.id === chatId);
      if (chat) {
        chat.unread_count = 0;
      }
    },
  },

  // Notifications APIs
  notifications: {
    list: async (userId: string, params?: { limit?: number; offset?: number; unread_only?: boolean }): Promise<Notification[]> => {
      await delay(600);
      let filtered = [...mockNotifications];

      if (params?.unread_only) {
        filtered = filtered.filter((n) => !n.read);
      }

      // Sort by created_at descending (newest first)
      filtered.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      if (params?.limit) {
        return filtered.slice(params.offset || 0, (params.offset || 0) + params.limit);
      }

      return filtered;
    },

    getById: async (notificationId: string): Promise<Notification> => {
      await delay(400);
      const notification = mockNotifications.find((n) => n.id === notificationId);
      if (!notification) {
        throw new Error('Notification not found');
      }
      return notification;
    },

    markAsRead: async (notificationId: string): Promise<void> => {
      await delay(300);
      const notification = mockNotifications.find((n) => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    },

    markAllAsRead: async (userId: string): Promise<void> => {
      await delay(500);
      mockNotifications.forEach((n) => {
        n.read = true;
      });
    },

    getUnreadCount: async (userId: string): Promise<number> => {
      await delay(200);
      return mockNotifications.filter((n) => !n.read).length;
    },
  },
};




