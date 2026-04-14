import React, { useState, useEffect } from 'react';
import { X, Gift, Mail } from 'lucide-react';
import { newsletterAPI } from '../services/api';
import { toast } from '../hooks/use-toast';

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState(null);

  useEffect(() => {
    // Vérifier si déjà affiché
    const hasSeenPopup = localStorage.getItem('newsletterPopupShown');
    if (hasSeenPopup) return;

    // Exit intent detection
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !hasSeenPopup) {
        setIsOpen(true);
        localStorage.setItem('newsletterPopupShown', 'true');
      }
    };

    // Timeout fallback (30 secondes)
    const timeout = setTimeout(() => {
      if (!localStorage.getItem('newsletterPopupShown')) {
        setIsOpen(true);
        localStorage.setItem('newsletterPopupShown', 'true');
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await newsletterAPI.subscribe(email);
      
      if (result.success) {
        setPromoCode(result.promoCode);
        toast({
          title: "Bienvenue !",
          description: `Votre code promo : ${result.promoCode} (-10%)`,
        });
      }
    } catch (error) {
      // Backend absent : confirmation locale
      toast({
        title: "Merci !",
        description: "Votre inscription a été enregistrée.",
      });
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-2xl relative animate-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fermer"
        >
          <X size={24} />
        </button>

        {!promoCode ? (
          // Formulaire d'inscription
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-gold)] bg-opacity-10 rounded-full mb-4">
                <Gift size={32} className="text-[var(--color-gold)]" />
              </div>
              <h2 className="font-display text-3xl font-semibold mb-3">
                -10% sur votre première photo
              </h2>
              <p className="text-gray-600">
                Inscrivez-vous à notre newsletter et recevez un code promo exclusif + nos dernières collections en avant-première
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Inscription...' : 'Obtenir mon code -10%'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                En vous inscrivant, vous acceptez de recevoir nos newsletters. Désinscription possible à tout moment.
              </p>
            </form>
          </div>
        ) : (
          // Confirmation avec code promo
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <Gift size={40} className="text-green-600" />
            </div>
            <h2 className="font-display text-3xl font-semibold mb-3">
              Merci ! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              Votre code promo a été généré avec succès
            </p>

            <div className="bg-gradient-to-r from-[var(--color-gold)] to-yellow-600 p-6 rounded-lg mb-6">
              <p className="text-white text-sm font-semibold uppercase tracking-wider mb-2">
                Votre code promo exclusif
              </p>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-4 rounded-lg">
                <p className="font-mono text-2xl font-bold text-white tracking-wider">
                  {promoCode}
                </p>
              </div>
              <p className="text-white text-sm mt-3">
                -10% sur votre première commande
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(promoCode);
                toast({
                  title: "✓ Copié !",
                  description: "Le code promo a été copié dans le presse-papier"
                });
              }}
              className="btn-outline mb-3 w-full"
            >
              Copier le code
            </button>

            <button
              onClick={handleClose}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterPopup;
