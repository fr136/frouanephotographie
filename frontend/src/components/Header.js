import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import '../styles/photography.css';

// ── Sun / Moon SVG icons ──────────────────────────────────────────────────────
const SunIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="2"  x2="12" y2="4"  />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="2"  y1="12" x2="4"  y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93"   x2="6.34" y2="6.34"   />
    <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
    <line x1="4.93" y1="19.07"  x2="6.34" y2="17.66"  />
    <line x1="17.66" y1="6.34"  x2="19.07" y2="4.93"  />
  </svg>
);

const MoonIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// ── Header component ──────────────────────────────────────────────────────────
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/',            label: 'Accueil'     },
    { path: '/collections', label: 'Collections' },
    { path: '/boutique',    label: 'Boutique'    },
    { path: '/a-propos',    label: 'À Propos'    },
    { path: '/contact',     label: 'Contact'     },
  ];

  const iconColor = isScrolled ? '#333333' : 'rgba(255,255,255,0.85)';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container-photo">
        <div className="flex items-center justify-between h-20">

          {/* Logo — allowed context menu */}
          <Link to="/" className="flex flex-col" data-allow-context>
            <span className={`font-display text-2xl font-semibold transition-colors ${
              isScrolled ? 'text-black' : 'text-white'
            }`}>
              Franck Rouane
            </span>
            <span className={`text-xs uppercase tracking-wider transition-colors ${
              isScrolled ? 'text-gray-600' : 'text-gray-200'
            }`}>
              Photographe
            </span>
          </Link>

          {/* Desktop: nav + dark-mode toggle */}
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center space-x-8">
              {navLinks.map(link => (
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

            <button
              onClick={toggleTheme}
              className={`theme-toggle-btn ${isScrolled ? 'scrolled' : ''}`}
              aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
              title={isDark ? 'Mode clair' : 'Mode sombre'}
            >
              <span className={`theme-toggle-icon ${isDark ? 'rotate' : ''}`} style={{ color: iconColor }}>
                {isDark ? <SunIcon /> : <MoonIcon />}
              </span>
            </button>
          </div>

          {/* Mobile: dark-mode toggle + hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`theme-toggle-btn ${isScrolled ? 'scrolled' : ''}`}
              aria-label={isDark ? 'Mode clair' : 'Mode sombre'}
            >
              <span className={`theme-toggle-icon ${isDark ? 'rotate' : ''}`} style={{ color: iconColor }}>
                {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
              </span>
            </button>

            <button
              className={`p-2 transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="container-photo py-4 flex flex-col space-y-4">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${
                  location.pathname === link.path ? 'text-[var(--color-gold)]' : 'text-gray-900'
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
