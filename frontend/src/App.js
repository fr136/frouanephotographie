import React from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Collections from "./pages/Collections";
import CollectionGallery from "./pages/CollectionGallery";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
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
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
