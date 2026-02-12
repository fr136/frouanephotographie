import React, { useEffect } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import usePageTracking from "./hooks/useAnalytics";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NewsletterPopup from "./components/NewsletterPopup";
import Home from "./pages/Home";
import Collections from "./pages/Collections";
import CollectionGallery from "./pages/CollectionGallery";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import { Toaster } from "./components/ui/toaster";

// Composant qui track les pages
const AppContent = () => {
  usePageTracking(); // Active le tracking automatique des pages
  const location = useLocation();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = document.querySelectorAll("main section");

    if (prefersReducedMotion) {
      sections.forEach((section) => section.classList.add("scroll-visible"));
      return;
    }

    if (typeof window.IntersectionObserver === "undefined") {
      sections.forEach((section) => section.classList.add("scroll-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-visible");
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    const safetyRevealTimer = window.setTimeout(() => {
      sections.forEach((section) => section.classList.add("scroll-visible"));
    }, 1200);

    sections.forEach((section, index) => {
      section.classList.add("scroll-reveal");
      section.style.setProperty("--reveal-delay", `${Math.min(index * 60, 240)}ms`);
      const { top } = section.getBoundingClientRect();
      if (top < window.innerHeight * 0.9) {
        section.classList.add("scroll-visible");
      }
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
        section.classList.remove("scroll-reveal", "scroll-visible");
        section.style.removeProperty("--reveal-delay");
      });
      window.clearTimeout(safetyRevealTimer);
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<CollectionGallery />} />
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
    // Log les IDs configurés (debug)
    console.log('GA4 ID:', process.env.REACT_APP_GA4_ID);
    console.log('GSC Verification:', process.env.REACT_APP_GSC_VERIFICATION);
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
