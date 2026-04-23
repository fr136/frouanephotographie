import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FadeInOnScroll, StaggerContainer, StaggerItem } from "./ScrollAnimations";
import { collectionsAPI } from "../services/api";

const getCollectionCardClassName = (index) => {
  if (index === 0) {
    return "collections-preview-card collections-preview-card--featured group";
  }

  if (index === 1) {
    return "collections-preview-card collections-preview-card--secondary group";
  }

  return "collections-preview-card collections-preview-card--tertiary group";
};

const CollectionsPreview = ({ collections: propCollections = [] }) => {
  const [fallbackCollections, setFallbackCollections] = useState([]);

  useEffect(() => {
    if (propCollections.length === 0) {
      collectionsAPI
        .getAll()
        .then((data) => {
          setFallbackCollections(Array.isArray(data) ? data : []);
        })
        .catch(() => {});
    }
  }, [propCollections]);

  const displayCollections = propCollections.length > 0 ? propCollections : fallbackCollections;

  return (
    <section className="w-full px-0 py-24 bg-[#f5f1ea] overflow-hidden">
      <div className="px-6 md:px-8 xl:px-10 2xl:px-12">
        <FadeInOnScroll>
          <div className="text-center mb-14">
            <p className="section-subtitle mb-4">Collections</p>
            <h2 className="section-title mb-6">Trois collections</h2>
            <div className="gold-line mx-auto" />
          </div>
        </FadeInOnScroll>
      </div>

      <div className="collections-preview-breakout">
        <StaggerContainer className="collections-preview-grid mb-12" staggerDelay={0.18}>
          {displayCollections.map((collection, index) => (
            <StaggerItem key={collection.id}>
              <article className={getCollectionCardClassName(index)}>
                <div
                  className="collections-preview-media"
                  style={{ backgroundImage: `url(${collection.image})` }}
                />
                <div className="collections-preview-overlay" />
                <div className="collections-preview-hoverveil" />

                <div className="collections-preview-content">
                  <div>
                    <p className="collections-preview-kicker">
                      <span>{collection.photoCount} photographies</span>
                      {collection.hasSubcollections ? (
                        <>
                          <span aria-hidden="true">/</span>
                          <span>{collection.subcollectionCount} lieux</span>
                        </>
                      ) : null}
                    </p>
                    <h3 className="collections-preview-title">{collection.title}</h3>
                    <p className="collections-preview-label">
                      {collection.hasSubcollections ? collection.subtitle : collection.anchor}
                    </p>
                  </div>

                  <div className="collections-preview-actions">
                    <Link to={`/collections/${collection.slug}`} className="collections-preview-cta">
                      <span>Voir la collection</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      <div className="px-6 md:px-8 xl:px-10 2xl:px-12">
        <FadeInOnScroll delay={0.3}>
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
