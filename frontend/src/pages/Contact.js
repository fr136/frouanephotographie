import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, Image, Truck, Award, Clock } from 'lucide-react';
import { mockData } from '../mock';
import { FadeInOnScroll, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';
import SEOHead from '../components/SEOHead';
import { contactAPI } from '../services/api';
import { toast } from '../hooks/use-toast';
import '../styles/photography.css';

const Contact = () => {
  const { photographer } = mockData;
  const contactHeroImage = '/contact/contact-hero.jpg';
  const contactIllustrationImage = '/contact/contact-illustration.jpg';
  const contactCtaImage = '/contact/contact-cta.jpg';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Validation ─────────────────────────────────────────────────────────────
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^[+]?[\d\s\-().]{6,20}$/;
  const MSG_MAX  = 2000;

  const stripHtml = (str) => str.replace(/<[^>]*>/g, '').replace(/[<>]/g, '');

  const validate = (data) => {
    const e = {};
    if (!data.name.trim() || data.name.trim().length < 2)
      e.name = 'Le nom doit contenir au moins 2 caractères.';
    if (data.name.trim().length > 100)
      e.name = 'Le nom ne peut pas dépasser 100 caractères.';
    if (!EMAIL_RE.test(data.email))
      e.email = 'Adresse email invalide.';
    if (data.phone && !PHONE_RE.test(data.phone))
      e.phone = 'Format de téléphone invalide.';
    if (!data.subject)
      e.subject = 'Veuillez sélectionner un sujet.';
    if (!data.message.trim() || data.message.trim().length < 10)
      e.message = 'Le message doit contenir au moins 10 caractères.';
    if (data.message.length > MSG_MAX)
      e.message = `Le message ne peut pas dépasser ${MSG_MAX} caractères.`;
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate(formData);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setLoading(true);
    try {
      const sanitized = {
        ...formData,
        name:    formData.name.trim().slice(0, 100),
        message: stripHtml(formData.message).slice(0, MSG_MAX),
        phone:   formData.phone.trim().slice(0, 20),
      };
      await contactAPI.submit(sanitized);
      toast({
        title: 'Message envoyé !',
        description: 'Merci pour votre message. Je vous répondrai dans les plus brefs délais.'
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le message. Veuillez réessayer.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
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
      <SEOHead 
        title="Contact"
        description="Contactez Franck Rouane pour vos tirages d'art, commandes personnalisées ou projets photographiques. Basé à Marseille, côte méditerranéenne."
        url="/contact"
      />

      {/* Hero plein écran */}
      <section
        className="relative min-h-[70vh] flex items-center justify-center"
        style={{
          backgroundImage: `url('${contactHeroImage}')`,
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
                  N'hésitez pas à me contacter pour toute question concernant mes œuvres, une commande personnalisée, ou simplement pour discuter de paysages méditerranéens.
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
                    src={contactIllustrationImage}
                    loading="lazy"
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

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div>
                    <label htmlFor="name" className="block font-semibold mb-2">Nom complet *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      maxLength={100}
                      className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent transition-all ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                      placeholder="Votre nom"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block font-semibold mb-2">Adresse email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent transition-all ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                      placeholder="votre@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block font-semibold mb-2">Téléphone (optionnel)</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={20}
                      className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent transition-all ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
                      placeholder="+33 6 12 34 56 78"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block font-semibold mb-2">Sujet *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent transition-all ${errors.subject ? 'border-red-400' : 'border-gray-300'}`}
                    >
                      <option value="">-- Sélectionner un sujet --</option>
                      <option value="Commande tirage">Commande tirage</option>
                      <option value="Tirage personnalisé">Tirage personnalisé</option>
                      <option value="Renseignements">Renseignements</option>
                      <option value="Collaboration">Collaboration</option>
                    </select>
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block font-semibold mb-2">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      maxLength={MSG_MAX}
                      rows={6}
                      className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent resize-none transition-all ${errors.message ? 'border-red-400' : 'border-gray-300'}`}
                      placeholder="Votre message..."
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.message
                        ? <p className="text-red-500 text-xs">{errors.message}</p>
                        : <span />}
                      <span className={`text-xs ${formData.message.length > MSG_MAX * 0.9 ? 'text-orange-500' : 'text-gray-400'}`}>
                        {formData.message.length}/{MSG_MAX}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gold w-full inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      : <Send size={18} />}
                    {loading ? 'Envoi en cours…' : 'Envoyer ma demande'}
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
          backgroundImage: `url('${contactCtaImage}')`,
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
