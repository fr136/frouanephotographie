import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FadeInOnScroll, StaggerContainer, StaggerItem, ParallaxImage } from './ScrollAnimations';

const CollectionsPreview = ({ collections = [] }) => {
  // Collections par défaut si vide
  const defaultCollections = [
    {
      id: 'calanques',
      slug: 'calanques',
      title: 'Calanques',
      subtitle: 'Marseille à La Ciotat',
      description: 'La beauté sauvage des fjords méditerranéens',
      image: '/Calanques/Cover.jpg',
      photoCount: 31
    },
    {
      id: 'sunset',
      slug: 'sunset',
      title: 'Couchers de Soleil',
      subtitle: 'Golden Hour',
      description: "L'or de la Méditerranée au crépuscule",
      image: '/Sunset/Cover.JPEG',
      photoCount: 11
    }
  ];

  const displayCollections = collections.length > 0 ? collections.slice(0, 3) : defaultCollections;

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container-photo">
        {/* Header */}
        <FadeInOnScroll>
          <div className="text-center mb-16">
            <p className="section-subtitle mb-4">Portfolio</p>
            <h2 className="section-title mb-6">Explorez les Collections</h2>
            <div className="gold-line mx-auto"></div>
            <p className="body-text max-w-2xl mx-auto mt-6">
              Plongez dans l'univers méditerranéen à travers mes collections photographiques. 
              Chaque série raconte une histoire unique.
            </p>
          </div>
        </FadeInOnScroll>

        {/* Collections Grid */}
        <StaggerContainer className="grid lg:grid-cols-2 gap-8 mb-12" staggerDelay={0.2}>
          {/* Grande carte à gauche */}
          <StaggerItem>
            <Link 
              to={`/collections/${displayCollections[0]?.slug}`}
              className="group block relative h-[600px] overflow-hidden rounded-sm"
            >
              <ParallaxImage
                src={displayCollections[0]?.image}
                alt={displayCollections[0]?.title}
                className="absolute inset-0"
                speed={0.3}
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-[var(--color-gold)] text-sm uppercase tracking-wider mb-2 block">
                    {displayCollections[0]?.photoCount} photos
                  </span>
                  <h3 className="font-display text-4xl font-semibold text-white mb-3">
                    {displayCollections[0]?.title}
                  </h3>
                  <p className="text-gray-300 mb-4 max-w-md">
                    {displayCollections[0]?.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-white font-medium group-hover:text-[var(--color-gold)] transition-colors">
                    Découvrir la collection
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                </motion.div>
              </div>

              {/* Hover effect border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--color-gold)] transition-colors duration-500 rounded-sm pointer-events-none" />
            </Link>
          </StaggerItem>

          {/* Cartes à droite */}
          <div className="flex flex-col gap-8">
            {displayCollections.slice(1, 3).map((collection, index) => (
              <StaggerItem key={collection.id}>
                <Link 
                  to={`/collections/${collection.slug}`}
                  className="group block relative h-[284px] overflow-hidden rounded-sm"
                >
                  <ParallaxImage
                    src={collection.image}
                    alt={collection.title}
                    className="absolute inset-0"
                    speed={0.2}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex items-center p-8">
                    <div>
                      <span className="text-[var(--color-gold)] text-sm uppercase tracking-wider mb-2 block">
                        {collection.photoCount} photos
                      </span>
                      <h3 className="font-display text-2xl font-semibold text-white mb-2">
                        {collection.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-3 max-w-xs">
                        {collection.description}
                      </p>
                      <span className="inline-flex items-center gap-2 text-white text-sm font-medium group-hover:text-[var(--color-gold)] transition-colors">
                        Explorer
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>

                  {/* Hover border */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--color-gold)] transition-colors duration-500 rounded-sm pointer-events-none" />
                </Link>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {/* CTA */}
        <FadeInOnScroll delay={0.4}>
          <div className="text-center">
            <Link 
              to="/collections" 
              className="btn-primary inline-flex items-center gap-2"
            >
              Voir toutes les collections
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
};

export default CollectionsPreview;
