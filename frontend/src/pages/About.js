import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, MapPin, Compass, Leaf } from 'lucide-react';
import { mockData } from '../mock';
import { FadeInOnScroll, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';
import SEOHead from '../components/SEOHead';
import '../styles/photography.css';

const About = () => {
  const { photographer, services, faq } = mockData;
  const aboutHeroImage = '/about/about-hero.jpg';
  const aboutProfileImage = '/about/about-who-am-i.jpg';
  const aboutMarseilleCalanquesImage = '/about/about-marseille-calanques.jpg';
  const aboutCassisImage = '/about/about-cassis.jpg';
  const aboutLaCiotatImage = '/about/about-la-ciotat.jpg';
  const aboutVarImage = '/about/about-var.jpg';

  const travelJournals = [
    {
      id: 1,
      title: 'Marseille & Calanques',
      desc: 'Exploration des calanques sauvages aux eaux turquoise et falaises dorées. Ces criques secrètes offrent des panoramas uniques à quelques encablures de la ville.',
      image: aboutMarseilleCalanquesImage
    },
    {
      id: 2,
      title: 'Cassis',
      desc: 'Village de pêcheurs niché au pied du Cap Canaille, Cassis mêle ports colorés et falaises vertigineuses. Chaque coucher de soleil y est une fête.',
      image: aboutCassisImage
    },
    {
      id: 3,
      title: 'La Ciotat',
      desc: 'Entre vieille ville et calanques discrètes, La Ciotat révèle des paysages maritimes paisibles et des lumières dorées au crépuscule.',
      image: aboutLaCiotatImage
    },
    {
      id: 4,
      title: 'VAR',
      desc: 'De Bandol à Sanary, jusqu’aux criques plus secrètes du littoral varois, le Var offre une Méditerranée lumineuse, minérale et toujours changeante.',
      image: aboutVarImage
    }
  ];

  return (
    <div className="bg-white">
      <SEOHead 
        title="À Propos"
        description="Franck Rouane, photographe de paysages méditerranéens basé à Marseille. Découvrez mon parcours, ma philosophie et mes terrains de jeu entre calanques et littoral varois."
        url="/a-propos"
      />

      {/* Hero plein écran avec parallax */}
      <section
        className="relative min-h-[80vh] flex items-center justify-center"
        style={{
          backgroundImage: `url('${aboutHeroImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 62%',
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
            Photographe
          </motion.p>
          <motion.h1
            className="hero-title mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {photographer.name}
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
            {photographer.tagline}
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.5, y: { repeat: Infinity, duration: 2 } }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Qui suis-je */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeInOnScroll direction="left">
              <div className="image-container aspect-[3/4] rounded-sm overflow-hidden">
                <img
                  src={aboutProfileImage}
                  loading="lazy"
                  alt="Paysage méditerranéen photographié par Franck Rouane"
                  className="image-zoom"
                />
              </div>
            </FadeInOnScroll>
            <FadeInOnScroll direction="right" delay={0.2}>
              <div>
                <h2 className="section-title mb-6">Qui suis-je</h2>
                <div className="gold-line mb-6"></div>
                <p className="body-large mb-4">
                  Photographe depuis l'enfance, ma passion est née de l'envie de capturer les paysages du quotidien pour les partager et les revivre.
                </p>
                <p className="body-large mb-4">
                  Basé à Marseille, je navigue régulièrement vers Cassis, La Ciotat et le Var, entre Bandol, Sanary et les criques plus discrètes, pour photographier leurs paysages maritimes.
                </p>
                <p className="body-large mb-4">
                  Convaincu que la Méditerranée regorge d'endroits "pépites", je préfère révéler ces trésors proches plutôt que de partir aux Maldives ou aux Seychelles.
                </p>
                <p className="body-large">
                  Mer de plusieurs continents et cultures, la Méditerranée est riche en histoire et en diversité de paysages que je m'attache à immortaliser.
                </p>
                <p className="body-large mt-4">
                  Retrouvez mes captures vidéo de la Méditerranée provençale sur ma{' '}
                  <a
                    href="https://www.youtube.com/@FRCRMLN13"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-gold)] underline hover:opacity-75 transition-opacity"
                  >
                    chaîne YouTube
                  </a>.
                </p>
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={20} className="text-[var(--color-gold)]" />
                      <span className="font-semibold">Localisation</span>
                    </div>
                    <p className="caption">Marseille, Cassis, La Ciotat, Var</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Camera size={20} className="text-[var(--color-gold)]" />
                      <span className="font-semibold">Spécialité</span>
                    </div>
                    <p className="caption">Photographie maritime & paysages méditerranéens</p>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Philosophie – fond noir immersif */}
      <section className="section-spacing bg-black text-white">
        <div className="container-photo">
          <FadeInOnScroll>
            <div className="max-w-4xl mx-auto text-center">
              <p className="section-subtitle text-white mb-4">Approche</p>
              <h2 className="section-title text-white mb-6">Ce que je cherche en photographiant</h2>
              <div className="gold-line mx-auto mb-10"></div>
            </div>
          </FadeInOnScroll>

          <StaggerContainer className="grid md:grid-cols-3 gap-12" staggerDelay={0.15}>
            <StaggerItem>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-gold)] rounded-full mb-6">
                  <Camera size={32} />
                </div>
                <h3 className="font-display text-xl font-semibold mb-4">Capturer l'invisible</h3>
                <p className="text-gray-400">
                  La puissance et la beauté de notre planète sont devant nous chaque jour, mais on ne prend pas le temps de les admirer. Mon objectif les révèle.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-gold)] rounded-full mb-6">
                  <Leaf size={32} />
                </div>
                <h3 className="font-display text-xl font-semibold mb-4">Sensibiliser</h3>
                <p className="text-gray-400">
                  À travers mon objectif, je cherche à sensibiliser au respect de la Terre. La photographie alerte en montrant la beauté de ce que nous risquons de perdre.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-gold)] rounded-full mb-6">
                  <Compass size={32} />
                </div>
                <h3 className="font-display text-xl font-semibold mb-4">Partager</h3>
                <p className="text-gray-400">
                  Partager ces images pour que les gens s'arrêtent, admirent, et peut-être respectent davantage la nature qui nous entoure.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Terrains de jeu – grille immersive */}
      <section className="section-spacing">
        <div className="container-photo">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <p className="section-subtitle mb-4">Explorations</p>
              <h2 className="section-title mb-6">Mes terrains de jeu</h2>
              <div className="gold-line mx-auto"></div>
            </div>
          </FadeInOnScroll>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {travelJournals.map((spot, index) => (
              <FadeInOnScroll key={spot.id} delay={index * 0.1}>
                <article className="photo-card group cursor-pointer">
                  <div className="image-container aspect-[16/10] overflow-hidden relative">
                    <img
                      src={spot.image}
                      alt={spot.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="font-display text-xl font-semibold text-white">
                        {spot.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="body-text text-sm">{spot.desc}</p>
                  </div>
                </article>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-spacing bg-gray-50">
        <div className="container-photo">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <p className="section-subtitle mb-4">Prestations</p>
              <h2 className="section-title mb-6">Tirages, commandes et expositions</h2>
              <div className="gold-line mx-auto"></div>
            </div>
          </FadeInOnScroll>

          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {services.map((service) => (
              <StaggerItem key={service.id}>
                <div className="bg-white p-8 text-center hover:shadow-lg transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-gold)] rounded-full mb-6">
                    {service.icon === 'image' && <Camera size={32} className="text-white" />}
                    {service.icon === 'palette' && <Compass size={32} className="text-white" />}
                    {service.icon === 'gallery-horizontal' && <MapPin size={32} className="text-white" />}
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-4">{service.title}</h3>
                  <p className="body-text">{service.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="max-w-4xl mx-auto">
            <FadeInOnScroll>
              <div className="text-center mb-16">
                <h2 className="section-title mb-6">Questions Fréquentes</h2>
                <div className="gold-line mx-auto"></div>
              </div>
            </FadeInOnScroll>
            <div className="space-y-6">
              {faq.map((item, index) => (
                <FadeInOnScroll key={item.id} delay={index * 0.08}>
                  <div className="bg-gray-50 p-8 rounded-sm hover:shadow-md transition-shadow duration-300">
                    <h3 className="font-display text-lg font-semibold mb-3">{item.question}</h3>
                    <p className="body-text">{item.answer}</p>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA immersif avec image de fond */}
      <section
        className="relative py-32"
        style={{
          backgroundImage: "url('/Calanques/cap-canaille01.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container-photo text-center text-white">
          <FadeInOnScroll>
            <h2 className="section-title text-white mb-6">Un projet, une commande ?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Commande personnalisée, format spécifique ou question sur un tirage — je suis disponible par email ou via le formulaire de contact.
            </p>
            <Link to="/contact" className="btn-gold">
              Me contacter
            </Link>
          </FadeInOnScroll>
        </div>
      </section>
    </div>
  );
};

export default About;
