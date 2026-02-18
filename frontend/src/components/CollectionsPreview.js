import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FadeInOnScroll, StaggerContainer, StaggerItem, ParallaxImage } from "./ScrollAnimations";

const CollectionsPreview = ({ collections = [] }) => {
  // Collections par défaut si vide
  const defaultCollections = [
    {
      id: "calanques",
      slug: "calanques",
      title: "Calanques",
      subtitle: "Marseille à La Ciotat",
      image: "/Calanques/Cover.jpg",
      coverImage: "/Calanques/Cover.jpg",
    },
    {
      id: "sunset",
      slug: "sunset",
      title: "Couchers de Soleil",
      subtitle: "Golden Hour",
      image: "/Sunset/Cover.JPEG",
      coverImage: "/Sunset/Cover.JPEG",
    },
  ];

  // 2 collections uniquement, rendu premium
  const displayCollections =
    Array.isArray(collections) && collections.length > 0
      ? collections.slice(0, 2)
      : defaultCollections.slice(0, 2);

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
              Deux séries. Deux ambiances. La Méditerranée, telle qu’elle se présente.
            </p>
          </div>
        </FadeInOnScroll>

        {/* Collections Grid - 2-up premium */}
        <StaggerContainer className="grid lg:grid-cols-2 gap-8 mb-12" staggerDelay={0.2}>
          {displayCollections.map((collection) => (
            <StaggerItem key={collection.id || collection.slug}>
              <Link
                to={`/collections/${collection.slug}`}
                className="group block relative h-[520px] overflow-hidden rounded-sm"
              >
                <ParallaxImage
                  src={collection.image || collection.coverImage}
                  alt={collection.title}
                  className="absolute inset-0"
                  speed={0.25}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />

                {/* Minimal meta */}
                <div className="absolute left-8 bottom-8 right-8">
                  <div className="text-white">
                    <h3 className="font-display text-3xl font-semibold leading-tight">
                      {collection.title}
                    </h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/80">
                      {collection.subtitle}
                    </p>
                  </div>

                  <div className="mt-5 inline-flex items-center gap-2 text-white/90 text-sm font-medium group-hover:text-[var(--color-gold)] transition-colors">
                    Explorer
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Hover border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--color-gold)] transition-colors duration-500 rounded-sm pointer-events-none" />
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA */}
        <FadeInOnScroll delay={0.4}>
          <div className="text-center">
            <Link to="/collections" className="btn-primary inline-flex items-center gap-2">
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
