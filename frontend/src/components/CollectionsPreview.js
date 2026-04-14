import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FadeInOnScroll, StaggerContainer, StaggerItem } from './ScrollAnimations';
import { collectionsAPI } from '../services/api';

const CollectionsPreview = ({ collections: propCollections = [] }) => {
  const [fallbackCollections, setFallbackCollections] = useState([]);

  useEffect(() => {
    if (propCollections.length === 0) {
      collectionsAPI.getAll().then(data => {
        setFallbackCollections(Array.isArray(data) ? data.slice(0, 2) : []);
      }).catch(() => {});
    }
  }, [propCollections]);

  const displayCollections = propCollections.length > 0
    ? propCollections.slice(0, 2)
    : fallbackCollections;

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

        {/* Collections Grid - 2 colonnes égales */}
        <StaggerContainer className="grid md:grid-cols-2 gap-8 mb-12" staggerDelay={0.2}>
          {displayCollections.map((collection) => (
            <StaggerItem key={collection.id}>
              <Link 
                to={`/collections/${collection.slug}`}
                className="group block relative h-[500px] overflow-hidden rounded-sm"
              >
                {/* Image avec effet zoom */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-[var(--color-gold)] text-sm uppercase tracking-wider mb-2 block">
                      {collection.photoCount} photos
                    </span>
                    <h3 className="font-display text-3xl md:text-4xl font-semibold text-white mb-3">
                      {collection.title}
                    </h3>
                    <p className="text-gray-300 mb-4 max-w-md">
                      {collection.description}
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
          ))}
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
