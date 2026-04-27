import React from 'react';
import SEOHead from '../components/SEOHead';
import '../styles/photography.css';

const MentionsLegales = () => {
  return (
    <div className="bg-white">
      <SEOHead 
        title="Mentions Légales"
        description="Mentions légales du site Franck Rouane Photographie."
        url="/mentions-legales"
      />

      <section className="pt-32 pb-16 bg-black text-white">
        <div className="container-photo text-center">
          <h1 className="section-title text-white mb-6">Mentions Légales</h1>
          <div className="gold-line mx-auto"></div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-photo">
          <div className="max-w-3xl mx-auto">

            <p className="body-text mb-8 text-gray-500 text-sm">
              Dernière mise à jour : 27 avril 2026
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">Éditeur du site</h2>
            <p className="body-text mb-6">
              Franck Rouane — Photographe indépendant<br />
              SIRET : [À COMPLÉTER]<br />
              Adresse : [À COMPLÉTER]<br />
              Email : rouanefra@live.fr<br />
              Responsable de la publication : Franck Rouane
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Hébergement</h2>
            <p className="body-text mb-6">
              Ce site est hébergé par Vercel Inc.<br />
              340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br />
              Site : https://vercel.com
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Activité commerciale</h2>
            <p className="body-text mb-6">
              Ce site propose la vente de tirages d'art photographiques en édition limitée. Les impressions sont réalisées à la demande par <strong>Prodigi</strong> (impression fine art). Les paiements sont traités de manière sécurisée par <strong>Stripe</strong>. Aucune donnée bancaire n'est stockée sur ce site.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Propriété intellectuelle</h2>
            <p className="body-text mb-6">
              L'ensemble des contenus présents sur ce site (photographies, textes, graphismes, logos) sont la propriété exclusive de Franck Rouane, sauf mention contraire. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de Franck Rouane.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Données personnelles</h2>
            <p className="body-text mb-6">
              Les informations collectées via le formulaire de contact et lors des commandes sont traitées conformément au RGPD. Elles sont destinées exclusivement à Franck Rouane et à ses sous-traitants techniques (Stripe, Prodigi, Vercel) et ne sont en aucun cas cédées à des tiers à des fins commerciales. Vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Consultez notre{' '}
              <a href="/politique-confidentialite" className="underline hover:text-[var(--color-gold)]">
                Politique de Confidentialité
              </a>{' '}
              pour plus d'informations.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Cookies</h2>
            <p className="body-text mb-6">
              Ce site peut utiliser des cookies à des fins de mesure d'audience (Google Analytics), uniquement avec votre consentement. Consultez notre{' '}
              <a href="/politique-cookies" className="underline hover:text-[var(--color-gold)]">
                Politique Cookies
              </a>{' '}
              pour paramétrer vos préférences.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Crédits</h2>
            <p className="body-text mb-6">
              Photographies : Franck Rouane<br />
              Conception et développement : Franck Rouane
            </p>

          </div>
        </div>
      </section>
    </div>
  );
};

export default MentionsLegales;
