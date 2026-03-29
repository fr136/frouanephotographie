import React, { useEffect } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import usePageTracking from "./hooks/useAnalytics";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NewsletterPopup from "./components/NewsletterPopup";
import Home from "./pages/Home";
import Collections from "./pages/Collections";
import PremiumCollectionGallery from "./pages/PremiumCollectionGallery";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import { Toaster } from "./components/ui/toaster";

// Composant qui track les pages
const AppContent = () => {
  usePageTracking(); // Active le tracking automatique des pages

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<PremiumCollectionGallery />} />
          <Route path="/boutique" element={<Shop />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <NewsletterPopup />
      <Toaster />
    </>
  );
};

function App() {
  useEffect(() => {
    // Désactiver les logs en production pour plus de sécurité
    if (process.env.NODE_ENV === 'development') {
      console.log('GA4 ID:', process.env.REACT_APP_GA4_ID);
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
