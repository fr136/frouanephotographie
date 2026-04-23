import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { collectionsAPI } from "../services/api";
import SEOHead from "../components/SEOHead";
import "../styles/photography.css";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await collectionsAPI.getAll();
        setCollections(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur chargement collections:", error);
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };

    loadCollections();
  }, []);

  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-32 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-gold)]" />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <SEOHead
        title="Collections"
        description="Collections photographiques de Franck Rouane : Calanques & littoral méditerranéen, couchers de soleil et lever de soleil, de Marseille au littoral varois."
        url="/collections"
      />

      <section
        className="pt-32 pb-20 text-white relative overflow-hidden"
        style={{
          backgroundImage: "url(/Calanques/Cover.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="container-photo text-center relative z-10 max-w-4xl">
          <p className="text-[var(--color-gold)] text-sm uppercase tracking-[0.35em] mb-5">Marseille · Calanques · Littoral</p>
          <h1 className="section-title text-white mb-6">Collections photographiques</h1>
          <p className="body-large text-gray-200 max-w-3xl mx-auto">
            Trois collections, du massif des Calanques jusqu'au littoral varois.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-photo space-y-10">
          {collections.map((collection) => (
            <article
              key={collection.id}
              className="grid xl:grid-cols-[1.15fr_0.85fr] gap-0 border border-[var(--color-gray-200)] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden"
            >
              <div className="relative min-h-[420px]">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${collection.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
                <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-10 text-white">
                  <p className="text-[var(--color-gold)] text-xs uppercase tracking-[0.3em] mb-3">
                    {collection.photoCount} photographies
                  </p>
                  <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4">{collection.title}</h2>
                  <p className="text-white/75 text-sm uppercase tracking-[0.22em]">{collection.subtitle}</p>
                </div>
              </div>

              <div className="p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-sm uppercase tracking-[0.18em] text-[var(--color-gray-500)] mb-6">
                    <MapPin size={16} />
                    <span>{collection.anchor}</span>
                  </div>

                  {collection.hasSubcollections ? (
                    <div className="mb-8">
                      <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-gray-500)] mb-3">Lieux</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {collection.subcollections.map((subcollection) => (
                          <Link
                            key={subcollection.id}
                            to={`/collections/${collection.slug}?lieu=${subcollection.slug}`}
                            className="group border border-[var(--color-gray-200)] px-4 py-4 transition-colors hover:border-[var(--color-gold)]"
                          >
                            <div className="flex items-center justify-between gap-4 mb-2">
                              <h3 className="font-display text-xl text-[var(--color-gray-900)] group-hover:text-[var(--color-gold)] transition-colors">
                                {subcollection.title}
                              </h3>
                              <span className="text-xs uppercase tracking-[0.16em] text-[var(--color-gray-500)]">
                                {subcollection.photoCount} photo{subcollection.photoCount > 1 ? "s" : ""}
                              </span>
                            </div>
                            <p className="text-sm text-[var(--color-gray-600)]">{subcollection.location}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div
                  className={`flex flex-wrap items-center gap-4 pt-6 border-t border-[var(--color-gray-200)] ${
                    collection.hasSubcollections ? "justify-between" : "justify-end"
                  }`}
                >
                  {collection.hasSubcollections ? (
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-gray-500)]">
                      {collection.subcollectionCount} lieux
                    </p>
                  ) : null}
                  <Link
                    to={`/collections/${collection.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-gray-900)] hover:text-[var(--color-gold)] transition-colors"
                  >
                    Ouvrir la collection
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Collections;
