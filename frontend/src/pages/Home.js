import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Award, Heart } from 'lucide-react';
import { collectionsAPI, photosAPI } from '../services/api';
import { mockData } from '../mock';
import '../styles/photography.css';

const Home = () => {
  const { photographer, testimonials } = mockData;
  const [collections, setCollections] = useState([]);
  const [featuredPhotos, setFeaturedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [collectionsData, photosData] = await Promise.all([
        collectionsAPI.getAll(),
        photosAPI.getAll({ limit: 6 })
      ]);
      setCollections(collectionsData);
      setFeaturedPhotos(photosData.photos || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
const safeCollections = Array.isArray(collections)
? collections
: (collections && typeof collections === "object")
? Object.values(collections)
: [];
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-0"
        style={{
          backgroundImage: "url('/sunrise-laciotat.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10 text-center px-4 max-w-md sm:max-w-2xl mx-auto">
          <p className="section-subtitle text-white mb-4 fade-in">{photographer.specialty}</p>
          <h1 className="hero-title mb-6 fade-in" style={{ animationDelay: '0.2s' }}>
                     </h1>
          <p className="text-white text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto fade-in" style={{ animationDelay: '0.4s' }}>
            {photographer.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in" style={{ animationDelay: '0.6s' }}>
            <Link to="/collections" className="btn-gold w-full sm:w-auto">
              Découvrir les Collections
            </Link>
            <Link to="/boutique" className="btn-outline w-full sm:w-auto" style={{ borderColor: 'white', color: 'white'  }}>
                  Voir la Boutique
            </Link>
          </div>
        </div>
      </section>
          {/* About Preview */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-title mb-6"> Photographies de la méditerranée </h2>
              <div className="gold-line"></div>
              <p className="body-large mb-6">{photographer.bio}</p>
              <Link to="/a-propos" className="btn-outline inline-flex items-center gap-2">
                En Savoir Plus
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="image-container aspect-[4/5] rounded-sm overflow-hidden">
              <img
                src="/Salon-sormiou.png"
                alt="Salon luxueux sormiou"
                className="image-zoom"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Collections Preview */}
      <section className="section-spacing bg-gray-50">
        <div className="container-photo">
          <div className="text-center mb-16">
            <p className="section-subtitle mb-4">Portfolio</p>
            <h2 className="section-title mb-6">Collections de Photographies</h2>
            <div className="gold-line mx-auto"></div>
            <p className="body-text max-w-2xl mx-auto mt-6">
              Explorez mes collections de photographies .
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safeCollections.slice(0, 6).map((collection) => (
              <Link 
                key={collection.id} 
                to={`/collections/${collection.slug}`}
                className="photo-card group"
              >
                <div className="image-container aspect-[4/5]">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="image-zoom"
                  />
                  <div className="image-overlay"></div>
                  <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white">
                      <h3 className="font-display text-2xl font-semibold mb-2">{collection.title}</h3>
                      <p className="text-sm text-gray-200">{collection.photoCount} photographies</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-2">{collection.title}</h3>
                  <p className="caption mb-4">{collection.subtitle}</p>
                  <p className="body-text text-sm">{collection.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/collections" className="btn-primary">
              Voir Toutes les Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="text-center mb-16">
            <p className="section-subtitle mb-4">Tirages d'Art</p>
            <h2 className="section-title mb-6">Œuvres Disponibles</h2>
            <div className="gold-line mx-auto"></div>
            <p className="body-text max-w-2xl mx-auto mt-6">
              Découvrez une sélection de tirages d'art en édition limitée, numérotés et signés.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPhotos.slice(0, 3).map((photo) => (
              <div key={photo.id} className="photo-card">
                <div className="image-container aspect-[4/5]">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="image-zoom"
                  />
                </div>
                <div className="p-6">
                  <p className="caption mb-2">{photo.location?.name || 'Côte d\'Azur'}</p>
                  <h3 className="font-display text-xl font-semibold mb-3">{photo.title}</h3>
                  <p className="body-text text-sm mb-4">{photo.caption || 'Photographie maritime'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-semibold text-[var(--color-gold)]">À partir de 180€</span>
                    <span className="caption">Édition limitée</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/boutique" className="btn-gold">
              Voir Toute la Boutique
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="section-spacing bg-black text-white">
        <div className="container-photo">
          <div className="text-center mb-16">
            <h2 className="section-title text-white mb-6">Pourquoi Choisir Mes Tirages</h2>
            <div className="gold-line mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-gold)] rounded-full mb-6">
                <Award size={32} />
              </div>
              <h3 className="font-display text-xl font-semibold mb-4">Qualité Muséale</h3>
              <p className="text-gray-400">
                Tous mes tirages sont réalisés sur papier Fine Art de qualité professionnelle, garantissant une durabilité exceptionnelle.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-gold)] rounded-full mb-6">
                <Camera size={32} />
              </div>
              <h3 className="font-display text-xl font-semibold mb-4">Édition Limitée</h3>
              <p className="text-gray-400">
                Chaque photographie est produite en édition limitée, numérotée et signée, assurant l'exclusivité de votre acquisition.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-gold)] rounded-full mb-6">
                <Heart size={32} />
              </div>
              <h3 className="font-display text-xl font-semibold mb-4">Passion & Authenticité</h3>
              <p className="text-gray-400">
                Chaque image est le fruit d'une connexion profonde avec la nature et d'une recherche constante de la lumière parfaite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="text-center mb-16">
            <p className="section-subtitle mb-4">Témoignages</p>
            <h2 className="section-title mb-6">Ce Que Disent Mes Clients</h2>
            <div className="gold-line mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 p-8 rounded-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-[var(--color-gold)]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="body-text mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="caption">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative py-32"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1758769523560-d060d8326fd8)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 container-photo text-center text-white">
          <h2 className="section-title text-white mb-6">Prêt à Découvrir Mes Œuvres ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Explorez ma collection complète de tirages d'art et trouvez la photographie parfaite pour votre intérieur.
          </p>
          <Link to="/boutique" className="btn-gold">
            Découvrir la Boutique
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
