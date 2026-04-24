const isDev = process.env.NODE_ENV === 'development';

const isReady = () =>
  Boolean(process.env.REACT_APP_GA4_ID) &&
  localStorage.getItem('cookie_consent') === 'accepted' &&
  typeof window.gtag === 'function';

const debugParams = () => (isDev ? { debug_mode: true } : {});

/**
 * Charge le script GA4 dynamiquement et initialise gtag.
 * Appelé uniquement après consentement cookies accepté.
 * send_page_view: false évite le double-comptage avec trackPageView.
 */
export const initGA4 = () => {
  const id = process.env.REACT_APP_GA4_ID;
  if (!id || typeof window.gtag === 'function') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  script.onload = () => {
    window.gtag('js', new Date());
    window.gtag('config', id, { send_page_view: false });
  };
  document.head.appendChild(script);
};

/**
 * Page view SPA — à déclencher à chaque changement de route React Router.
 */
export const trackPageView = (path) => {
  if (!isReady()) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
    ...debugParams(),
  });
  if (isDev) console.log('[GA4] page_view sent', path);
};

/**
 * Vue fiche produit — déclenché à l'ouverture de la modale produit dans Shop.
 */
export const trackViewItem = (product) => {
  if (!isReady()) return;
  window.gtag('event', 'view_item', {
    currency: 'EUR',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        item_category: product.category,
        price: product.price,
        quantity: 1,
      },
    ],
    ...debugParams(),
  });
  if (isDev) console.log('[GA4] view_item sent', product.id);
};

/**
 * Ajout au panier — à brancher sur un bouton "Ajouter au panier" si ajouté au flux.
 */
export const trackAddToCart = (product, quantity = 1) => {
  if (!isReady()) return;
  window.gtag('event', 'add_to_cart', {
    currency: 'EUR',
    value: product.price * quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        item_category: product.category,
        price: product.price,
        quantity,
      },
    ],
    ...debugParams(),
  });
  if (isDev) console.log('[GA4] add_to_cart sent', product.id, quantity);
};

/**
 * Début checkout — déclenché dans handleBuyNow, juste avant la redirection Stripe.
 * cartItems : [{ id, title, price, quantity }]
 * value : montant total calculé (getPriceBySize)
 */
export const trackBeginCheckout = (cartItems, value) => {
  if (!isReady()) return;
  const params = {
    currency: 'EUR',
    ...debugParams(),
  };
  if (value != null) params.value = value;
  if (cartItems && cartItems.length > 0) {
    params.items = cartItems.map((item) => ({
      item_id: item.id,
      item_name: item.title,
      price: item.price,
      quantity: item.quantity || 1,
    }));
  }
  window.gtag('event', 'begin_checkout', params);
  if (isDev) console.log('[GA4] begin_checkout sent', params);
};

/**
 * Achat confirmé — déclenché une seule fois dans OrderConfirmation quand session.status === 'paid'.
 * orderData : { transactionId, value (en EUR), currency, items? }
 * value vient de session.amount_total / 100 (Stripe renvoie les centimes).
 */
export const trackPurchase = (orderData) => {
  if (!isReady()) return;
  const { transactionId, value, currency, items } = orderData;
  const params = {
    transaction_id: transactionId,
    currency: (currency || 'EUR').toUpperCase(),
    ...debugParams(),
  };
  if (value != null) params.value = value;
  if (items && items.length > 0) params.items = items;
  window.gtag('event', 'purchase', params);
  if (isDev) console.log('[GA4] purchase sent', params);
};
