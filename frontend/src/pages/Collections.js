import React, { useState } from 'react';
import { mockData } from '../mock';
import { Filter } from 'lucide-react';
import '../styles/photography.css';

const Collections = () => {
  const { collections } = mockData;
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Toutes' },
    { id: 'calanques', label: 'Calanques' },
    { id: 'ports', label: 'Ports' },
    { id: 'sunset', label: 'Couchers de Soleil' },
    { id: 'wild', label: 'Côte Sauvage' },
    { id: 'coves', label: 'Criques' },
    { id: 'seascapes', label: 'Paysages Maritimes' }
  ];

  const filteredCollections =
    selectedCategory === 'all'
      ? collections
      : collections.filter((c) => c.category === selectedCategory);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-black text-white">
        <div className="container-photo text-center">
          <p className="section-subtitle text-white mb-4">Portfolio</p>
          <h1 className="section-title text-white mb-6">Collections de Photographies</h1>
          <div className="gold-line mx-auto"></div>
          <p className="body-large text-gray-300 max-w-3xl mx-auto mt-6">
            Explorez mes collections de photographies maritimes, fruit de nombreuses heures passées à capturer la beauté de la Méditerranée.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-8 bg-gray-50 sticky top-20 z-40 border-b border-gray-200">
        <div className="container-photo">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <span className="font-semibold text-sm uppercase tracking-wider">Filtrer par :</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCollections.map((collection) => (
              <div key={collection.id} className="photo-card group cursor-pointer">
                <div className="image-container aspect-[4/5]">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="image-zoom"
                  />
                  <div className="image-overlay"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-display text-3xl font-semibold text-white mb-2 text-center">
                      {collection.title}
                    </h3>
                    <p className="text-white text-center mb-4">{collection.subtitle}</p>
                    <span className="text-sm text-gray-200 uppercase tracking-wider">
                      {collection.photoCount} Photographies
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-2">{collection.title}</h3>
                  <p className="caption mb-3">{collection.subtitle}</p>
                  <p className="body-text text-sm mb-4">{collection.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{collection.photoCount} photos</span>
                    <span className="text-sm font-semibold text-[var(--color-gold)] uppercase tracking-wider">
                      Explorer
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCollections.length === 0 && (
            <div className="text-center py-16">
              <p className="body-text">Aucune collection trouvée pour cette catégorie.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Collections;
