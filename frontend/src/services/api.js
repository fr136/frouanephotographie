/**
 * API Service — Franck Rouane Photographie
 * 
 * Endpoints:
 *  - Prodigi (via backend proxy) : quotes, orders, status
 *  - Contact : formulaire
 *  - Newsletter : inscription
 *  - Collections : données locales (pas de backend nécessaire)
 */

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

// ─── Helper ───
async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || `Erreur ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API error [${url}]:`, error);
    throw error;
  }
}


// ═══════════════════════════════════════════
//  PRODIGI — Print on Demand
// ═══════════════════════════════════════════

export const prodigiAPI = {
  /**
   * Obtenir un devis pour un tirage
   * @param {string} sku - Label de taille ("30x45 cm") ou SKU Prodigi
   * @param {string} countryCode - Code ISO pays (défaut: "FR")
   * @param {string} shippingMethod - "Budget", "Standard", "Express"
   */
  getQuote: async (sku, countryCode = 'FR', shippingMethod = 'Standard') => {
    return apiCall(`${API}/prodigi/quote`, {
      method: 'POST',
      body: JSON.stringify({
        sku,
        country_code: countryCode,
        shipping_method: shippingMethod,
      }),
    });
  },

  /**
   * Créer une commande de tirage
   * @param {Object} orderData
   * @param {Object} orderData.recipient - { name, email, phone, address: { line1, line2, postal_code, country_code, city, state } }
   * @param {Array} orderData.items - [{ sku, image_url, copies, merchant_reference }]
   * @param {string} orderData.shipping_method
   * @param {string} orderData.merchant_reference
   */
  createOrder: async (orderData) => {
    return apiCall(`${API}/prodigi/orders`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  /**
   * Consulter le statut d'une commande
   * @param {string} orderId - ID Prodigi (ex: "ord_840796")
   */
  getOrderStatus: async (orderId) => {
    return apiCall(`${API}/prodigi/orders/${orderId}`);
  },
};


// ═══════════════════════════════════════════
//  CONTACT
// ═══════════════════════════════════════════

export const contactAPI = {
  submit: async ({ name, email, phone, subject, message }) => {
    if (!BACKEND_URL) {
      // Fallback local si pas de backend
      console.log('Contact form (no backend):', { name, email, subject });
      return { success: true, message: 'Message enregistré localement' };
    }
    return apiCall(`${API}/contact`, {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, subject, message }),
    });
  },
};


// ═══════════════════════════════════════════
//  NEWSLETTER
// ═══════════════════════════════════════════

export const newsletterAPI = {
  subscribe: async (email) => {
    if (!BACKEND_URL) {
      console.log('Newsletter subscribe (no backend):', email);
      return { success: true, message: 'Inscription enregistrée localement' };
    }
    return apiCall(`${API}/newsletter/subscribe`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};


// ═══════════════════════════════════════════
//  CHECKOUT (Stripe)
// ═══════════════════════════════════════════

export const checkoutAPI = {
  /**
   * Créer une session Stripe Checkout
   * @param {Array} items - [{ title, size, image_url, price (centimes), quantity }]
   * @param {string} customerEmail - optionnel
   * @returns {Object} { session_id, url }
   */
  createSession: async (items, customerEmail = null) => {
    if (!BACKEND_URL) {
      throw new Error('Backend non configuré — paiement impossible');
    }
    return apiCall(`${API}/checkout/create-session`, {
      method: 'POST',
      body: JSON.stringify({ items, customer_email: customerEmail }),
    });
  },

  /**
   * Récupérer les détails d'une session (page confirmation)
   */
  getSession: async (sessionId) => {
    return apiCall(`${API}/checkout/session/${sessionId}`);
  },
};


// ═══════════════════════════════════════════
//  COLLECTIONS (données locales, pas de backend)
// ═══════════════════════════════════════════

const LOCAL_COLLECTIONS = [
  {
    id: 'calanques',
    title: 'Marseille',
    subtitle: 'Les Calanques',
    description: 'Découvrez la beauté sauvage des Calanques de Marseille à La Ciotat.',
    category: 'calanques',
    slug: 'calanques',
    image: '/Calanques/Cover.jpg',
    photoCount: 31,
  },
  {
    id: 'sunset',
    title: 'Couchers de Soleil',
    subtitle: 'Golden Hour',
    description: 'Une sélection des plus beaux couchers de soleil de la région.',
    category: 'sunset',
    slug: 'sunset',
    image: '/Sunset/Cover.JPEG',
    photoCount: 11,
  },
];

export const collectionsAPI = {
  getAll: async () => {
    // Si backend configuré, tenter API d'abord
    if (BACKEND_URL) {
      try {
        const data = await apiCall(`${API}/collections`);
        const arr = Array.isArray(data) ? data : data?.collections || data?.data || [];
        if (arr.length > 0) return arr;
      } catch {
        // fallback local
      }
    }
    return LOCAL_COLLECTIONS;
  },

  getBySlug: async (slug) => {
    return LOCAL_COLLECTIONS.find((c) => c.slug === slug) || null;
  },
};

export const photosAPI = {
  getAll: async () => ({ photos: [] }),
  getById: async () => null,
};

export const healthCheck = async () => {
  if (!BACKEND_URL) return { status: 'no-backend' };
  return apiCall(`${API}/health`);
};
