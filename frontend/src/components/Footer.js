import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail } from "lucide-react";
import { newsletterAPI } from "../services/api";
import "../styles/photography.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null);

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();
    if (!newsletterEmail) return;
    try {
      await newsletterAPI.subscribe(newsletterEmail);
      setNewsletterStatus("ok");
      setNewsletterEmail("");
    } catch {
      setNewsletterStatus("error");
    }
  };

  return (
    <footer className="bg-black text-white">
      <div className="container-photo py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="font-display text-2xl font-semibold mb-4">Franck Rouane</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Photographe de paysage maritime ancré dans le littoral méditerranéen.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://www.instagram.com/frouanephotographie"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[var(--color-gold)] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/frouanephotographie"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[var(--color-gold)] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="mailto:rouanefra@live.fr"
                className="text-gray-400 hover:text-[var(--color-gold)] transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-[var(--color-gold)] transition-colors text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-gray-400 hover:text-[var(--color-gold)] transition-colors text-sm">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/boutique" className="text-gray-400 hover:text-[var(--color-gold)] transition-colors text-sm">
                  Boutique
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-gray-400 hover:text-[var(--color-gold)] transition-colors text-sm">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-[var(--color-gold)] transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Collections</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/collections/calanques" className="text-gray-400 hover:text-[var(--color-gold)] transition-colors text-sm">
                  Calanques & littoral méditerranéen
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/couchers-de-soleil"
                  className="text-gray-400 hover:text-[var(--color-gold)] transition-colors text-sm"
                >
                  Couchers de soleil
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/lever-de-soleil"
                  className="text-gray-400 hover:text-[var(--color-gold)] transition-colors text-sm"
                >
                  Lever de soleil
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Recevez les dernières actualités et nouvelles collections.</p>
            <form className="flex flex-col space-y-2" onSubmit={handleNewsletterSubmit}>
              {newsletterStatus === "ok" ? (
                <p className="text-sm text-[var(--color-gold)]">Inscription confirmée.</p>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder="Votre email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="px-4 py-2 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--color-gold)] text-white text-sm font-semibold uppercase tracking-wider hover:bg-[var(--color-gold-dark)] transition-colors"
                  >
                    S'inscrire
                  </button>
                  {newsletterStatus === "error" && (
                    <p className="text-xs text-red-400">Une erreur est survenue, réessayez.</p>
                  )}
                </>
              )}
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {currentYear} Franck Rouane Photographie. Tous droits réservés.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/mentions-legales" className="text-gray-400 hover:text-[var(--color-gold)] text-sm transition-colors">
              Mentions légales
            </Link>
            <Link to="/cgv" className="text-gray-400 hover:text-[var(--color-gold)] text-sm transition-colors">
              CGV
            </Link>
            <Link to="/confidentialite" className="text-gray-400 hover:text-[var(--color-gold)] text-sm transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center" style={{ fontSize: '0.75rem', opacity: 0.6 }}>
          <Link to="/mentions-legales" className="text-gray-400 hover:underline transition-all">Mentions légales</Link>
          <span className="text-gray-600 mx-2">·</span>
          <Link to="/conditions-generales-de-vente" className="text-gray-400 hover:underline transition-all">CGV</Link>
          <span className="text-gray-600 mx-2">·</span>
          <Link to="/politique-confidentialite" className="text-gray-400 hover:underline transition-all">Confidentialité</Link>
          <span className="text-gray-600 mx-2">·</span>
          <Link to="/politique-cookies" className="text-gray-400 hover:underline transition-all">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
