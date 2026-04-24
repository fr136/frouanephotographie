import React from 'react';
import SEOHead from '../components/SEOHead';
import '../styles/photography.css';

const ConditionsGeneralesVente = () => {
  return (
    <div className="bg-white">
      <SEOHead
        title="Conditions Générales de Vente"
        description="Conditions générales de vente des tirages d'art Franck Rouane Photographie."
        url="/conditions-generales-de-vente"
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

            <p className="body-text mb-8 text-gray-500 text-sm">
              Dernière mise à jour : [DATE DE DERNIÈRE MISE À JOUR À COMPLÉTER]
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">Article 1 — Identification du vendeur</h2>
            <p className="body-text mb-6">
              Franck Rouane — Photographe indépendant<br />
              SIRET : [SIRET À COMPLÉTER]<br />
              Adresse : [ADRESSE PROFESSIONNELLE À COMPLÉTER]<br />
              Email : [EMAIL À COMPLÉTER]<br />
              Site : frouanephotographie.com
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Article 2 — Objet</h2>
            <p className="body-text mb-6">
              Les présentes conditions générales de vente (CGV) régissent les ventes de tirages d'art photographiques réalisées par Franck Rouane (ci-après « le Vendeur ») auprès de toute personne physique ou morale (ci-après « l'Acheteur ») via le site frouanephotographie.com. Toute commande implique l'acceptation sans réserve des présentes CGV.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Article 3 — Produits</h2>
            <p className="body-text mb-6">
              Les produits proposés sont des tirages d'art photographiques en édition limitée, numérotés et signés. Les photographies sont imprimées sur papier Fine Art 100 % coton de qualité muséale. Chaque tirage est accompagné d'un certificat d'authenticité.
            </p>
            <p className="body-text mb-6">
              <strong>Tirage à la demande :</strong> les impressions sont réalisées à la commande par notre partenaire technique Prodigi (impression fine art). Aucun stock physique n'est conservé. Chaque tirage est produit après validation du paiement.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Article 4 — Prix</h2>
            <p className="body-text mb-6">
              Les prix sont indiqués en euros (€) toutes taxes comprises. Le Vendeur se réserve le droit de modifier ses prix à tout moment ; les produits sont facturés au prix en vigueur au moment de la validation de la commande. Les frais de livraison sont indiqués et détaillés avant la validation définitive de la commande.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Article 5 — Commande et paiement</h2>
            <p className="body-text mb-6">
              La commande est validée après confirmation par email et réception du paiement intégral. Le paiement est sécurisé et traité par <strong>Stripe</strong> (Stripe, Inc. — stripe.com). Aucune donnée bancaire n'est collectée ni stockée sur ce site. La commande est ensuite transmise automatiquement à <strong>Prodigi</strong> pour production et expédition. Le Vendeur se réserve le droit de refuser toute commande pour motif légitime.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Article 6 — Délais de production et livraison</h2>
            <p className="body-text mb-6">
              Un délai de production de 3 à 7 jours ouvrés est à prévoir après validation de la commande, avant expédition. Les délais de livraison sont indicatifs et varient selon la destination ; ils sont communiqués avant validation du paiement. Les tirages sont livrés en France métropolitaine et en Europe dans un emballage renforcé garantissant la protection de l'œuvre. Le Vendeur ne saurait être tenu responsable des retards imputables au transporteur.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Article 7 — Droit de rétractation</h2>
            <p className="body-text mb-6">
              Conformément aux articles L221-18 et suivants du Code de la consommation, l'Acheteur dispose d'un délai de 14 jours à compter de la réception du produit pour exercer son droit de rétractation, sans avoir à justifier de motif ni à payer de pénalité. Le produit doit être retourné dans son emballage d'origine, en parfait état. Les frais de retour sont à la charge de l'Acheteur. Le remboursement interviendra dans les 14 jours suivant la réception du retour.
            </p>
            <p className="body-text mb-6">
              <strong>Exception :</strong> conformément à l'article L221-28 11° du Code de la consommation, le droit de rétractation ne s'applique pas aux biens confectionnés selon les spécifications du consommateur ou nettement personnalisés. Les tirages à la demande (dimensions ou finitions personnalisées) peuvent être exclus de ce droit ; l'Acheteur en est informé lors de la commande.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Article 8 — Propriété intellectuelle</h2>
            <p className="body-text mb-6">
              L'acquisition d'un tirage confère à l'Acheteur un droit de jouissance privée de l'œuvre. Les droits d'auteur restent la propriété exclusive de Franck Rouane. Toute reproduction, diffusion ou utilisation commerciale de l'œuvre est strictement interdite sans autorisation écrite préalable.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Article 9 — Réclamations et service après-vente</h2>
            <p className="body-text mb-6">
              Pour toute réclamation (tirage endommagé, non-conformité), contactez : [EMAIL À COMPLÉTER]. Le Vendeur s'engage à répondre dans un délai de 48 heures ouvrées. En cas de tirage endommagé à la livraison, des photos du colis et du tirage seront demandées pour traitement.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Article 10 — Données personnelles</h2>
            <p className="body-text mb-6">
              Les données personnelles collectées lors de la commande sont traitées conformément au RGPD. Elles sont utilisées exclusivement pour le traitement de votre commande et ne sont pas cédées à des tiers, à l'exception de Stripe (paiement) et de Prodigi (production et expédition). Consultez notre{' '}
              <a href="/politique-confidentialite" className="underline hover:text-[var(--color-gold)]">
                Politique de Confidentialité
              </a>{' '}
              pour plus d'informations.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Article 11 — Droit applicable et litiges</h2>
            <p className="body-text mb-6">
              Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les tribunaux compétents seront ceux du ressort de [ADRESSE PROFESSIONNELLE À COMPLÉTER]. L'Acheteur peut également recourir à la plateforme européenne de règlement en ligne des litiges : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-gold)]">ec.europa.eu/consumers/odr</a>.
            </p>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ConditionsGeneralesVente;
