import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { mockData } from '../mock';
import '../styles/photography.css';
import { toast } from '../hooks/use-toast';

const Contact = () => {
  const { photographer } = mockData;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
    // Mock form submission
    console.log('Form submitted:', formData);
    toast({
      title: "Message envoyé !",
      description: "Merci pour votre message. Je vous répondrai dans les plus brefs délais."
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-black text-white">
        <div className="container-photo text-center">
          <p className="section-subtitle text-white mb-4">Contact</p>
          <h1 className="section-title text-white mb-6">Entrons en Contact</h1>
          <div className="gold-line mx-auto"></div>
          <p className="body-large text-gray-300 max-w-3xl mx-auto mt-6">
            Une question sur mes tirages ? Un projet photographique ? Je serais ravi d'échanger avec vous.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
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
                    <p className="body-text">{photographer.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[var(--color-gold)] text-white rounded-full flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Zone d'activité</h3>
                    <p className="body-text">Côte d'Azur - de Marseille à Monaco</p>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="mt-12 image-container aspect-[4/3] rounded-sm overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1712227609859-2818504d07cb"
                  alt="Côte d'Azur"
                  className="image-zoom"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="section-title mb-6">Envoyez-moi un Message</h2>
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
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block font-semibold mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent"
                    placeholder="Sujet de votre message"
                  />
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
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent resize-none"
                    placeholder="Votre message..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gold w-full inline-flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Envoyer le Message
                </button>
              </form>

              <p className="caption mt-6 text-center">
                * Champs obligatoires. Vos données sont protégées et ne seront jamais partagées.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Optional - using placeholder) */}
      <section className="h-96 bg-gray-200">
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-500">Carte interactive de la Côte d'Azur (Marseille - Monaco)</p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
