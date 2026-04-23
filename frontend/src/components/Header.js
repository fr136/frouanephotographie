import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "../styles/photography.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Accueil" },
    { path: "/collections", label: "Collections" },
    { path: "/boutique", label: "Boutique" },
    { path: "/a-propos", label: "À Propos" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container-photo">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex flex-col" data-allow-context>
            <span
              className={`font-display text-2xl font-semibold transition-colors ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              Franck Rouane
            </span>
            <span
              className={`text-xs uppercase tracking-wider transition-colors ${
                isScrolled ? "text-gray-600" : "text-gray-200"
              }`}
            >
              Photographe
            </span>
          </Link>

          <div className="hidden lg:flex items-center">
            <nav className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link transition-colors ${
                    location.pathname === link.path
                      ? "text-[var(--color-gold)]"
                      : isScrolled
                        ? "text-gray-900 hover:text-[var(--color-gold)]"
                        : "text-white hover:text-[var(--color-gold)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              className={`p-2 transition-colors ${isScrolled ? "text-gray-900" : "text-white"}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="container-photo py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${
                  location.pathname === link.path ? "text-[var(--color-gold)]" : "text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
