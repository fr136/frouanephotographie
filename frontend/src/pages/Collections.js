import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collectionsAPI } from "../services/api";
import SEOHead from "../components/SEOHead";
import "../styles/photography.css";

const Collections = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadCollections();
  }, []);

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

  const categories = [
    { id: "all", label: "Toutes" },
    { id: "calanques", label: "Calanques" },
    { id: "sunset", label: "Couchers de Soleil" },
  ];

  const filteredCollections = selectedCategory === "all"
    ? collections
    : collections.filter((c) => c.category === selectedCategory);

  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-32 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-gold)]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <SEOHead 
        title="Collections"
        description="Explorez les collections photographiques de Franck Rouane : calanques de Marseille, couchers de soleil méditerranéens. Tirages d'art en édition limitée."
        url="/collections"
      />
      {/* HERO */}
      <section className="pt-32 pb-16 text-white relative overflow-hidden" style={{
        backgroundImage: "url(/Calanques/Cover.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container-photo text-center relative z-10">
          <h1 className="section-title text-white mb-6">Collections</h1>
          <p className="body-large text-gray-300">Explorez mes photographies de la région.</p>
        </div>
      </section>

      {/* FILTER */}
      <section className="py-8 bg-gray-50 sticky top-20 z-40 border-b">
        <div className="container-photo flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-sm font-semibold uppercase transition-all ${
                selectedCategory === cat.id ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-100 border"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* GRID */}
      <section className="py-16 container-photo">
        <div className="grid md:grid-cols-2 gap-8">
          {filteredCollections.map((collection) => (
            <div
              key={collection.id}
              className="photo-card group cursor-pointer"
              onClick={() => navigate(`/collections/${collection.slug}`)}
            >
              <div className="image-container aspect-[4/5] overflow-hidden relative">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{collection.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{collection.description}</p>
                <div className="flex justify-between items-center">
                   <span className="text-xs text-gray-400 uppercase">{collection.photoCount} photos</span>
                   <span className="text-sm font-bold text-[var(--color-gold)]">Explorer →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Collections;
