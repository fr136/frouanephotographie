import React, { useState } from 'react';
import { mockData } from '../mock';
import { ShoppingCart, Eye } from 'lucide-react';
import '../styles/photography.css';

const Shop = () => {
  const { featuredProducts } = mockData;
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Toutes' },
    { id: 'calanques', label: 'Calanques' },
    { id: 'ports', label: 'Ports' },
    { id: 'sunset', label: 'Couchers de Soleil' },
    { id: 'wild', label: 'Côte Sauvage' }
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? featuredProducts
      : featuredProducts.filter((p) => p.category === selectedCategory);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-black text-white">
        <div className="container-photo text-center">
          <p className="section-subtitle text-white mb-4">Boutique</p>
          <h1 className="section-title text-white mb-6">Tirages d'Art en Édition Limitée</h1>
          <div className="gold-line mx-auto"></div>
          <p className="body-large text-gray-300 max-w-3xl mx-auto mt-6">
            Découvrez ma collection de tirages d'art, chaque œuvre est numérotée, signée et imprimée sur papier Fine Art de qualité muséale.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-gray-50">
        <div className="container-photo">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="photo-card group">
                <div className="image-container aspect-[4/5] relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="image-zoom"
                  />
                  <div className="absolute top-4 right-4 bg-[var(--color-gold)] text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                    Édition Limitée
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-black px-6 py-3 font-semibold uppercase tracking-wider text-sm flex items-center gap-2 hover:bg-[var(--color-gold)] hover:text-white">
                      <Eye size={18} />
                      Voir Détails
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <p className="caption mb-2">{product.location}</p>
                  <h3 className="font-display text-xl font-semibold mb-3">{product.title}</h3>
                  <p className="body-text text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Formats disponibles :</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size, idx) => (
                        <span key={idx} className="text-xs border border-gray-300 px-2 py-1">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-2xl font-semibold text-[var(--color-gold)]">
                        à partir de {product.price}€
                      </p>
                      <p className="caption">{product.edition}</p>
                    </div>
                    <button className="bg-black text-white p-3 hover:bg-[var(--color-gold)] transition-colors" aria-label="Ajouter au panier">
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="body-text">Aucun produit trouvé pour cette catégorie.</p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="section-spacing bg-gray-50">
        <div className="container-photo">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">Informations sur les Tirages</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8">
                <h3 className="font-display text-xl font-semibold mb-4">Qualité & Support</h3>
                <p className="body-text">
                  Tous les tirages sont réalisés sur papier Fine Art 100% coton, sans acide, garantissant une conservation optimale et une longue durée de vie. Les impressions sont réalisées avec des encres pigmentaires de qualité archive.
                </p>
              </div>
              <div className="bg-white p-8">
                <h3 className="font-display text-xl font-semibold mb-4">Édition Limitée</h3>
                <p className="body-text">
                  Chaque photographie est imprimée en nombre limité (10 à 25 exemplaires), numérotée et signée par l'artiste. Cette exclusivité garantit la valeur et l'unicité de votre acquisition.
                </p>
              </div>
              <div className="bg-white p-8">
                <h3 className="font-display text-xl font-semibold mb-4">Livraison Sécurisée</h3>
                <p className="body-text">
                  Les tirages sont expédiés soigneusement emballés dans des tubes rigides ou des cartons renforcés pour garantir leur protection durant le transport. Livraison en France et en Europe.
                </p>
              </div>
              <div className="bg-white p-8">
                <h3 className="font-display text-xl font-semibold mb-4">Certificat d'Authenticité</h3>
                <p className="body-text">
                  Chaque tirage est accompagné d'un certificat d'authenticité détaillé, incluant le numéro d'édition, les caractéristiques techniques et la signature de l'artiste.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
