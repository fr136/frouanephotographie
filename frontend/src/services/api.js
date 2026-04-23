import { getAllCollections, getCollectionBySlug } from "../data/collectionsData";

/**
 * API Service â€” Franck Rouane Photographie
 *
 * Endpoints:
 *  - Prodigi (via backend proxy) : quotes, orders, status
 *  - Contact : formulaire
 *  - Newsletter : inscription
 *  - Collections : données locales (pas de backend nécessaire)
 */

export const API_BASE_URL = (
  process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(`/api${normalizedPath}`, `${API_BASE_URL}/`).toString();
}

if (process.env.NODE_ENV === "development") {
  console.log("API BASE URL =", API_BASE_URL);
}

// Helper
async function apiCall(path, options = {}) {
  const url = /^https?:\/\//i.test(path) ? path : buildApiUrl(path);

  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    const contentType = response.headers.get("content-type") || "";
    const rawBody = await response.text();
    let data = null;

    if (rawBody) {
      if (!contentType.includes("application/json")) {
        const bodyPreview = rawBody.slice(0, 120).replace(/\s+/g, " ").trim();
        throw new Error(
          `Reponse non JSON recue depuis ${response.url} (status ${response.status}, content-type ${
            contentType || "inconnu"
          }). Apercu: ${bodyPreview}`
        );
      }

      try {
        data = JSON.parse(rawBody);
      } catch {
        throw new Error(`JSON invalide recu depuis ${response.url}`);
      }
    }

    if (!response.ok) {
      throw new Error(data?.detail || `Erreur ${response.status}`);
    }

    return data ?? {};
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`API error [${url}]:`, error);
    }
    throw error;
  }
}

// PRODIGI — Print on Demand
export const prodigiAPI = {
  /**
   * Obtenir un devis pour un tirage
   * @param {string} sku - Label de taille ("30x45 cm") ou SKU Prodigi
   * @param {string} countryCode - Code ISO pays (défaut: "FR")
   * @param {string} shippingMethod - "Budget", "Standard", "Express"
   */
  getQuote: async (sku, countryCode = "FR", shippingMethod = "Standard") => {
    return apiCall("/prodigi/quote", {
      method: "POST",
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
    return apiCall("/prodigi/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  /**
   * Consulter le statut d'une commande
   * @param {string} orderId - ID Prodigi (ex: "ord_840796")
   */
  getOrderStatus: async (orderId) => {
    return apiCall(`/prodigi/orders/${encodeURIComponent(orderId)}`);
  },
};

// CONTACT
export const contactAPI = {
  submit: async ({ name, email, phone, subject, message }) => {
    return apiCall("/contact", {
      method: "POST",
      body: JSON.stringify({ name, email, phone, subject, message }),
    });
  },
};

// NEWSLETTER
export const newsletterAPI = {
  subscribe: async (email) => {
    return apiCall("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};

// CHECKOUT (Stripe)
export const checkoutAPI = {
  /**
   * Créer une session Stripe Checkout
   * @param {Array} items - [{ product_id?, size, image_url?, quantity }]
   * @param {string} customerEmail - optionnel
   * @returns {Object} { session_id, url }
   */
  createSession: async (items, customerEmail = null) => {
    return apiCall("/checkout/create-session", {
      method: "POST",
      body: JSON.stringify({ items, customer_email: customerEmail }),
    });
  },

  /**
   * Récupérer les détails d'une session (page confirmation)
   */
  getSession: async (sessionId) => {
    return apiCall(`/checkout/session/${encodeURIComponent(sessionId)}`);
  },
};

// COLLECTIONS (données locales, pas de backend)
export const collectionsAPI = {
  getAll: async () => {
    return getAllCollections();
  },

  getBySlug: async (slug) => {
    return getCollectionBySlug(slug);
  },
};

export const healthCheck = async () => {
  return apiCall("/health");
};
