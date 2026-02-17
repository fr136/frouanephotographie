import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import L from "leaflet";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { collectionsAPI } from "../services/api";
import { getCollectionBySlug } from "../data/collectionsData";
import HeroZoomEffect from "../components/HeroZoomEffect";
import { useCart } from "../context/CartContext";
import { FadeInOnScroll, StaggerContainer, StaggerItem } from "../components/ScrollAnimations";

import {
  MapPin,
  ChevronLeft,
  Maximize2,
  Map as MapIcon,
  Heart,
  AlertTriangle,
  Leaf,
  CheckCircle,
  XCircle,
  Camera,
  Info,
} from "lucide-react";

import "../styles/photography.css";

// --- DONNÉES LOCALES DE SECOURS ---
const LOCAL_COLLECTION_GALLERIES = {
  calanques: {
    collection: {
      id: "calanques",
      slug: "calanques",
      title: "Calanques",
      subtitle: "Collection locale",
      description: "Photos chargées depuis /public/Calanques.",
      coverImage: "/Calanques/Cover.jpg",
    },
    photos: [
      "18119A7F-28BE-4A93-9230-6BEFED42DCD4.jpg", "20160326_113351.jpg", "20190430_110445.jpg",
      "20190430_233132.jpg", "20190430_233154.jpg", "20190501_001450.jpg",
      "20190501_001511.jpg", "20190501_001532.jpg", "20190501_001605.jpg",
      "20190501_001624.jpg", "20190501_145849.jpg", "20190501_151736.jpg",
      "20190501_151749.jpg", "20190501_155537.jpg", "20190512_143918.jpg",
      "20190512_184000.jpg", "20190523_192306.jpg", "20190619_181717.jpg",
      "20190623_185257.jpg", "20190721_173235.jpg", "20190730_175539.jpg",
      "20190811_203722.jpg", "Calanque Port d'alon Saint Cyr sur mer.webp",
      "Calanque Sormiou 2.webp", "Calanque des anglais 4.jpeg",
      "Calanque des anglais.webp", "Calanque-agay.webp",
      "Port de cassis.jpg", "Sormiou.jpeg", "sormiou-calanque.webp",
    ],
  },
  sunset: {
    collection: {
      id: "sunset",
      slug: "sunset",
      title: "Sunset",
      subtitle: "Collection locale",
      description: "Photos chargées depuis /public/Sunset.",
      coverImage: "/Sunset/Cover.JPEG",
    },
    photos: [
      "Coucher de soleil La Ciotat éléphant routedes crêtes.webp", "Sunset La Ciotat1.jpg",
      "Sunset catalans marseille.jpg", "Sunset catalans.jpg",
      "Sunset fire la ciotat 4.jpg", "sunset fire  la ciotat.jpg",
      "sunset fire la ciotat 3.jpg", "sunset fire la ciotat.jpg",
      "sunset l'estaque Marseille.jpg", "sunset port saintjean la ciotat.jpg",
      "sunset serpent bain des dames marseille.jpg",
    ],
  },
};

const SLUG_ALIASES = {
  "calanques-marseille": "calanques",
  "couchers-soleil": "sunset",
  calanques: "calanques",
  sunset: "sunset",
  marseille: "calanques",
};

const buildLocalGalleryData = (currentSlug) => {
  const alias = SLUG_ALIASES[currentSlug];
  const gallery = LOCAL_COLLECTION_GALLERIES[alias];
  if (!gallery) return null;

  const folder = alias === "calanques" ? "Calanques" : "Sunset";
  const photos = gallery.photos.map((fileName, index) => ({
    id: `${alias}-${index + 1}`,
    title: `${gallery.collection.title} ${index + 1}`,
    imageUrl: `/${folder}/${fileName}`,
    collectionId: alias,
    location: null,
  }));

  return { collection: { ...gallery.collection, photoCount: photos.length }, photos };
};

// Fix Leaflet Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// --- COMPOSANT PRINCIPAL ---
const CollectionGallery = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToWishlist, isInWishlist } = useCart();

  const [collection, setCollection] = useState(null);
  const [enrichedData, setEnrichedData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [showMap, setShowMap] = useState(false);
  const [showHeroZoom, setShowHeroZoom] = useState(true);

  const loadCollectionData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      try {
        data = await collectionsAPI.getBySlug(slug);
      } catch (apiErr) {
        console.warn("API Error, switching to local fallback");
      }

      if (data?.collection && data?.photos?.length > 0) {
        setCollection(data.collection);
        setPhotos(data.photos);
      } else {
        const localData = buildLocalGalleryData(slug);
        if (localData) {
          setCollection(localData.collection);
          setPhotos(localData.photos);
        } else {
          setError("Impossible de charger la collection");
        }
      }
      setEnrichedData(getCollectionBySlug(slug));
    } catch (err) {
      setError("Erreur critique lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadCollectionData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [loadCollectionData]);

  const photosWithLocations = photos.filter(p => p.location?.coordinates?.lat);
  const lightboxSlides = photos.map(p => ({ src: p.imageUrl, alt: p.title, title: p.title }));

  if (loading) return (
    <div className="min-h-screen bg-white pt-32 text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-gold)]"></div>
    </div>
  );

  if (error || !collection) return (
    <div className="min-h-screen bg-white pt-32 text-center">
      <h2 className="section-title">Collection introuvable</h2>
      <button onClick={() => navigate("/collections")} className="btn-primary mt-4">Retour</button>
    </div>
  );

  return (
    <div className="bg-white">
      {showHeroZoom && <HeroZoomEffect imageUrl={collection.coverImage} onComplete={() => setShowHeroZoom(false)} />}

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${collection.coverImage})`, transform: "scale(1.1)" }}></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white container-photo">
          <button onClick={() => navigate("/collections")} className="absolute top-8 left-8 flex items-center gap-2 hover:text-[var(--color-gold)]">
            <ChevronLeft size={20} /> Retour
          </button>
          <h1 className="hero-title mb-4">{collection.title}</h1>
          <p className="body-large text-gray-200 max-w-2xl mx-auto">{collection.description}</p>
          <div className="mt-8 flex justify-center gap-6">
            <span>{photos.length} photos</span>
            {photosWithLocations.length > 0 && (
              <button onClick={() => setShowMap(!showMap)} className="flex items-center gap-2 underline decoration-[var(--color-gold)]">
                <MapIcon size={18} /> {showMap ? "Masquer" : "Voir"} la carte
              </button>
            )}
          </div>
        </div>
      </section>

      {/* GALLERIE GRID */}
      <section className="py-16 container-photo">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              index={index}
              onClick={() => setLightboxIndex(index)}
              onAddToWishlist={() => addToWishlist(photo.id)}
              isInWishlist={isInWishlist(photo.id)}
            />
          ))}
        </div>
      </section>

      {/* MAP SECTION */}
      {showMap && photosWithLocations.length > 0 && (
        <section className="py-12 container-photo h-[500px]">
          <MapContainer center={[43.5, 5.5]} zoom={9} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {photosWithLocations.map(p => (
              <Marker key={p.id} position={[p.location.coordinates.lat, p.location.coordinates.lng]}>
                <Popup>{p.title}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>
      )}

      {/* ECOLOGY SECTION - Sensibilisation */}
      {enrichedData?.ecology && (
        <EcologyBlock ecology={enrichedData.ecology} collectionTitle={collection.title} />
      )}

      <Lightbox open={lightboxIndex >= 0} index={lightboxIndex} close={() => setLightboxIndex(-1)} slides={lightboxSlides} />
    </div>
  );
};

// --- COMPOSANT ECOLOGY BLOCK ---
const EcologyBlock = ({ ecology, collectionTitle }) => {
  const [activeTab, setActiveTab] = useState('species');

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container-photo">
        <FadeInOnScroll>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full mb-6">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium uppercase tracking-wider">
                Sensibilisation Écologique
              </span>
            </div>
            <h2 className="section-title text-white mb-4">
              Protégeons {collectionTitle}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {ecology.status}
            </p>
          </div>
        </FadeInOnScroll>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['species', 'threats', 'guidelines', 'actions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-[var(--color-gold)] text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab === 'species' && 'Espèces Protégées'}
              {tab === 'threats' && 'Menaces'}
              {tab === 'guidelines' && 'Bonnes Pratiques'}
              {tab === 'actions' && 'Agir'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'species' && ecology.protectedSpecies && (
            <div className="grid md:grid-cols-2 gap-6">
              {ecology.protectedSpecies.map((species, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{species.icon}</span>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{species.name}</h4>
                      <span className="inline-block px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded mb-3">
                        {species.status}
                      </span>
                      <p className="text-gray-400 text-sm">{species.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'threats' && ecology.threats && (
            <div className="grid md:grid-cols-2 gap-6">
              {ecology.threats.map((threat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{threat.icon}</span>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-white">{threat.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          threat.impact.includes('Critique') ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {threat.impact}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{threat.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'guidelines' && ecology.respectGuidelines && (
            <div className="max-w-3xl mx-auto">
              <div className="grid gap-3">
                {ecology.respectGuidelines.map((guideline, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-start gap-3 p-4 rounded-lg ${
                      guideline.startsWith('✅') ? 'bg-emerald-500/10 border border-emerald-500/20' :
                      guideline.startsWith('❌') ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/5'
                    }`}
                  >
                    <span className="text-lg">{guideline.substring(0, 2)}</span>
                    <span className="text-gray-300">{guideline.substring(2)}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'actions' && ecology.positiveActions && (
            <div className="max-w-3xl mx-auto">
              <div className="grid gap-4">
                {ecology.positiveActions.map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-5 bg-emerald-500/10 rounded-lg border border-emerald-500/20"
                  >
                    <span className="text-2xl">{action.substring(0, 2)}</span>
                    <span className="text-gray-200">{action.substring(2)}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// --- SOUS-COMPOSANT PHOTOCARD avec animations ---
const PhotoCard = ({ photo, index, onClick, onAddToWishlist, isInWishlist }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 6) * 0.1 }}
      className="photo-card group cursor-pointer overflow-hidden relative aspect-[4/5]" 
      onClick={onClick}
      whileHover={{ y: -5 }}
    >
      <motion.img 
        src={photo.imageUrl} 
        alt={photo.title} 
        className="w-full h-full object-cover"
        loading="lazy"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.6 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end text-white p-6">
        <Maximize2 size={32} className="mb-4 opacity-80" />
        <h3 className="text-lg font-semibold text-center">{photo.title}</h3>
      </div>
      <motion.button 
        onClick={(e) => { e.stopPropagation(); onAddToWishlist(); }}
        className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-black hover:text-red-500 z-20 shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart size={20} fill={isInWishlist ? "red" : "none"} stroke={isInWishlist ? "red" : "currentColor"} />
      </motion.button>
    </motion.div>
  );
};

export default CollectionGallery;
