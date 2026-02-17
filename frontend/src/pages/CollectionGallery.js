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

      <Lightbox open={lightboxIndex >= 0} index={lightboxIndex} close={() => setLightboxIndex(-1)} slides={lightboxSlides} />
    </div>
  );
};

// --- SOUS-COMPOSANT PHOTOCARD ---
const PhotoCard = ({ photo, index, onClick, onAddToWishlist, isInWishlist }) => {
  return (
    <div className="photo-card group cursor-pointer overflow-hidden relative aspect-[4/5]" onClick={onClick}>
      <img src={photo.imageUrl} alt={photo.title} className="image-zoom w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
        <Maximize2 size={32} className="mb-2" />
        <h3 className="text-lg font-semibold">{photo.title}</h3>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onAddToWishlist(); }}
        className="absolute top-4 right-4 p-2 bg-white rounded-full text-black hover:text-red-500 z-20"
      >
        <Heart size={20} fill={isInWishlist ? "red" : "none"} stroke={isInWishlist ? "red" : "currentColor"} />
      </button>
    </div>
  );
};

export default CollectionGallery;
