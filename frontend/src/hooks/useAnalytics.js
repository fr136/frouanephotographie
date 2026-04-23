import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Hook pour tracker les pages vues avec Google Analytics
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Vérifier si gtag est disponible
    if (typeof window.gtag === 'function') {
      // Envoyer le page view à GA4
      window.gtag('config', process.env.REACT_APP_GA4_ID, {
        page_path: location.pathname + location.search,
        page_title: document.title,
        page_location: window.location.href
      });

      // Log pour debug (à retirer en production)
      console.log('GA4 Page View:', location.pathname);
    }
  }, [location]);
};

// Fonction pour tracker des événements personnalisés
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
    console.log('GA4 Event:', eventName, eventParams);
  }
};

// Événements e-commerce spécifiques
export const trackEcommerce = {
  // Vue produit (photo)
  viewItem: (item) => {
    trackEvent('view_item', {
      currency: 'EUR',
      value: item.price,
      items: [{
        item_id: item.id,
        item_name: item.title,
        item_category: item.category,
        price: item.price
      }]
    });
  },

  // Ajout au panier
  addToCart: (item, format, price) => {
    trackEvent('add_to_cart', {
      currency: 'EUR',
      value: price,
      items: [{
        item_id: item.id,
        item_name: item.title,
        item_variant: format,
        price: price,
        quantity: 1
      }]
    });
  },

  // Ajout à la wishlist
  addToWishlist: (item) => {
    trackEvent('add_to_wishlist', {
      currency: 'EUR',
      value: item.price || 0,
      items: [{
        item_id: item.id,
        item_name: item.title
      }]
    });
  },

  // Début du checkout
  beginCheckout: (cart) => {
    trackEvent('begin_checkout', {
      currency: 'EUR',
      value: cart.total,
      items: cart.items.map(item => ({
        item_id: item.photoId,
        item_name: item.photoTitle,
        item_variant: item.format,
        price: item.price,
        quantity: item.quantity
      }))
    });
  },

  // Achat complété
  purchase: (orderId, cart) => {
    trackEvent('purchase', {
      transaction_id: orderId,
      currency: 'EUR',
      value: cart.total,
      tax: 0,
      shipping: 0,
      items: cart.items.map(item => ({
        item_id: item.photoId,
        item_name: item.photoTitle,
        item_variant: item.format,
        price: item.price,
        quantity: item.quantity
      }))
    });
  }
};

// Événements de contenu
export const trackContent = {
  // Newsletter signup
  newsletterSignup: (email) => {
    trackEvent('newsletter_signup', {
      method: 'newsletter'
    });
  },

  // Partage social
  share: (method, contentType, itemId) => {
    trackEvent('share', {
      method: method, // 'facebook', 'twitter', 'email', etc.
      content_type: contentType,
      item_id: itemId
    });
  },

  // Recherche
  search: (searchTerm) => {
    trackEvent('search', {
      search_term: searchTerm
    });
  },

  // Vue galerie complète
  viewGallery: (collectionName, photoCount) => {
    trackEvent('view_gallery', {
      gallery_name: collectionName,
      photo_count: photoCount
    });
  }
};

export default usePageTracking;
