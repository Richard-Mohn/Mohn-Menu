'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the shape of a cart item
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  options?: string[]; // Selected options for this specific cart item
}

// Define the shape of the cart context
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  setBusinessId: (id: string) => void;
}

// Create the context with a default undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_PREFIX = 'mohn_cart_';

function getCartKey(businessId?: string): string {
  return businessId ? `${CART_STORAGE_PREFIX}${businessId}` : 'mohn_cart';
}

// Cart Provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [activeBusinessId, setActiveBusinessId] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(getCartKey());
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // When businessId changes, load that business's cart
  const setBusinessId = (id: string) => {
    if (id === activeBusinessId) return;
    // Save current cart
    if (activeBusinessId) {
      try { localStorage.setItem(getCartKey(activeBusinessId), JSON.stringify(cart)); } catch {}
    }
    setActiveBusinessId(id);
    // Load new business cart
    try {
      const stored = localStorage.getItem(getCartKey(id));
      setCart(stored ? JSON.parse(stored) : []);
    } catch {
      setCart([]);
    }
  };

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    const key = activeBusinessId ? getCartKey(activeBusinessId) : getCartKey();
    try {
      localStorage.setItem(key, JSON.stringify(cart));
    } catch {
      // localStorage might be full or disabled
    }
  }, [cart, activeBusinessId]);

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.id === item.id && JSON.stringify(cartItem.options) === JSON.stringify(item.options)
      );

      if (existingItemIndex > -1) {
        // Item with same ID and options exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        return updatedCart;
      } else {
        // Item does not exist, add new item
        return [...prevCart, { ...item }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        setBusinessId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
