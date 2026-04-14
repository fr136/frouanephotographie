import React from 'react';
import SEOHead from '../components/SEOHead';
import '../styles/photography.css';

const CGV = () => {
  return (
    <div className="bg-white">
      <SEOHead 
        title="Conditions Générales de Vente"
        description="Conditions générales de vente des tirages d'art Franck Rouane Photographie."
        url="/cgv"
      />

      <section className="pt-32 pb-16 bg-black text-white">
        <div className="container-photo text-center">
          <h1 className="section-title text-white mb-6">Conditions Générales de Vente</h1>
          <div className="gold-line mx-auto"></div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-photo">
          <div className="max-w-3xl mx-auto">

            <h2 className="font-display text-2xl font-semibold mb-4">Article 1 — Objet</h2>
            <p className="body-text mb-6">
              Les présentes conditions générales de vente régissent les ventes de tirages d'art photographiques réalisées par Franck Rouane (ci-après "le Vendeur") auprès de toute personne physique ou morale (ci-après "l'Acheteur") via le site frouanephotographie.com.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Article 2 — Produits</h2>
            <p className="body-text mb-6">
              Les produits proposés sont des tirages d'art photographiques en édition limitée, numérotés et signés. Les photographies sont imprimées sur papier Fine Art 100% coton de qualité muséale. Chaque tirage est accompagné d'un certificat d'authenticité.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Article 3 — Prix</h2>
            <p className="body-text mb-6">
              Les prix sont indiqués en euros (€) toutes taxes comprises. Le Vendeur se réserve le droit de modifier ses prix à tout moment, les produits étant facturés au prix en vigueur au moment de la validation de la commande. Les frais de livraison sont indiqués avant la validation de la commande.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Article 4 — Commande</h2>
            <p className="body-text mb-6">
              La commande est validée après confirmation par email et réception du paiement intégral. Le Vendeur se réserve le droit de refuser toute commande pour motif légitime. Un délai de production de 5 à 10 jours ouvrés est à prévoir après validation de la commande.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Article 5 — Livraison</h2>
            <p className="body-text mb-6">
              Les tirages sont livrés en France métropolitaine et en Europe. L'emballage est renforcé pour garantir la protection de l'œuvre. Les délais de livraison sont indicatifs et varient selon la destination. Le Vendeur ne saurait être tenu responsable des retards imputables au transporteur.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Article 6 — Droit de rétractation</h2>
            <p className="body-text mb-6">
              Conformément aux articles L221-18 et suivants du Code de la consommation, l'Acheteur dispose d'un délai de 14 jours à compter de la réception du produit pour exercer son droit de rétractation, sans avoir à justifier de motif. Le produit doit être retourné dans son emballage d'origine, en parfait état. Les frais de retour sont à la charge de l'Acheteur.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Article 7 — Propriété intellectuelle</h2>
            <p className="body-text mb-6">
              L'acquisition d'un tirage confère à l'Acheteur un droit de jouissance privée. Les droits d'auteur restent la propriété exclusive de Franck Rouane. Toute reproduction, diffusion ou utilisation commerciale de l'œuvre est strictement interdite sans autorisation écrite.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Article 8 — Réclamations</h2>
            <p className="body-text mb-6">
              Pour toute réclamation, contactez : rouanefra@live.fr. Le Vendeur s'engage à répondre dans un délai de 48 heures ouvrées.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Article 9 — Droit applicable</h2>
            <p className="body-text mb-6">
              Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux compétents seront ceux de Marseille.
            </p>

          </div>
        </div>
      </section>
    </div>
  );
};

export default CGV;
