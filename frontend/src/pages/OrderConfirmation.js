import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Mail, ShoppingBag } from 'lucide-react';
import { checkoutAPI } from '../services/api';
import SEOHead from '../components/SEOHead';
import '../styles/photography.css';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [session, setSession] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setErreur('Aucune session de paiement trouvée.');
      setChargement(false);
      return;
    }
    checkoutAPI
      .getSession(sessionId)
      .then((data) => setSession(data))
      .catch(() => setErreur('Impossible de récupérer les détails de votre commande.'))
      .finally(() => setChargement(false));
  }, [sessionId]);

  const formaterMontant = (montant, devise = 'eur') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: devise.toUpperCase(),
    }).format(montant / 100);
  };

  return (
    <div className="bg-white min-h-screen">
      <SEOHead
        title="Confirmation de commande"
        description="Votre commande de tirage d'art a bien été enregistrée. Merci pour votre confiance."
        url="/commande/confirmation"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#1a1a1a] text-white">
        <div className="container-photo text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[var(--color-gold)] text-sm uppercase tracking-widest mb-4">
              Boutique
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
              Confirmation de commande
            </h1>
            <div className="w-16 h-0.5 bg-[var(--color-gold)] mx-auto"></div>
          </motion.div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-20">
        <div className="container-photo" style={{ maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>

          {/* Chargement */}
          {chargement && (
            <div className="text-center py-16">
              <div
                className="mx-auto mb-4"
                style={{
                  width: '2rem',
                  height: '2rem',
                  border: '2px solid var(--color-gold)',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <p className="text-gray-500">Chargement de votre commande…</p>
            </div>
          )}

          {/* Erreur */}
          {!chargement && erreur && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <AlertCircle className="mx-auto mb-4 text-red-400" size={64} />
              <h2 className="font-display text-2xl font-semibold mb-2">
                Une erreur est survenue
              </h2>
              <p className="text-gray-500 mb-8">{erreur}</p>
              <Link to="/boutique" className="btn-gold">
                Retour à la boutique
              </Link>
            </motion.div>
          )}

          {/* Succès */}
          {!chargement && session && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <CheckCircle className="mx-auto mb-6 text-green-500" size={80} />

              <h2 className="font-display text-3xl font-semibold mb-4">
                Merci pour votre commande !
              </h2>
              <p className="text-gray-600 mb-8" style={{ maxWidth: '440px', margin: '0 auto 2rem' }}>
                Votre paiement a été accepté. Vous recevrez une confirmation par e-mail dans quelques instants.
              </p>

              <div className="w-16 h-0.5 bg-[var(--color-gold)] mx-auto mb-8"></div>

              {/* Récapitulatif */}
              <div className="bg-gray-50 p-8 mb-8 text-left">
                <h3 className="font-display text-xl font-semibold mb-6 text-center">
                  Récapitulatif
                </h3>
                <div>
                  {/* Statut */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-green-500" />
                      <span className="text-gray-700">Statut du paiement</span>
                    </div>
                    <span className="font-medium text-green-600">
                      {session.status === 'paid' ? 'Confirmé' : session.status}
                    </span>
                  </div>

                  {/* Email */}
                  {session.customer_email && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <Mail size={18} className="text-[var(--color-gold)]" />
                        <span className="text-gray-700">E-mail de confirmation</span>
                      </div>
                      <span className="font-medium text-gray-900 text-sm">
                        {session.customer_email}
                      </span>
                    </div>
                  )}

                  {/* Montant */}
                  {session.amount_total != null && (
                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-700 font-medium">Total payé</span>
                      <span className="text-2xl font-semibold text-[var(--color-gold)]">
                        {formaterMontant(session.amount_total, session.currency)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Message livraison */}
              <div className="bg-[#1a1a1a] text-white p-6 mb-8 text-sm text-left">
                <p className="font-display text-base font-semibold mb-2">
                  Votre tirage est en préparation
                </p>
                <p className="text-gray-400">
                  Franck prépare personnellement votre tirage Fine Art. Comptez 5 à 10 jours ouvrés
                  pour la livraison en France. Un e-mail de suivi vous sera envoyé à l'expédition.
                </p>
              </div>

              <Link
                to="/boutique"
                className="btn-gold inline-flex items-center gap-2"
              >
                <ShoppingBag size={18} />
                Continuer mes achats
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default OrderConfirmation;
