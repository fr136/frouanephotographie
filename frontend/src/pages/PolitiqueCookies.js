import React from 'react';
import SEOHead from '../components/SEOHead';
import '../styles/photography.css';

const PolitiqueCookies = () => {
  const clearConsent = () => {
    localStorage.removeItem('cookie_consent');
    window.location.reload();
  };

  return (
    <div className="bg-white">
      <SEOHead
        title="Politique Cookies"
        description="Politique d'utilisation des cookies sur le site Franck Rouane Photographie."
        url="/politique-cookies"
      />

      <section className="pt-32 pb-16 bg-black text-white">
        <div className="container-photo text-center">
          <h1 className="section-title text-white mb-6">Politique Cookies</h1>
          <div className="gold-line mx-auto"></div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-photo">
          <div className="max-w-3xl mx-auto">

            <p className="body-text mb-8 text-gray-500 text-sm">
              Dernière mise à jour : 27 avril 2026
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">Qu'est-ce qu'un cookie ?</h2>
            <p className="body-text mb-6">
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d'un site web. Il permet au site de mémoriser des informations sur votre navigation pour améliorer votre expérience ou réaliser des statistiques d'audience.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Cookies utilisés sur ce site</h2>

            <h3 className="font-semibold text-lg mb-3 mt-6">Cookies strictement nécessaires</h3>
            <p className="body-text mb-6">
              Ces cookies sont indispensables au fonctionnement du site. Ils ne nécessitent pas de consentement.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Nom</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Finalité</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-mono text-xs">cookie_consent</td>
                    <td className="border border-gray-200 px-4 py-2">Mémorise votre choix de consentement aux cookies</td>
                    <td className="border border-gray-200 px-4 py-2">Permanent (localStorage)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="font-semibold text-lg mb-3 mt-6">Cookies analytiques (soumis à consentement)</h3>
            <p className="body-text mb-4">
              Ces cookies sont déposés uniquement si vous acceptez les cookies. Ils permettent de mesurer l'audience du site via Google Analytics 4 (Google LLC).
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Nom</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Finalité</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-mono text-xs">_ga</td>
                    <td className="border border-gray-200 px-4 py-2">Distingue les utilisateurs uniques (Google Analytics)</td>
                    <td className="border border-gray-200 px-4 py-2">2 ans</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 font-mono text-xs">_ga_*</td>
                    <td className="border border-gray-200 px-4 py-2">Maintient l'état de la session (Google Analytics 4)</td>
                    <td className="border border-gray-200 px-4 py-2">2 ans</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="body-text mb-6">
              Les données collectées par Google Analytics sont anonymisées et ne permettent pas de vous identifier personnellement. Pour en savoir plus :{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-gold)]">
                politique de confidentialité Google
              </a>.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Gérer vos préférences</h2>
            <p className="body-text mb-6">
              Vous pouvez modifier votre choix à tout moment. Si vous souhaitez retirer votre consentement et réinitialiser vos préférences, cliquez sur le bouton ci-dessous : le bandeau de consentement réapparaîtra lors de votre prochaine visite.
            </p>
            <button
              onClick={clearConsent}
              className="px-6 py-3 border-2 border-black text-black text-sm font-semibold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
            >
              Réinitialiser mes préférences cookies
            </button>
            <p className="body-text mt-6 mb-6">
              Vous pouvez également configurer votre navigateur pour refuser les cookies. Chaque navigateur dispose de paramètres différents — consultez la documentation de votre navigateur pour plus d'informations.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 mt-10">Contact</h2>
            <p className="body-text mb-6">
              Pour toute question relative à l'utilisation des cookies sur ce site, contactez : rouanefra@live.fr.
            </p>

          </div>
        </div>
      </section>
    </div>
  );
};

export default PolitiqueCookies;
