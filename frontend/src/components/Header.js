import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/photography.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cartItemsCount, wishlistItemsCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/collections', label: 'Collections' },
    { path: '/boutique', label: 'Boutique' },
    { path: '/a-propos', label: 'À Propos' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container-photo">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span
              className={`font-display text-2xl font-semibold transition-colors ${
                isScrolled ? 'text-black' : 'text-white'
              }`}
            >
              Franck Rouane
            </span>
            <span
              className={`text-xs uppercase tracking-wider transition-colors ${
                isScrolled ? 'text-gray-600' : 'text-gray-200'
              }`}
            >
              Photographie Maritime
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link transition-colors ${
                  location.pathname === link.path
                    ? 'text-[var(--color-gold)]'
                    : isScrolled
                    ? 'text-gray-900 hover:text-[var(--color-gold)]'
                    : 'text-white hover:text-[var(--color-gold)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart Icon */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              className={`p-2 transition-colors ${
                isScrolled ? 'text-gray-900 hover:text-[var(--color-gold)]' : 'text-white hover:text-[var(--color-gold)]'
              }`}
              aria-label="Panier"
            >
              <ShoppingCart size={20} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 transition-colors ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="container-photo py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${
                  location.pathname === link.path ? 'text-[var(--color-gold)]' : 'text-gray-900'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
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
