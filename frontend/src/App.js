import React, { useEffect, useState } from 'react';
import './App.css';
import 'leaflet/dist/leaflet.css';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import usePageTracking from './hooks/useAnalytics';
import Header from './components/Header';
import Footer from './components/Footer';
import NewsletterPopup from './components/NewsletterPopup';
import { CustomCursor, SmoothScrollProvider, LoadingScreen, PageTransition } from './components/PremiumEffects';
import Home from './pages/Home';
import Collections from './pages/Collections';
import PremiumCollectionGallery from './pages/PremiumCollectionGallery';
import Shop from './pages/Shop';
import About from './pages/About';
// Blog supprimé : le contenu est fusionné dans About
import Contact from './pages/Contact';
import { Toaster } from './components/ui/toaster';

// Composant pour les routes animées
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
        {/* Redirection de /blog vers /a-propos */}
        <Route path="/blog" element={<Navigate to="/a-propos" replace />} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

// Composant principal
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulation d'un chargement initial
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('GA4 ID:', process.env.REACT_APP_GA4_ID);
    }
  }, []);

  return (
    <HelmetProvider>
      <SmoothScrollProvider>
        <div className="App cursor-none">
          <LoadingScreen isLoading={isLoading} />
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
