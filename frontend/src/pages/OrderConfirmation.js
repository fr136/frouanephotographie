import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Mail, ShoppingBag } from 'lucide-react';
import { checkoutAPI } from '../services/api';
import SEOHead from '../components/SEOHead';
import '../styles/photography.css';

const shouldPollOrderStatus = (sessionData) => {
  return sessionData?.status === 'paid' && (!sessionData?.order_status || sessionData.order_status === 'checkout_created');
};

const getOrderPresentation = (session) => {
  if (session?.order_status === 'submitted_to_prodigi') {
    return {
      icon: CheckCircle,
      iconClassName: 'text-green-500',
      heading: 'Commande confirmee',
      message: "Votre paiement a ete accepte et la commande a bien ete transmise a l'atelier d'impression.",
      orderLabel: 'Transmise a Prodigi',
      orderClassName: 'text-green-600',
      tone: 'success',
    };
  }

  if (session?.order_status === 'prodigi_failed') {
    return {
      icon: AlertCircle,
      iconClassName: 'text-red-500',
      heading: 'Paiement recu, commande bloquee',
      message: "Le paiement a ete accepte mais la commande d'impression n'a pas ete transmise. Ne repassez pas commande.",
      orderLabel: 'Echec de transmission',
      orderClassName: 'text-red-600',
      tone: 'error',
    };
  }

  return {
    icon: AlertCircle,
    iconClassName: 'text-[var(--color-gold)]',
    heading: 'Paiement confirme',
    message: "Votre paiement est confirme. La commande d'impression est en cours de finalisation.",
    orderLabel: 'Finalisation en cours',
    orderClassName: 'text-[var(--color-gold)]',
    tone: 'pending',
  };
};

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [session, setSession] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setErreur('Aucune session de paiement trouvee.');
      setChargement(false);
      return;
    }

    let isCancelled = false;
    let timeoutId;
    let pollAttempts = 0;

    const loadSession = async () => {
      try {
        const data = await checkoutAPI.getSession(sessionId);
        if (isCancelled) {
          return;
        }

        setSession(data);
        setErreur(null);

        if (shouldPollOrderStatus(data) && pollAttempts < 5) {
          pollAttempts += 1;
          timeoutId = window.setTimeout(loadSession, 2000);
          return;
        }

        setChargement(false);
      } catch {
        if (isCancelled) {
          return;
        }

        setErreur('Impossible de recuperer les details de votre commande.');
        setChargement(false);
      }
    };

    loadSession();

    return () => {
      isCancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [sessionId]);

  const formaterMontant = (montant, devise = 'eur') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: devise.toUpperCase(),
    }).format(montant / 100);
  };

  const orderPresentation = session ? getOrderPresentation(session) : null;
  const StatusIcon = orderPresentation?.icon || CheckCircle;

  return (
    <div className="bg-white min-h-screen">
      <SEOHead
        title="Confirmation de commande"
        description="Verification du paiement et du statut de commande de votre tirage d'art."
        url="/commande/confirmation"
      />

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

      <section className="py-20">
        <div className="container-photo" style={{ maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
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
              <p className="text-gray-500">Verification de votre commande...</p>
            </div>
          )}

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
                Retour a la boutique
              </Link>
            </motion.div>
          )}

          {!chargement && session && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <StatusIcon className={`mx-auto mb-6 ${orderPresentation.iconClassName}`} size={80} />

              <h2 className="font-display text-3xl font-semibold mb-4">
                {orderPresentation.heading}
              </h2>
              <p className="text-gray-600 mb-8" style={{ maxWidth: '440px', margin: '0 auto 2rem' }}>
                {orderPresentation.message}
              </p>

              <div className="w-16 h-0.5 bg-[var(--color-gold)] mx-auto mb-8"></div>

              <div className="bg-gray-50 p-8 mb-8 text-left">
                <h3 className="font-display text-xl font-semibold mb-6 text-center">
                  Recapitulatif
                </h3>
                <div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-green-500" />
                      <span className="text-gray-700">Statut du paiement</span>
                    </div>
                    <span className="font-medium text-green-600">
                      {session.status === 'paid' ? 'Confirme' : session.status}
                    </span>
                  </div>

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

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <ShoppingBag size={18} className="text-[var(--color-gold)]" />
                      <span className="text-gray-700">Statut de commande</span>
                    </div>
                    <span className={`font-medium ${orderPresentation.orderClassName}`}>
                      {orderPresentation.orderLabel}
                    </span>
                  </div>

                  {session.prodigi_order_id && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-700">Reference Prodigi</span>
                      <span className="font-medium text-gray-900 text-sm">
                        {session.prodigi_order_id}
                      </span>
                    </div>
                  )}

                  {session.amount_total != null && (
                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-700 font-medium">Total paye</span>
                      <span className="text-2xl font-semibold text-[var(--color-gold)]">
                        {formaterMontant(session.amount_total, session.currency)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {orderPresentation.tone === 'success' && (
                <div className="bg-[#1a1a1a] text-white p-6 mb-8 text-sm text-left">
                  <p className="font-display text-base font-semibold mb-2">
                    Votre tirage est en preparation
                  </p>
                  <p className="text-gray-400">
                    La commande est bien partie chez l'atelier. Comptez 5 a 10 jours ouvres pour la livraison en France.
                    Un e-mail de suivi vous sera envoye a l'expedition.
                  </p>
                </div>
              )}

              {orderPresentation.tone === 'pending' && (
                <div className="bg-[#1a1a1a] text-white p-6 mb-8 text-sm text-left">
                  <p className="font-display text-base font-semibold mb-2">
                    Verification en cours
                  </p>
                  <p className="text-gray-400">
                    Stripe a confirme le paiement. Le statut d'impression est encore en attente de retour.
                    Rechargez cette page dans quelques secondes si necessaire.
                  </p>
                </div>
              )}

              {orderPresentation.tone === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-900 p-6 mb-8 text-sm text-left">
                  <p className="font-display text-base font-semibold mb-2">
                    Intervention manuelle requise
                  </p>
                  <p className="mb-3">
                    Le paiement a ete recu, mais la commande n'a pas ete transmise a l'atelier. Ne repassez pas commande.
                  </p>
                  {session.order_error && (
                    <p className="mb-3 text-red-700">
                      Detail technique: {session.order_error}
                    </p>
                  )}
                  <Link to="/contact" className="btn-outline inline-flex items-center gap-2">
                    Contacter le support
                  </Link>
                </div>
              )}

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
