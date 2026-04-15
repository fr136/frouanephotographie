import React from 'react';
import './App.css';
import 'leaflet/dist/leaflet.css';
import { BrowserRouter, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import usePageTracking from './hooks/useAnalytics';
import Header from './components/Header';
import Footer from './components/Footer';
import NewsletterPopup from './components/NewsletterPopup';
import { CustomCursor, SmoothScrollProvider, PageTransition } from './components/PremiumEffects';
import Home from './pages/Home';
import Collections from './pages/Collections';
import PremiumCollectionGallery from './pages/PremiumCollectionGallery';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import MentionsLegales from './pages/MentionsLegales';
import CGV from './pages/CGV';
import Confidentialite from './pages/Confidentialite';
import OrderConfirmation from './pages/OrderConfirmation';
import { Toaster } from './components/ui/toaster';
import './styles/photography.css';

// Page 404
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-black text-white text-center px-4">
    <div>
      <p className="text-[var(--color-gold)] text-sm uppercase tracking-widest mb-4">Erreur 404</p>
      <h1 className="font-display text-5xl md:text-7xl font-semibold mb-6">Page introuvable</h1>
      <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="btn-gold">Retour à l'accueil</Link>
    </div>
  </div>
);

// Routes animées
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/collections" element={<PageTransition><Collections /></PageTransition>} />
        <Route path="/collections/:slug" element={<PageTransition><PremiumCollectionGallery /></PageTransition>} />
        <Route path="/boutique" element={<PageTransition><Shop /></PageTransition>} />
        <Route path="/a-propos" element={<PageTransition><About /></PageTransition>} />
        <Route path="/blog" element={<Navigate to="/a-propos" replace />} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/mentions-legales" element={<PageTransition><MentionsLegales /></PageTransition>} />
        <Route path="/cgv" element={<PageTransition><CGV /></PageTransition>} />
        <Route path="/confidentialite" element={<PageTransition><Confidentialite /></PageTransition>} />
        <Route path="/commande/confirmation" element={<PageTransition><OrderConfirmation /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  usePageTracking();

  return (
    <>
      <Header />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
      <NewsletterPopup />
      <Toaster />
    </>
  );
};

function App() {
  return (
    <HelmetProvider>
      <SmoothScrollProvider>
        <div className="App">
          <CustomCursor />
          <BrowserRouter>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </BrowserRouter>
        </div>
      </SmoothScrollProvider>
    </HelmetProvider>
  );
}

export default App;
