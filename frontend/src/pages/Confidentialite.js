import React from 'react';
import SEOHead from '../components/SEOHead';
import '../styles/photography.css';

const Confidentialite = () => {
  return (
    <div className="bg-white">
      <SEOHead 
        title="Politique de Confidentialité"
        description="Politique de confidentialité et protection des données personnelles — Franck Rouane Photographie."
        url="/confidentialite"
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

            <h2 className="font-display text-2xl font-semibold mb-4">Responsable du traitement</h2>
            <p className="body-text mb-6">
              Franck Rouane — rouanefra@live.fr<br />
              Marseille, France
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Données collectées</h2>
            <p className="body-text mb-6">
              Les données personnelles collectées sur ce site sont les suivantes :
              nom, adresse email, numéro de téléphone (optionnel), et le contenu des messages envoyés via le formulaire de contact. Ces données sont collectées uniquement lorsque vous les transmettez volontairement.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Finalité du traitement</h2>
            <p className="body-text mb-6">
              Vos données sont utilisées pour répondre à vos demandes de contact, traiter vos commandes de tirages d'art, et vous envoyer la newsletter si vous y êtes inscrit. Elles ne sont jamais cédées, vendues ou louées à des tiers.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Base légale</h2>
            <p className="body-text mb-6">
              Le traitement de vos données repose sur votre consentement (formulaire de contact, newsletter) et sur l'exécution d'un contrat (commande de tirages).
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Durée de conservation</h2>
            <p className="body-text mb-6">
              Les données de contact sont conservées pendant 3 ans à compter du dernier échange. Les données liées aux commandes sont conservées conformément aux obligations légales comptables (10 ans). Les données newsletter sont conservées jusqu'à votre désinscription.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Vos droits</h2>
            <p className="body-text mb-6">
              Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles : accès, rectification, suppression, limitation du traitement, portabilité et opposition. Pour exercer ces droits, contactez : rouanefra@live.fr. Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (www.cnil.fr).
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Cookies</h2>
            <p className="body-text mb-6">
              Ce site utilise des cookies techniques nécessaires à son fonctionnement et des cookies de mesure d'audience (Google Analytics). Les cookies de mesure d'audience collectent des données anonymisées sur votre navigation. Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Sécurité</h2>
            <p className="body-text mb-6">
              Le site est servi en HTTPS. Les données transmises via le formulaire de contact sont chiffrées en transit. Aucune donnée bancaire n'est stockée sur ce site.
            </p>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Confidentialite;
