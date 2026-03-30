import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI, wishlistAPI } from '../services/ecommerce';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0, discount: 0 });
  const [wishlist, setWishlist] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  // Charger panier et wishlist au démarrage
  useEffect(() => {
    loadCart();
    loadWishlist();
  }, []);

  const loadCart = async () => {
    try {
      const data = await cartAPI.get();
      setCart(data);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    try {
      const data = await wishlistAPI.get();
      setWishlist(data);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const addToCart = async (photoId, format, quantity = 1) => {
    try {
      const updatedCart = await cartAPI.addItem(photoId, format, quantity);
      setCart(updatedCart);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartAPI.removeItem(itemId);
      await loadCart();
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const updatedCart = await cartAPI.updateItem(itemId, quantity);
      setCart(updatedCart);
      return true;
    } catch (error) {
      console.error('Error updating cart:', error);
      return false;
    }
  };

  const applyPromoCode = async (code) => {
    try {
      const updatedCart = await cartAPI.applyPromo(code);
      setCart(updatedCart);
      return { success: true, cart: updatedCart };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Code invalide' };
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart({ items: [], total: 0, discount: 0 });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const addToWishlist = async (photoId) => {
    try {
      const updatedWishlist = await wishlistAPI.addItem(photoId);
      setWishlist(updatedWishlist);
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  };

  const removeFromWishlist = async (photoId) => {
    try {
      await wishlistAPI.removeItem(photoId);
      await loadWishlist();
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  };

  const isInWishlist = (photoId) => {
    return wishlist?.items?.some(item => item.photoId === photoId) || false;
  };

  const cartItemsCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const wishlistItemsCount = wishlist.items?.length || 0;

  const value = {
    cart,
    wishlist,
    loading,
    cartItemsCount,
    wishlistItemsCount,
    addToCart,
    removeFromCart,
    updateCartItem,
    applyPromoCode,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshCart: loadCart,
    refreshWishlist: loadWishlist
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
