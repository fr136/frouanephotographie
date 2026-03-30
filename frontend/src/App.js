import React, { useEffect, useState } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from "./context/CartContext";
import usePageTracking from "./hooks/useAnalytics";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NewsletterPopup from "./components/NewsletterPopup";
import { CustomCursor, SmoothScrollProvider, LoadingScreen, PageTransition } from "./components/PremiumEffects";
import Home from "./pages/Home";
import Collections from "./pages/Collections";
import PremiumCollectionGallery from "./pages/PremiumCollectionGallery";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import { Toaster } from "./components/ui/toaster";

// Animated Routes Component
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
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

// Composant qui track les pages
const AppContent = () => {
  usePageTracking(); // Active le tracking automatique des pages

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
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('GA4 ID:', process.env.REACT_APP_GA4_ID);
    }
  }, []);

  return (
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
  );
}

export default App;
