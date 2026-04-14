import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, Image, Truck, Award, Clock } from 'lucide-react';
import { mockData } from '../mock';
import { FadeInOnScroll, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';
import { toast } from '../hooks/use-toast';
import '../styles/photography.css';

const Contact = () => {
  const { photographer } = mockData;

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
    console.log('Form submitted:', formData);
    toast({
      title: 'Message envoyé !',
      description: 'Merci pour votre message. Je vous répondrai dans les plus brefs délais.'
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const reassurance = [
    { icon: Image, text: 'Tirages Fine Art sur papier Hahnemühle' },
    { icon: Award, text: 'Éditions limitées, numérotées et signées' },
    { icon: Truck, text: 'Livraison soignée en tube ou encadrée' },
    { icon: Clock, text: 'Réponse sous 24 h' },
  ];

  const formats = [
    { size: '30 x 45 cm', price: 'à partir de 180 €' },
    { size: '50 x 75 cm', price: 'à partir de 260 €' },
    { size: '70 x 105 cm', price: 'à partir de 360 €' },
  ];

  return (
    <div className="bg-white">

      {/* Hero plein écran */}
      <section
        className="relative min-h-[70vh] flex items-center justify-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1712227609859-2818504d07cb')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <motion.div
          className="relative z-10 text-center px-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <motion.p
            className="section-subtitle text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Contact
          </motion.p>
          <motion.h1
            className="hero-title mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Entrons en Contact
          </motion.h1>
          <motion.div
            className="gold-line mx-auto mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          />
          <motion.p
            className="text-white text-xl md:text-2xl font-light max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Une question sur mes tirages ? Un projet photographique ? Je serais ravi d'échanger avec vous.
          </motion.p>
        </motion.div>
      </section>

      {/* Coordonnées + Formulaire */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="grid md:grid-cols-2 gap-16">

            {/* Colonne gauche : coordonnées */}
            <div>
              <FadeInOnScroll direction="left">
                <h2 className="section-title mb-6">Coordonnées</h2>
                <div className="gold-line mb-8"></div>
                <p className="body-large mb-8">
                  N'hésitez pas à me contacter pour toute question concernant mes œuvres, une commande personnalisée, ou simplement pour discuter de photographie maritime.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-[var(--color-gold)] text-white rounded-full flex-shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="body-text">{photographer.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-[var(--color-gold)] text-white rounded-full flex-shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Téléphone</h3>
                      <p className="body-text">{photographer.phone || '+33 6 00 00 00 00'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-[var(--color-gold)] text-white rounded-full flex-shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Zone d'activité</h3>
                      <p className="body-text">Côte méditerranéenne — de Marseille au Var</p>
                    </div>
                  </div>
                </div>
              </FadeInOnScroll>

              {/* Image illustrative */}
              <FadeInOnScroll delay={0.3}>
                <div className="mt-12 image-container aspect-[4/3] rounded-sm overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1712227609859-2818504d07cb"
                    alt="Paysage méditerranéen"
                    className="image-zoom"
                  />
                </div>
              </FadeInOnScroll>
            </div>

            {/* Colonne droite : formulaire */}
            <div>
              <FadeInOnScroll direction="right" delay={0.2}>
                <h2 className="section-title mb-6">Envoyez-moi un message</h2>
                <div className="gold-line mb-8"></div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block font-semibold mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent transition-all"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block font-semibold mb-2">
                      Adresse email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block font-semibold mb-2">
                      Téléphone (optionnel)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent transition-all"
                      placeholder="06 12 34 56 78"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block font-semibold mb-2">
                      Sujet *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent transition-all"
                    >
                      <option value="">-- Sélectionner un sujet --</option>
                      <option value="Commande tirage">Commande tirage</option>
                      <option value="Tirage personnalisé">Tirage personnalisé</option>
                      <option value="Renseignements">Renseignements</option>
                      <option value="Collaboration">Collaboration</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block font-semibold mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent resize-none transition-all"
                      placeholder="Votre message..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-gold w-full inline-flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    Envoyer ma demande
                  </button>
                </form>

                <p className="caption mt-6 text-center">
                  * Champs obligatoires. Vos données sont protégées et ne seront jamais partagées.
                </p>
              </FadeInOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* Réassurance – fond noir */}
      <section className="section-spacing bg-black text-white">
        <div className="container-photo">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <p className="section-subtitle text-white mb-4">Engagements</p>
              <h2 className="section-title text-white mb-6">Pourquoi me faire confiance</h2>
              <div className="gold-line mx-auto"></div>
            </div>
          </FadeInOnScroll>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.1}>
            {reassurance.map((item, index) => (
              <StaggerItem key={index}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-[var(--color-gold)] rounded-full mb-4">
                    <item.icon size={24} />
                  </div>
                  <p className="text-gray-300 text-sm">{item.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Formats & Tarifs */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="max-w-2xl mx-auto">
            <FadeInOnScroll>
              <div className="text-center mb-12">
                <p className="section-subtitle mb-4">Tirages</p>
                <h2 className="section-title mb-6">Formats & Tarifs</h2>
                <div className="gold-line mx-auto"></div>
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.2}>
              <div className="bg-gray-50 rounded-sm overflow-hidden">
                {formats.map((format, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-6 ${index < formats.length - 1 ? 'border-b border-gray-200' : ''}`}
                  >
                    <span className="font-display font-semibold text-lg">{format.size}</span>
                    <span className="text-[var(--color-gold)] font-semibold">{format.price}</span>
                  </div>
                ))}
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                <Link to="/collections" className="btn-outline">
                  Voir la Galerie
                </Link>
                <a
                  href={photographer.social?.instagram || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  Instagram
                </a>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* CTA immersif */}
      <section
        className="relative py-32"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1627041193914-66f1cf8fbf4f)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container-photo text-center text-white">
          <FadeInOnScroll>
            <h2 className="section-title text-white mb-6">Explorez les Collections</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Découvrez l'ensemble de mes photographies méditerranéennes et trouvez l'œuvre qui sublimera votre intérieur.
            </p>
            <Link to="/collections" className="btn-gold">
              Voir les Collections
            </Link>
          </FadeInOnScroll>
        </div>
      </section>
    </div>
  );
};

export default Contact;
