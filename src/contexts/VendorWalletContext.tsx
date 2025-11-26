import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useVendor } from './VendorContext';
import {
    VendorWallet,
    VendorTransaction,
    Payout,
} from '../types/vendor';
import {
    mockVendorWallet,
    mockVendorTransactions,
    mockPayouts,
} from '../services/mocks/vendorMockData';

interface VendorWalletContextType {
    // Wallet State
    wallet: VendorWallet | null;
    transactions: VendorTransaction[];
    payouts: Payout[];
    isLoading: boolean;
    error: string | null;

    // Actions
    requestPayout: (amount: number, bankDetails: any) => Promise<void>;
    refreshWallet: () => Promise<void>;
    refreshTransactions: () => Promise<void>;
    refreshPayouts: () => Promise<void>;
}

const VendorWalletContext = createContext<VendorWalletContextType | undefined>(undefined);

interface VendorWalletProviderProps {
    children: ReactNode;
}

export const VendorWalletProvider: React.FC<VendorWalletProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const { vendor } = useVendor();
    const [wallet, setWallet] = useState<VendorWallet | null>(null);
    const [transactions, setTransactions] = useState<VendorTransaction[]>([]);
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load wallet data when vendor changes
    useEffect(() => {
        if (user?.role === 'vendor' && vendor) {
            loadWalletData();
        } else {
            clearWalletData();
        }
    }, [user, vendor]);

    const loadWalletData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // Load mock data for the vendor
            setWallet(mockVendorWallet);
            setTransactions(mockVendorTransactions);
            setPayouts(mockPayouts);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load wallet data');
            console.error('Error loading wallet data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const clearWalletData = () => {
        setWallet(null);
        setTransactions([]);
        setPayouts([]);
        setIsLoading(false);
        setError(null);
    };

    const requestPayout = async (amount: number, bankDetails: any) => {
        try {
            if (!wallet) throw new Error('No wallet loaded');
            if (amount > wallet.balance) throw new Error('Insufficient balance');

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create new payout
            const newPayout: Payout = {
                id: `payout_${Date.now()}`,
                vendor_id: wallet.vendor_id,
                amount,
                fee: amount * 0.002, // 0.2% fee
                net_amount: amount - (amount * 0.002),
                bank_details: bankDetails,
                status: 'processing',
                reference: `PAYOUT-${Date.now()}`,
                requested_at: new Date().toISOString(),
            };

            // Update state
            setPayouts([newPayout, ...payouts]);
            setWallet({
                ...wallet,
                balance: wallet.balance - amount,
            });

            // Add transaction
            const newTransaction: VendorTransaction = {
                id: `txn_${Date.now()}`,
                vendor_id: wallet.vendor_id,
                type: 'payout',
                amount: -amount,
                description: `Payout to ${bankDetails.bank_name} ****${bankDetails.account_number.slice(-4)}`,
                status: 'pending',
                reference: newPayout.reference,
                created_at: new Date().toISOString(),
            };

            setTransactions([newTransaction, ...transactions]);
        } catch (err) {
            throw new Error(err instanceof Error ? err.message : 'Failed to request payout');
        }
    };

    const refreshWallet = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 400));
            setWallet({ ...mockVendorWallet });
        } catch (err) {
            console.error('Error refreshing wallet:', err);
        }
    };

    const refreshTransactions = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 400));
            setTransactions([...mockVendorTransactions]);
        } catch (err) {
            console.error('Error refreshing transactions:', err);
        }
    };

    const refreshPayouts = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 400));
            setPayouts([...mockPayouts]);
        } catch (err) {
            console.error('Error refreshing payouts:', err);
        }
    };

    const value: VendorWalletContextType = {
        wallet,
        transactions,
        payouts,
        isLoading,
        error,
        requestPayout,
        refreshWallet,
        refreshTransactions,
        refreshPayouts,
    };

    return <VendorWalletContext.Provider value={value}>{children}</VendorWalletContext.Provider>;
};

export const useVendorWallet = (): VendorWalletContextType => {
    const context = useContext(VendorWalletContext);
    if (context === undefined) {
        throw new Error('useVendorWallet must be used within a VendorWalletProvider');
    }
    return context;
};
