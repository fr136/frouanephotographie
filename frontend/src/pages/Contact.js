import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { mockData } from '../mock';
import { Link } from 'react-router-dom';
import '../styles/photography.css';
import { toast } from '../hooks/use-toast';

/*
 * Page de contact bilingue (français / anglais).
 * Cette version conserve la structure du composant d'origine tout en ajoutant :
 * - un champ de téléphone optionnel ;
 * - un champ Sujet sous forme de liste déroulante avec quatre motifs ;
 * - un texte bilingue pour les titres et instructions ;
 * - des éléments de réassurance (qualité des tirages, livraison, édition limitée, délais de réponse) ;
 * - une section présentant quelques formats et des prix indicatifs ;
 * - des liens vers la galerie et Instagram.
 */
const Contact = () => {
  const { photographer } = mockData;
  // État du formulaire incluant un téléphone optionnel et un sujet
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici on simule l'envoi du formulaire
    console.log('Form submitted:', formData);
    toast({
      title: 'Message envoyé !',
      description: 'Merci pour votre message. Je vous répondrai dans les plus brefs délais.'
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="bg-white">
      {/* Bannière/hero bilingue */}
      <section className="pt-32 pb-16 bg-black text-white">
        <div className="container-photo text-center">
          <p className="section-subtitle text-white mb-4">
            Contact / Get in touch
          </p>
          <h1 className="section-title text-white mb-6">
            Entrons en Contact / Get in touch
          </h1>
          <div className="gold-line mx-auto"></div>
          <p className="body-large text-gray-300 max-w-3xl mx-auto mt-6">
            Une question sur mes tirages ? Un projet photographique ? Je serais ravi d'échanger avec vous.<br />
            Any question about my fine art prints or a custom project? I'd be delighted to discuss with you.
          </p>
        </div>
      </section>

      {/* Contenu de contact */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Coordonnées */}
            <div>
              <h2 className="section-title mb-6">Coordonnées / Contact details</h2>
              <div className="gold-line mb-8"></div>
              <p className="body-large mb-8">
                N'hésitez pas à me contacter pour toute question concernant mes œuvres, une commande personnalisée, ou simplement pour discuter de photographie maritime.<br />
                Feel free to contact me about my artwork, a custom order or simply to talk about seascape photography.
              </p>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[var(--color-gold)] text-white rounded-full flex-shrink-0">
                    <Mail size={20} />
                  </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email / Email</h3>
                      <p className="body-text">{photographer.email}</p>
                    </div>
                </div>

                {/* Téléphone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[var(--color-gold)] text-white rounded-full flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Téléphone / Phone</h3>
                    {/* Si le numéro n'est pas défini dans mockData, on affiche un exemple */}
                    <p className="body-text">{photographer.phone || '+33 6 00 00 00 00'}</p>
                  </div>
                </div>

                {/* Zone d'activité */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[var(--color-gold)] text-white rounded-full flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Zone d'activité / Area of operation</h3>
                    <p className="body-text">Côte d'Azur – de Marseille à Monaco / French Riviera – Marseille to Monaco</p>
                  </div>
                </div>
              </div>

              {/* Image illustrative */}
              <div className="mt-12 image-container aspect-[4/3] rounded-sm overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1712227609859-2818504d07cb"
                  alt="Photographie Côte d'Azur mer Méditerranée / Mediterranean seascape"
                  className="image-zoom"
                />
              </div>
            </div>

            {/* Formulaire et informations de vente */}
            <div>
              <h2 className="section-title mb-6">Envoyez‑moi un Message / Send me a message</h2>
              <div className="gold-line mb-8"></div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-semibold mb-2">
                    Nom complet * / Full name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent"
                    placeholder="Votre nom / Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-semibold mb-2">
                    Adresse email * / Email address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent"
                    placeholder="votre@email.com / your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block font-semibold mb-2">
                    Téléphone (optionnel) / Phone (optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent"
                    placeholder="06 12 34 56 78 / +33 6 12 34 56 78"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block font-semibold mb-2">
                    Sujet * / Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent"
                  >
                    <option value="">-- Sélectionner un sujet / Select a subject --</option>
                    <option value="Commande tirage">Commande tirage / Print order</option>
                    <option value="Tirage personnalisé">Tirage personnalisé / Custom print</option>
                    <option value="Renseignements">Renseignements / Information</option>
                    <option value="Collaboration">Collaboration / Collaboration</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block font-semibold mb-2">
                    Message * / Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent resize-none"
                    placeholder="Votre message... / Your message..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn-gold w-full inline-flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Envoyer ma demande / Send my request
                </button>
              </form>

              <p className="caption mt-6 text-center">
                * Champs obligatoires / Required fields. Vos données sont protégées et ne seront jamais partagées. / Your data are protected and will never be shared.
              </p>

              {/* Éléments de réassurance */}
              <ul className="mt-8 space-y-2 text-sm">
                <li>✅ Tirages Fine Art sur papier Hahnemühle / Fine art prints on Hahnemühle paper</li>
                <li>✅ Impression giclée haute résolution / High‑resolution giclée printing</li>
                <li>✅ Livraison soignée en tube ou encadrée / Careful delivery in tube or framed</li>
                <li>✅ Éditions limitées et numérotées / Limited and numbered editions</li>
                <li>✅ Réponse sous 24 h / Reply within 24 h</li>
              </ul>

              {/* Section formats et tarifs */}
              <div className="mt-12">
                <h3 className="font-semibold mb-2">Formats &amp; Tarifs / Sizes &amp; Prices</h3>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="border-b pb-2 pr-4">Format</th>
                      <th className="border-b pb-2">Prix indicatif / Indicative price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 pr-4">30×45 cm / 12×18 in</td>
                      <td className="py-2">à partir de 180 €</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">50×75 cm / 20×30 in</td>
                      <td className="py-2">à partir de 260 €</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">70×105 cm / 28×42 in</td>
                      <td className="py-2">à partir de 360 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Liens vers la galerie et Instagram */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/collections" className="btn-outline w-full sm:w-auto">
                  Voir la Galerie / View the Gallery
                </Link>
                <a
                  href={photographer.social?.instagram || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline w-full sm:w-auto"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section carte (facultatif) */}
      <section className="h-96 bg-gray-200">
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-500">Carte interactive de la Côte d'Azur (Marseille – Monaco) / Interactive map of the French Riviera (Marseille – Monaco)</p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
