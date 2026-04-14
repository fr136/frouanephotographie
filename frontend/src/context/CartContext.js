import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

/**
 * CartProvider en mode local (localStorage).
 * Le backend e-commerce n'est pas implémenté.
 * Toute la logique panier/wishlist fonctionne côté client.
 */
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('frouane_cart');
      return saved ? JSON.parse(saved) : { items: [], total: 0 };
    } catch {
      return { items: [], total: 0 };
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('frouane_wishlist');
      return saved ? JSON.parse(saved) : { items: [] };
    } catch {
      return { items: [] };
    }
  });

  const persistCart = useCallback((newCart) => {
    setCart(newCart);
    try { localStorage.setItem('frouane_cart', JSON.stringify(newCart)); } catch {}
  }, []);

  const persistWishlist = useCallback((newWishlist) => {
    setWishlist(newWishlist);
    try { localStorage.setItem('frouane_wishlist', JSON.stringify(newWishlist)); } catch {}
  }, []);

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existingIndex = prev.items.findIndex(
        item => item.id === product.id && item.selectedSize === product.selectedSize
      );
      let newItems;
      if (existingIndex >= 0) {
        newItems = prev.items.map((item, i) =>
          i === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [...prev.items, { ...product, quantity: 1 }];
      }
      const newTotal = newItems.reduce((sum, item) => sum + (item.finalPrice || item.price) * item.quantity, 0);
      const newCart = { items: newItems, total: newTotal };
      try { localStorage.setItem('frouane_cart', JSON.stringify(newCart)); } catch {}
      return newCart;
    });
    return true;
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart(prev => {
      const newItems = prev.items.filter(item => item.id !== itemId);
      const newTotal = newItems.reduce((sum, item) => sum + (item.finalPrice || item.price) * item.quantity, 0);
      const newCart = { items: newItems, total: newTotal };
      try { localStorage.setItem('frouane_cart', JSON.stringify(newCart)); } catch {}
      return newCart;
    });
    return true;
  }, []);

  const updateCartItem = useCallback((itemId, quantity) => {
    if (quantity <= 0) return removeFromCart(itemId);
    setCart(prev => {
      const newItems = prev.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      const newTotal = newItems.reduce((sum, item) => sum + (item.finalPrice || item.price) * item.quantity, 0);
      const newCart = { items: newItems, total: newTotal };
      try { localStorage.setItem('frouane_cart', JSON.stringify(newCart)); } catch {}
      return newCart;
    });
    return true;
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    const emptyCart = { items: [], total: 0 };
    persistCart(emptyCart);
  }, [persistCart]);

  const addToWishlist = useCallback((photoId) => {
    setWishlist(prev => {
      if (prev.items.some(item => item.photoId === photoId)) return prev;
      const newWishlist = { items: [...prev.items, { photoId }] };
      try { localStorage.setItem('frouane_wishlist', JSON.stringify(newWishlist)); } catch {}
      return newWishlist;
    });
    return true;
  }, []);

  const removeFromWishlist = useCallback((photoId) => {
    setWishlist(prev => {
      const newWishlist = { items: prev.items.filter(item => item.photoId !== photoId) };
      try { localStorage.setItem('frouane_wishlist', JSON.stringify(newWishlist)); } catch {}
      return newWishlist;
    });
    return true;
  }, []);

  const isInWishlist = useCallback((photoId) => {
    return wishlist.items.some(item => item.photoId === photoId);
  }, [wishlist]);

  const cartItemsCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistItemsCount = wishlist.items.length;

  const value = {
    cart,
    wishlist,
    loading: false,
    cartItemsCount,
    wishlistItemsCount,
    addToCart,
    removeFromCart,
    updateCartItem,
    applyPromoCode: async () => ({ success: false, error: 'Non disponible' }),
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshCart: () => {},
    refreshWishlist: () => {}
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
