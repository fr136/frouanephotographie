import React from 'react';
import SEOHead from '../components/SEOHead';
import '../styles/photography.css';

const PolitiqueConfidentialite = () => {
  return (
    <div className="bg-white">
      <SEOHead
        title="Politique de Confidentialité"
        description="Politique de confidentialité et protection des données personnelles — Franck Rouane Photographie."
        url="/politique-confidentialite"
      />

      <section className="pt-32 pb-16 bg-black text-white">
        <div className="container-photo text-center">
          <h1 className="section-title text-white mb-6">Politique de Confidentialité</h1>
          <div className="gold-line mx-auto"></div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-photo">
          <div className="max-w-3xl mx-auto">

            <p className="body-text mb-8 text-gray-500 text-sm">
              Dernière mise à jour : [DATE DE DERNIÈRE MISE À JOUR À COMPLÉTER]
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">Responsable du traitement</h2>
            <p className="body-text mb-6">
              Franck Rouane — Photographe indépendant<br />
              SIRET : [SIRET À COMPLÉTER]<br />
              Adresse : [ADRESSE PROFESSIONNELLE À COMPLÉTER]<br />
              Email : [EMAIL À COMPLÉTER]
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Données collectées</h2>
            <p className="body-text mb-4">
              Les données personnelles collectées sur ce site sont les suivantes :
            </p>
            <ul className="list-disc pl-6 mb-6 body-text space-y-1">
              <li>Nom et prénom (formulaire de contact, commande)</li>
              <li>Adresse email (contact, commande, newsletter)</li>
              <li>Adresse postale (livraison des tirages)</li>
              <li>Données de paiement (traitées exclusivement par Stripe — non stockées sur ce site)</li>
              <li>Données de navigation (cookies analytiques, si consentement donné)</li>
            </ul>
            <p className="body-text mb-6">
              Ces données sont collectées uniquement lorsque vous les transmettez volontairement ou lors de la validation d'une commande.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Finalité du traitement</h2>
            <p className="body-text mb-6">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc pl-6 mb-6 body-text space-y-1">
              <li>Répondre à vos demandes de contact</li>
              <li>Traiter et expédier vos commandes de tirages d'art (via Prodigi)</li>
              <li>Traiter les paiements de manière sécurisée (via Stripe)</li>
              <li>Vous envoyer la newsletter si vous y êtes inscrit</li>
              <li>Améliorer le site via des statistiques de navigation (si consentement cookies)</li>
            </ul>
            <p className="body-text mb-6">
              Elles ne sont jamais cédées, vendues ou louées à des tiers, à l'exception des sous-traitants nécessaires à l'exécution de la commande (Stripe pour le paiement, Prodigi pour la production et la livraison).
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Base légale</h2>
            <p className="body-text mb-6">
              Le traitement de vos données repose sur :
            </p>
            <ul className="list-disc pl-6 mb-6 body-text space-y-1">
              <li><strong>Votre consentement</strong> : formulaire de contact, newsletter, cookies analytiques</li>
              <li><strong>L'exécution d'un contrat</strong> : traitement des commandes de tirages</li>
              <li><strong>L'obligation légale</strong> : conservation des données comptables</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Durée de conservation</h2>
            <ul className="list-disc pl-6 mb-6 body-text space-y-1">
              <li>Données de contact : 3 ans à compter du dernier échange</li>
              <li>Données de commande : 10 ans (obligations légales comptables)</li>
              <li>Données newsletter : jusqu'à désinscription</li>
              <li>Données cookies analytiques : 13 mois maximum</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Sous-traitants</h2>
            <p className="body-text mb-6">
              Ce site fait appel aux sous-traitants suivants dans le cadre du traitement des commandes :
            </p>
            <ul className="list-disc pl-6 mb-6 body-text space-y-1">
              <li><strong>Stripe</strong> (Stripe, Inc.) — traitement sécurisé des paiements — <a href="https://stripe.com/fr/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-gold)]">politique de confidentialité Stripe</a></li>
              <li><strong>Prodigi</strong> — impression fine art à la demande et expédition — <a href="https://www.prodigi.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-gold)]">politique de confidentialité Prodigi</a></li>
              <li><strong>Vercel</strong> — hébergement du site — <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-gold)]">politique de confidentialité Vercel</a></li>
            </ul>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Vos droits</h2>
            <p className="body-text mb-6">
              Conformément au RGPD (Règlement UE 2016/679), vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 mb-6 body-text space-y-1">
              <li>Droit d'accès à vos données personnelles</li>
              <li>Droit de rectification des données inexactes</li>
              <li>Droit à l'effacement (« droit à l'oubli »)</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d'opposition au traitement</li>
              <li>Droit de retirer votre consentement à tout moment</li>
            </ul>
            <p className="body-text mb-6">
              Pour exercer ces droits, contactez : [EMAIL À COMPLÉTER]. Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-gold)]">www.cnil.fr</a>).
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Cookies</h2>
            <p className="body-text mb-6">
              Ce site utilise des cookies techniques nécessaires à son fonctionnement et, si vous y consentez, des cookies de mesure d'audience (Google Analytics). Pour plus d'informations, consultez notre{' '}
              <a href="/politique-cookies" className="underline hover:text-[var(--color-gold)]">
                Politique Cookies
              </a>.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Sécurité</h2>
            <p className="body-text mb-6">
              Le site est servi en HTTPS. Les données transmises sont chiffrées en transit. Aucune donnée bancaire n'est stockée sur ce site ; les paiements sont intégralement gérés par Stripe.
            </p>

          </div>
        </div>
      </section>
    </div>
  );
};

export default PolitiqueConfidentialite;
