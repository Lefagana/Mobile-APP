import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { useNetwork } from './NetworkContext';
import { useOfflineQueue } from '../hooks/useOfflineQueue';
import {
    Vendor,
    VendorStats,
    VendorProduct,
    VendorOrder,
    SalesAnalytics,
    ProductPerformance,
    CustomerInsights,
    VENDOR_STORAGE,
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
import { api } from '../services/api';

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
    isOffline: boolean;
    pendingActionsCount: number;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

interface VendorProviderProps {
    children: ReactNode;
}

export const VendorProvider: React.FC<VendorProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const { isOnline } = useNetwork();
    const { queueAction, queue } = useOfflineQueue(VENDOR_STORAGE.OFFLINE_QUEUE);

    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [stats, setStats] = useState<VendorStats | null>(null);
    const [products, setProducts] = useState<VendorProduct[]>([]);
    const [orders, setOrders] = useState<VendorOrder[]>([]);
    const [salesAnalytics, setSalesAnalytics] = useState<SalesAnalytics | null>(null);
    const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
    const [customerInsights, setCustomerInsights] = useState<CustomerInsights | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load cached data on mount
    useEffect(() => {
        loadCachedData();
    }, []);

    const loadCachedData = async () => {
        try {
            const [
                cachedProfile,
                cachedProducts,
                cachedOrders,
                cachedStats
            ] = await Promise.all([
                AsyncStorage.getItem(VENDOR_STORAGE.PROFILE),
                AsyncStorage.getItem(VENDOR_STORAGE.PRODUCTS),
                AsyncStorage.getItem(VENDOR_STORAGE.ACTIVE_ORDERS),
                AsyncStorage.getItem(VENDOR_STORAGE.STATS)
            ]);

            if (cachedProfile) setVendor(JSON.parse(cachedProfile));
            if (cachedProducts) setProducts(JSON.parse(cachedProducts));
            if (cachedOrders) setOrders(JSON.parse(cachedOrders));
            if (cachedStats) setStats(JSON.parse(cachedStats));
        } catch (e) {
            console.error('Failed to load cached vendor data', e);
        }
    };

    const cacheData = async (key: string, data: any) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Failed to cache data for ${key}`, e);
        }
    };

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

            // Cache the fetched data
            await Promise.all([
                cacheData(VENDOR_STORAGE.PROFILE, vendorData),
                cacheData(VENDOR_STORAGE.STATS, mockVendorStats),
                cacheData(VENDOR_STORAGE.PRODUCTS, mockVendorProducts),
                cacheData(VENDOR_STORAGE.ACTIVE_ORDERS, mockVendorOrders),
                cacheData(VENDOR_STORAGE.ANALYTICS, mockSalesAnalytics),
            ]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load vendor data');
            console.error('Error loading vendor data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshVendorData = async () => {
        if (!user) {
            clearVendorData();
            return;
        }
        if (isOnline) {
            await loadVendorData();
        } else {
            // If offline, try to load from cache, otherwise rely on existing state
            await loadCachedData();
            setError('You are offline. Data might be outdated.');
        }
    };

    const refreshProducts = async () => {
        if (isOnline) {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));
            setProducts(mockVendorProducts); // Refresh with mock data for now
            cacheData(VENDOR_STORAGE.PRODUCTS, mockVendorProducts);
        } else {
            setError('Cannot refresh products while offline.');
        }
    };

    const refreshOrders = async () => {
        if (isOnline) {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));
            setOrders(mockVendorOrders); // Refresh with mock data for now
            cacheData(VENDOR_STORAGE.ACTIVE_ORDERS, mockVendorOrders);
        } else {
            setError('Cannot refresh orders while offline.');
        }
    };

    const updateVendorProfile = async (updates: Partial<Vendor>) => {
        const action = async () => {
            if (!vendor) throw new Error('No vendor profile to update.');
            const updatedVendor = { ...vendor, ...updates, updated_at: new Date().toISOString() };
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setVendor(updatedVendor);
            cacheData(VENDOR_STORAGE.PROFILE, updatedVendor);
        };
        await queueAction(action, 'updateVendorProfile');
    };

    const initializeVendor = async (data: Partial<Vendor>) => {
        const action = async () => {
            const newVendor: Vendor = {
                ...mockVendors[0], // Base from a mock for default values
                id: `vend_${Date.now()}`,
                user_id: user?.id || '',
                shop_name: data.shop_name || 'New Shop',
                business_type: data.business_type || 'individual',
                business_email: data.business_email || user?.email || '',
                business_phone: data.business_phone || user?.phone || '',
                address_text: data.address_text || '',
                kyc_status: 'pending',
                is_active: false,
                is_verified: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                ...data,
            };
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setVendor(newVendor);
            setStats(mockVendorStats); // Initialize with mock stats
            setProducts([]); // New vendor starts with no products
            setOrders([]); // New vendor starts with no orders
            setSalesAnalytics(null);
            setProductPerformance([]);
            setCustomerInsights(null);

            await Promise.all([
                cacheData(VENDOR_STORAGE.PROFILE, newVendor),
                cacheData(VENDOR_STORAGE.STATS, mockVendorStats),
                cacheData(VENDOR_STORAGE.PRODUCTS, []),
                cacheData(VENDOR_STORAGE.ACTIVE_ORDERS, []),
            ]);
        };
        await queueAction(action, 'initializeVendor');
    };

    const addProduct = async (product: Partial<VendorProduct>) => {
        const action = async () => {
            if (!vendor?.id) throw new Error('Vendor ID not found');

            if (isOnline) {
                const newProduct = await api.vendors.products.create(vendor.id, product);
                setProducts(prev => [...prev, newProduct]);
                cacheData(VENDOR_STORAGE.PRODUCTS, [...products, newProduct]);
            } else {
                // Offline optimistic update
                const newProduct: VendorProduct = {
                    id: `prod_offline_${Date.now()}`,
                    vendor_id: vendor.id,
                    title: product.title || 'New Product',
                    description: product.description || '',
                    price: product.price || 0,
                    category: product.category || 'Other',
                    tags: product.tags || [],
                    sku: product.sku || `SKU-${Date.now()}`,
                    track_quantity: product.track_quantity ?? true,
                    quantity: product.quantity || 0,
                    low_stock_threshold: product.low_stock_threshold || 5,
                    allow_backorders: product.allow_backorders ?? false,
                    has_variants: product.has_variants ?? false,
                    variants: product.variants || [],
                    requires_shipping: product.requires_shipping ?? true,
                    weight_kg: product.weight_kg,
                    dimensions: product.dimensions,
                    is_fragile: product.is_fragile ?? false,
                    currency: product.currency || 'NGN',
                    images: product.images || [],
                    status: product.status || 'active',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    sales_count: 0,
                    rating: 0,
                    review_count: 0,
                    views: 0,
                    ...product,
                } as VendorProduct;

                setProducts(prev => [...prev, newProduct]);
            }
        };
        await queueAction(action, 'addProduct');
    };

    const updateProduct = async (productId: string, updates: Partial<VendorProduct>) => {
        const action = async () => {
            if (!vendor?.id) throw new Error('Vendor ID not found');

            if (isOnline) {
                const updated = await api.vendors.products.update(vendor.id, productId, updates);
                setProducts(prev => {
                    const newProducts = prev.map(p => p.id === productId ? updated : p);
                    cacheData(VENDOR_STORAGE.PRODUCTS, newProducts);
                    return newProducts;
                });
            } else {
                setProducts(prev => {
                    const updated = prev.map(p =>
                        p.id === productId ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
                    );
                    cacheData(VENDOR_STORAGE.PRODUCTS, updated);
                    return updated;
                });
            }
        };
        await queueAction(action, 'updateProduct');
    };

    const deleteProduct = async (productId: string) => {
        const action = async () => {
            if (!vendor?.id) throw new Error('Vendor ID not found');

            if (isOnline) {
                await api.vendors.products.delete(vendor.id, productId);
            }

            setProducts(prev => {
                const filtered = prev.filter(p => p.id !== productId);
                cacheData(VENDOR_STORAGE.PRODUCTS, filtered);
                return filtered;
            });
        };
        await queueAction(action, 'deleteProduct');
    };

    const updateOrderStatus = async (orderId: string, status: VendorOrder['status']) => {
        const action = async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setOrders(prev => {
                const updated = prev.map(order =>
                    order.id === orderId ? { ...order, status, updated_at: new Date().toISOString() } : order
                );
                cacheData(VENDOR_STORAGE.ACTIVE_ORDERS, updated);
                return updated;
            });
        };
        await queueAction(action, 'updateOrderStatus');
    };

    // Effect to load vendor data when user changes or comes online
    useEffect(() => {
        if (user) {
            refreshVendorData();
        } else {
            clearVendorData();
        }
    }, [user, isOnline]); // Depend on user and online status

    return (
        <VendorContext.Provider value={{
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
            isOffline: !isOnline,
            pendingActionsCount: queue.length,
        }}>
            {children}
        </VendorContext.Provider>
    );
};

export const useVendor = (): VendorContextType => {
    const context = useContext(VendorContext);
    if (context === undefined) {
        throw new Error('useVendor must be used within a VendorProvider');
    }
    return context;
};
