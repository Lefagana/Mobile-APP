import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cart, CartItem, Product } from '../types';
import { api } from '../services/api';

interface CartContextType {
  cart: Cart;
  addItem: (product: Product, quantity?: number, variantId?: string, notes?: string) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  updateItemNotes: (productId: string, notes: string, variantId?: string) => void;
  applyCoupon: (code: string) => Promise<boolean>;
  clearCart: () => void;
  getItemCount: () => number;
  calculateTotals: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'wakanda_cart';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

const initialCart: Cart = {
  items: [],
  subtotal: 0,
  delivery_fee: 0,
  discount: 0,
  total: 0,
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(initialCart);

  useEffect(() => {
    // Load cart from storage on mount
    loadCart();
  }, []);

  useEffect(() => {
    // Save cart to storage whenever it changes
    saveCart();
    calculateTotals();
  }, [cart.items, cart.coupon_code, cart.discount]);

  const loadCart = async () => {
    try {
      const cartStr = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartStr) {
        const savedCart = JSON.parse(cartStr) as Cart;
        setCart(savedCart);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const calculateTotals = () => {
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = cart.discount || 0;
    const deliveryFee = cart.delivery_fee || 0;
    const total = subtotal - discount + deliveryFee;

    setCart((prev) => ({
      ...prev,
      subtotal,
      discount,
      total,
    }));
  };

  const addItem = (product: Product, quantity: number = 1, variantId?: string, notes?: string) => {
    setCart((prev) => {
      const existingItemIndex = prev.items.findIndex(
        (item) => item.product_id === product.id && item.variant_id === variantId
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...prev.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          notes: notes || updatedItems[existingItemIndex].notes,
        };
        return { ...prev, items: updatedItems };
      }

      // Add new item
      const variant = variantId
        ? product.variants?.find((v) => v.id === variantId)
        : undefined;
      const price = variant?.price || product.price;

      const newItem: CartItem = {
        product_id: product.id,
        product,
        variant_id: variantId,
        quantity,
        price,
        notes,
      };

      return { ...prev, items: [...prev.items, newItem] };
    });
  };

  const removeItem = (productId: string, variantId?: string) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter(
        (item) => !(item.product_id === productId && item.variant_id === variantId)
      ),
    }));
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }

    setCart((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.product_id === productId && item.variant_id === variantId
          ? { ...item, quantity }
          : item
      ),
    }));
  };

  const updateItemNotes = (productId: string, notes: string, variantId?: string) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.product_id === productId && item.variant_id === variantId
          ? { ...item, notes }
          : item
      ),
    }));
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      // Mock coupon validation - replace with real API call
      const isValid = await api.cart.validateCoupon(code);
      
      if (isValid) {
        setCart((prev) => ({
          ...prev,
          coupon_code: code,
          discount: prev.subtotal * 0.1, // 10% discount for demo
        }));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error applying coupon:', error);
      return false;
    }
  };

  const clearCart = () => {
    setCart(initialCart);
    AsyncStorage.removeItem(CART_STORAGE_KEY);
  };

  const getItemCount = (): number => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        updateItemNotes,
        applyCoupon,
        clearCart,
        getItemCount,
        calculateTotals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
