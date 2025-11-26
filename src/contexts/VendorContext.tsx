import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from './AuthContext';
import {
    Vendor,
    VendorStats,
    VendorProduct,
    VendorOrder,
    SalesAnalytics,
    ProductPerformance,
    CustomerInsights,
} from '../types/vendor';
import {
    mockVendors,
    mockVendorStats,
    mockVendorProducts,
    mockVendorOrders,
    mockSalesAnalytics,
    mockProductPerformance,
    mockCustomerInsights,
} from '../services/mocks/vendorMockData';

interface VendorContextType {
    // Vendor Profile
    vendor: Vendor | null;
    isLoading: boolean;
    error: string | null;

    // Stats
    stats: VendorStats | null;

    // Products
    products: VendorProduct[];
    refreshProducts: () => Promise<void>;

    // Orders
    orders: VendorOrder[];
    newOrdersCount: number;
    refreshOrders: () => Promise<void>;

    // Analytics
    salesAnalytics: SalesAnalytics | null;
    productPerformance: ProductPerformance[];
    customerInsights: CustomerInsights | null;

    // Actions
    updateVendorProfile: (updates: Partial<Vendor>) => Promise<void>;
    initializeVendor: (data: Partial<Vendor>) => Promise<void>;
    refreshVendorData: () => Promise<void>;
    addProduct: (product: Partial<VendorProduct>) => Promise<void>;
    updateProduct: (productId: string, updates: Partial<VendorProduct>) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
    updateOrderStatus: (orderId: string, status: VendorOrder['status']) => Promise<void>;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

interface VendorProviderProps {
    children: ReactNode;
}

export const VendorProvider: React.FC<VendorProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [stats, setStats] = useState<VendorStats | null>(null);
    const [products, setProducts] = useState<VendorProduct[]>([]);
    const [orders, setOrders] = useState<VendorOrder[]>([]);
    const [salesAnalytics, setSalesAnalytics] = useState<SalesAnalytics | null>(null);
    const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
    const [customerInsights, setCustomerInsights] = useState<CustomerInsights | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Calculate new orders count
    const newOrdersCount = orders.filter(order => order.status === 'new').length;

    const clearVendorData = () => {
        setVendor(null);
        setStats(null);
        setProducts([]);
        setOrders([]);
        setSalesAnalytics(null);
        setProductPerformance([]);
        setCustomerInsights(null);
        setIsLoading(false);
        setError(null);
    };

    const loadVendorData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Check for pending vendor setup from registration wizard
            const pendingSetup = await SecureStore.getItemAsync('pending_vendor_setup');

            let vendorData;
            let isNewVendor = false;

            if (pendingSetup) {
                try {
                    const setupData = JSON.parse(pendingSetup);
                    vendorData = {
                        ...mockVendors[0],
                        id: `vend_${Date.now()}`,
                        user_id: user?.id || '',
                        shop_name: setupData.shopName || 'New Shop',
                        business_type: setupData.sellerType?.toLowerCase() || 'individual',
                        business_email: setupData.email || user?.email || '',
                        business_phone: setupData.phone || user?.phone || '',
                        address_text: '',
                        kyc_status: 'pending' as const,
                        is_active: false,
                        is_verified: false,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    };
                    isNewVendor = true;
                    // Clear pending data
                    await SecureStore.deleteItemAsync('pending_vendor_setup');
                } catch (e) {
                    console.error('Error parsing pending vendor setup:', e);
                }
            }

            if (!vendorData) {
                // For demo, use the first vendor (LocalMart Pro) for user_v001
                // In production, this would fetch from API based on user.id
                vendorData = mockVendors.find(v => v.user_id === user?.id) || mockVendors[0];
            }

            setVendor(vendorData);
            setStats(mockVendorStats);
            setProducts(isNewVendor ? [] : mockVendorProducts);
            setOrders(isNewVendor ? [] : mockVendorOrders);
            setSalesAnalytics(isNewVendor ? null : mockSalesAnalytics);
            setProductPerformance(isNewVendor ? [] : mockProductPerformance);
            setCustomerInsights(isNewVendor ? null : mockCustomerInsights);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load vendor data');
            console.error('Error loading vendor data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Load vendor data when user changes
    useEffect(() => {
        if (user?.role === 'vendor') {
            loadVendorData();
        } else {
            // Clear vendor data if not a vendor
            clearVendorData();
        }
    }, [user]);

    const refreshProducts = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setProducts([...mockVendorProducts]);
        } catch (err) {
            console.error('Error refreshing products:', err);
        }
    };

    const refreshOrders = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setOrders([...mockVendorOrders]);
        } catch (err) {
            console.error('Error refreshing orders:', err);
        }
    };

    const refreshVendorData = loadVendorData;

    const initializeVendor = async (data: Partial<Vendor>) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newVendor: Vendor = {
                ...mockVendors[0], // Use template
                id: `vend_${Date.now()}`,
                user_id: user?.id || '',
                shop_name: data.shop_name || 'New Shop',
                business_type: data.business_type as any || 'individual',
                business_email: data.business_email || user?.email || '',
                business_phone: data.business_phone || user?.phone || '',
                address_text: data.address_text || '',
                kyc_status: 'pending' as const,
                is_active: false,
                is_verified: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                ...data,
            };

            setVendor(newVendor);
        } catch (err) {
            throw new Error('Failed to initialize vendor');
        }
    };

    const updateVendorProfile = async (updates: Partial<Vendor>) => {
        try {
            if (!vendor) throw new Error('No vendor profile loaded');

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            const updatedVendor = { ...vendor, ...updates };
            setVendor(updatedVendor);
        } catch (err) {
            throw new Error(err instanceof Error ? err.message : 'Failed to update profile');
        }
    };

    const addProduct = async (productData: Partial<VendorProduct>) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newProduct: VendorProduct = {
                id: `prod_${Date.now()}`,
                vendor_id: vendor?.id || 'vend_001',
                title: productData.title || 'New Product',
                description: productData.description || '',
                price: productData.price || 0,
                currency: 'NGN',
                images: productData.images || [],
                category: productData.category || 'general',
                quantity: productData.quantity || 0,
                status: 'active',
                rating: 0,
                review_count: 0,

                // Defaults
                track_quantity: true,
                sku: `SKU-${Date.now()}`,
                has_variants: false,
                requires_shipping: true,
                is_fragile: false,
                views: 0,
                sales_count: 0,
                tags: [],
                allow_backorders: false,

                ...productData,
            } as VendorProduct;

            setProducts([newProduct, ...products]);
        } catch (err) {
            throw new Error('Failed to create product');
        }
    };

    const updateProduct = async (productId: string, updates: Partial<VendorProduct>) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            setProducts(products.map(p =>
                p.id === productId ? { ...p, ...updates } : p
            ));
        } catch (err) {
            throw new Error('Failed to update product');
        }
    };

    const deleteProduct = async (productId: string) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 600));

            setProducts(products.filter(p => p.id !== productId));
        } catch (err) {
            throw new Error('Failed to delete product');
        }
    };

    const updateOrderStatus = async (orderId: string, status: VendorOrder['status']) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            setOrders(orders.map(o =>
                o.id === orderId ? { ...o, status } : o
            ));
        } catch (err) {
            throw new Error('Failed to update order status');
        }
    };

    const value: VendorContextType = {
        vendor,
        isLoading,
        error,
        stats,
        products,
        refreshProducts,
        orders,
        newOrdersCount,
        refreshOrders,
        salesAnalytics,
        productPerformance,
        customerInsights,
        updateVendorProfile,
        initializeVendor,
        refreshVendorData,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
    };

    return <VendorContext.Provider value={value}>{children}</VendorContext.Provider>;
};

export const useVendor = (): VendorContextType => {
    const context = useContext(VendorContext);
    if (context === undefined) {
        throw new Error('useVendor must be used within a VendorProvider');
    }
    return context;
};
