import React from 'react';
import { mockData } from '../mock';
import { Camera, Heart, Award, MapPin } from 'lucide-react';
import '../styles/photography.css';

const About = () => {
  const { photographer, services, faq } = mockData;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-black text-white">
        <div className="container-photo text-center">
          <p className="section-subtitle text-white mb-4">L'Artiste</p>
          <h1 className="section-title text-white mb-6">{photographer.name}</h1>
          <div className="gold-line mx-auto"></div>
          <p className="body-large text-gray-300 max-w-3xl mx-auto mt-6">
            {photographer.tagline}
          </p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="image-container aspect-[3/4] rounded-sm overflow-hidden order-2 md:order-1">
              <img
                src="https://images.unsplash.com/photo-1672861864274-6b24d19b578d"
                alt={photographer.name}
                className="image-zoom"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="section-title mb-6">Mon Histoire</h2>
              <div className="gold-line mb-6"></div>
              <p className="body-large mb-6">{photographer.bio}</p>
              <p className="body-text mb-8">{photographer.longBio}</p>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={20} className="text-[var(--color-gold)]" />
                    <span className="font-semibold">Localisation</span>
                  </div>
                  <p className="caption">Marseille - Monaco</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Camera size={20} className="text-[var(--color-gold)]" />
                    <span className="font-semibold">Spécialité</span>
                  </div>
                  <p className="caption">Paysage Maritime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-spacing bg-gray-50">
        <div className="container-photo">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="section-title mb-6">Ma Philosophie Photographique</h2>
            <div className="gold-line mx-auto mb-8"></div>
            <p className="body-large mb-6">
              La photographie maritime est pour moi bien plus qu'une simple capture d'image. C'est une méditation, un dialogue avec les éléments, une quête de lumière et d'émotion.
            </p>
            <p className="body-text">
              Je crois que les plus belles photographies naissent de la patience et de l'observation. Attendre le moment où la lumière caresse parfaitement la mer, où les nuages dessinent des formes uniques dans le ciel, où la nature révèle sa beauté la plus authentique. Mon objectif est de vous transmettre ces émotions, de vous faire ressentir le calme d'une aube sur les calanques ou la puissance des vagues sur la côte sauvage.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="text-center mb-16">
            <h2 className="section-title mb-6">Mes Services</h2>
            <div className="gold-line mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-gray-50 p-8 text-center hover:bg-white hover:shadow-lg transition-all">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-gold)] rounded-full mb-6">
                  {service.icon === 'image' && <Camera size={32} className="text-white" />}
                  {service.icon === 'palette' && <Heart size={32} className="text-white" />}
                  {service.icon === 'gallery-horizontal' && <Award size={32} className="text-white" />}
                </div>
                <h3 className="font-display text-xl font-semibold mb-4">{service.title}</h3>
                <p className="body-text">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-spacing bg-gray-50">
        <div className="container-photo">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title mb-6">Questions Fréquentes</h2>
              <div className="gold-line mx-auto"></div>
            </div>

            <div className="space-y-6">
              {faq.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-sm">
                  <h3 className="font-display text-lg font-semibold mb-3">{item.question}</h3>
                  <p className="body-text">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="bg-black text-white p-16 text-center rounded-sm">
            <h2 className="section-title text-white mb-6">Travaillons Ensemble</h2>
            <p className="body-large text-gray-300 mb-8 max-w-2xl mx-auto">
              Vous avez un projet photographique en tête ? Une commande spéciale ? N'hésitez pas à me contacter pour en discuter.
            </p>
            <a href="/contact" className="btn-gold">
              Me Contacter
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
