import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { collectionsAPI } from "../services/api";
import { getCollectionBySlug } from "../data/collectionsData";
import { useCart } from "../context/CartContext";
import { FadeInOnScroll, StaggerContainer, StaggerItem } from "../components/ScrollAnimations";
import CinemaMode from "../components/CinemaMode";

import {
  ChevronLeft,
  Maximize2,
  Heart,
  Camera,
  MapPin,
  Leaf,
  ArrowDown,
  Sparkles,
  Film,
  Play,
} from "lucide-react";

import "../styles/photography.css";
import "../styles/premium-gallery.css";

// Collection Themes Configuration
const COLLECTION_THEMES = {
  calanques: {
    id: 'calanques',
    theme: 'collection-calanques',
    title: 'Calanques',
    subtitle: 'Méditerranée Sauvage',
    tagline: 'Entre ciel et mer, là où la roche blanche rencontre le turquoise infini',
    description: 'Explorez les fjords méditerranéens, ces joyaux minéraux sculptés par le temps où la lumière joue avec les eaux cristallines.',
    quote: "Les Calanques sont un sanctuaire de lumière, un endroit où le temps semble suspendu entre les falaises blanches et l'azur profond.",
    coverImage: '/Calanques/Cover.jpg',
    atmosphere: ['Lumineux', 'Minéral', 'Méditerranéen'],
    icon: '🏔️',
  },
  sunset: {
    id: 'sunset',
    theme: 'collection-sunset',
    title: 'Couchers de Soleil',
    subtitle: 'Golden Hour',
    tagline: "Quand le ciel s'embrase et que la mer devient or",
    description: "Capturez l'émotion des derniers instants du jour, quand la lumière dorée transforme chaque instant en magie pure.",
    quote: "Chaque coucher de soleil est une promesse de renaissance, un tableau éphémère que seul l'instant peut capturer.",
    coverImage: '/Sunset/Cover.JPEG',
    atmosphere: ['Cinématique', 'Chaleureux', 'Émotionnel'],
    icon: '🌅',
  },
};

// Photo data with featured flags
const LOCAL_GALLERIES = {
  calanques: {
    photos: [
      { file: "Calanque Sormiou 2.webp", featured: true, title: "Sormiou - Vue Panoramique" },
      { file: "Calanque des anglais.webp", featured: false, title: "Calanque des Anglais" },
      { file: "sormiou-calanque.webp", featured: false, title: "Sormiou - Eaux Cristallines" },
      { file: "Port de cassis.jpg", featured: true, title: "Port de Cassis" },
      { file: "Calanque Port d'alon Saint Cyr sur mer.webp", featured: false, title: "Port d'Alon" },
      { file: "Calanque-agay.webp", featured: false, title: "Agay" },
      { file: "Calanque des anglais 4.jpeg", featured: false, title: "Les Anglais - Crépuscule" },
      { file: "Sormiou.jpeg", featured: false, title: "Sormiou - Matin" },
      { file: "18119A7F-28BE-4A93-9230-6BEFED42DCD4.jpg", featured: false, title: "Vue sur mer" },
      { file: "20190430_110445.jpg", featured: false, title: "Calanque Secrète" },
      { file: "20190501_145849.jpg", featured: false, title: "Plage Cachée" },
      { file: "20190501_151736.jpg", featured: false, title: "Rochers et Pins" },
      { file: "20190512_143918.jpg", featured: false, title: "Eau Turquoise" },
      { file: "20190512_184000.jpg", featured: false, title: "Fin de Journée" },
      { file: "20190619_181717.jpg", featured: false, title: "Lumière d'Été" },
      { file: "20190623_185257.jpg", featured: false, title: "Reflets" },
      { file: "20190721_173235.jpg", featured: false, title: "Baie Secrète" },
      { file: "20190730_175539.jpg", featured: false, title: "Criques" },
      { file: "20190811_203722.jpg", featured: false, title: "Coucher sur les Calanques" },
      { file: "20160326_113351.jpg", featured: false, title: "Printemps" },
      { file: "20190430_233132.jpg", featured: false, title: "Nuit Étoilée" },
      { file: "20190430_233154.jpg", featured: false, title: "Voie Lactée" },
      { file: "20190501_001450.jpg", featured: false, title: "Aube" },
      { file: "20190501_001511.jpg", featured: false, title: "Premiers Rayons" },
      { file: "20190501_001532.jpg", featured: false, title: "Aurore" },
      { file: "20190501_001605.jpg", featured: false, title: "Lever du Jour" },
      { file: "20190501_001624.jpg", featured: false, title: "Matin Calme" },
      { file: "20190501_151749.jpg", featured: false, title: "Midi Méditerranéen" },
      { file: "20190501_155537.jpg", featured: false, title: "Après-midi" },
      { file: "20190523_192306.jpg", featured: false, title: "Soir d'Été" },
    ],
  },
  sunset: {
    photos: [
      { file: "Coucher de soleil La Ciotat éléphant routedes crêtes.webp", featured: true, title: "La Ciotat - Route des Crêtes" },
      { file: "sunset fire la ciotat.jpg", featured: true, title: "Ciel de Feu" },
      { file: "Sunset La Ciotat1.jpg", featured: false, title: "La Ciotat - Horizon" },
      { file: "Sunset catalans marseille.jpg", featured: false, title: "Catalans - Marseille" },
      { file: "Sunset catalans.jpg", featured: false, title: "Plage des Catalans" },
      { file: "Sunset fire la ciotat 4.jpg", featured: false, title: "Embrasement" },
      { file: "sunset fire  la ciotat.jpg", featured: false, title: "Or et Pourpre" },
      { file: "sunset fire la ciotat 3.jpg", featured: false, title: "Flammes Dorées" },
      { file: "sunset l'estaque Marseille.jpg", featured: false, title: "L'Estaque" },
      { file: "sunset port saintjean la ciotat.jpg", featured: false, title: "Port Saint-Jean" },
      { file: "sunset serpent bain des dames marseille.jpg", featured: false, title: "Bain des Dames" },
    ],
  },
};

const SLUG_ALIASES = {
  "calanques-marseille": "calanques",
  "couchers-soleil": "sunset",
  calanques: "calanques",
  sunset: "sunset",
};

// Build gallery data
const buildGalleryData = (slug) => {
  const alias = SLUG_ALIASES[slug] || slug;
  const gallery = LOCAL_GALLERIES[alias];
  const theme = COLLECTION_THEMES[alias];
  
  if (!gallery || !theme) return null;

  const folder = alias === "calanques" ? "Calanques" : "Sunset";
  const photos = gallery.photos.map((photo, index) => ({
    id: `${alias}-${index + 1}`,
    title: photo.title,
    imageUrl: `/${folder}/${photo.file}`,
    featured: photo.featured,
    collectionId: alias,
  }));

  return { 
    collection: { 
      ...theme,
      photoCount: photos.length,
    }, 
    photos 
  };
};

// Premium Collection Gallery Component
const PremiumCollectionGallery = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToWishlist, isInWishlist } = useCart();

  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [showIntro, setShowIntro] = useState(true);
  const [cinemaMode, setCinemaMode] = useState(false);

  // Build data
  const galleryData = useMemo(() => buildGalleryData(slug), [slug]);
  const collection = galleryData?.collection;
  const photos = galleryData?.photos || [];
  const enrichedData = useMemo(() => getCollectionBySlug(slug), [slug]);

  // Check if this is the Sunset collection (cinema mode only for sunset)
  const isSunsetCollection = slug === 'sunset' || slug === 'couchers-soleil';

  // Sort photos: featured first
  const sortedPhotos = useMemo(() => {
    const featured = photos.filter(p => p.featured);
    const regular = photos.filter(p => !p.featured);
    return [...featured, ...regular];
  }, [photos]);

  const lightboxSlides = sortedPhotos.map(p => ({ 
    src: p.imageUrl, 
    alt: p.title, 
    title: p.title 
  }));

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => clearTimeout(timer);
  }, [slug]);

  // Loading state
  if (loading || !collection) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm uppercase tracking-widest">Chargement...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`${collection.theme} bg-white`}>
      {/* PREMIUM HERO */}
      <HeroSection 
        collection={collection} 
        photoCount={photos.length}
        onNavigateBack={() => navigate("/collections")}
        showCinemaButton={isSunsetCollection}
        onCinemaMode={() => setCinemaMode(true)}
      />

      {/* INTRO QUOTE */}
      <IntroSection collection={collection} />

      {/* PREMIUM GALLERY */}
      <GallerySection 
        photos={sortedPhotos}
        collection={collection}
        onPhotoClick={(index) => setLightboxIndex(index)}
        onWishlist={addToWishlist}
        isInWishlist={isInWishlist}
        showCinemaButton={isSunsetCollection}
        onCinemaMode={() => setCinemaMode(true)}
      />

      {/* ECOLOGY SECTION */}
      {enrichedData?.ecology && (
        <EcologySection 
          ecology={enrichedData.ecology} 
          collection={collection}
        />
      )}

      {/* LIGHTBOX */}
      <Lightbox 
        open={lightboxIndex >= 0} 
        index={lightboxIndex} 
        close={() => setLightboxIndex(-1)} 
        slides={lightboxSlides}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
        }}
      />

      {/* CINEMA MODE - Only for Sunset */}
      {isSunsetCollection && (
        <CinemaMode
          photos={sortedPhotos}
          isOpen={cinemaMode}
          onClose={() => setCinemaMode(false)}
          collectionTitle={collection.title}
        />
      )}
    </div>
  );
};

// Hero Section Component
const HeroSection = ({ collection, photoCount, onNavigateBack, showCinemaButton, onCinemaMode }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="hero-collection">
      {/* Background with parallax */}
      <motion.div 
        className="hero-background"
        style={{ 
          backgroundImage: `url(${collection.coverImage})`,
          y 
        }}
      />
      
      {/* Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <motion.div 
        className="hero-content"
        style={{ opacity }}
      >
        {/* Back button */}
        <motion.button 
          onClick={onNavigateBack}
          className="absolute top-8 left-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ChevronLeft size={20} />
          <span className="text-sm uppercase tracking-wider">Collections</span>
        </motion.button>

        {/* Badge */}
        <motion.div 
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Camera size={14} />
          <span>{collection.subtitle}</span>
        </motion.div>

        {/* Title */}
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <span className="hero-title-accent">{collection.title}</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {collection.tagline}
        </motion.p>

        {/* Atmosphere tags */}
        <motion.div 
          className="flex justify-center gap-3 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {collection.atmosphere?.map((tag, i) => (
            <span 
              key={tag}
              className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="hero-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="hero-stat">
            <div className="hero-stat-value">{photoCount}</div>
            <div className="hero-stat-label">Photographies</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">{collection.icon}</div>
            <div className="hero-stat-label">Collection</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="scroll-indicator-text">Découvrir</span>
        <div className="scroll-indicator-line" />
      </motion.div>
    </section>
  );
};

// Intro Section with Quote
const IntroSection = ({ collection }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section className="collection-intro" ref={ref}>
      <motion.div 
        className="intro-content container-photo"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <p className="intro-quote">{collection.quote}</p>
        <div className="intro-author">
          <div className="intro-author-line" />
          <span className="intro-author-name">Franck Rouane</span>
          <div className="intro-author-line" />
        </div>
        <p className="body-text mt-8 max-w-2xl mx-auto text-center">
          {collection.description}
        </p>
      </motion.div>
    </section>
  );
};

// Gallery Section
const GallerySection = ({ photos, collection, onPhotoClick, onWishlist, isInWishlist }) => {
  return (
    <section className="gallery-section">
      <div className="container-photo">
        <FadeInOnScroll>
          <div className="gallery-header">
            <h2 className="gallery-title">La Collection</h2>
            <p className="gallery-description">
              {photos.length} photographies soigneusement sélectionnées
            </p>
          </div>
        </FadeInOnScroll>
      </div>

      <div className="premium-gallery">
        {photos.map((photo, index) => (
          <GalleryItem
            key={photo.id}
            photo={photo}
            index={index}
            isFeatured={index < 2 && photo.featured}
            onClick={() => onPhotoClick(index)}
            onWishlist={() => onWishlist(photo.id)}
            inWishlist={isInWishlist(photo.id)}
            collectionTheme={collection.theme}
          />
        ))}
      </div>
    </section>
  );
};

// Gallery Item Component
const GalleryItem = ({ photo, index, isFeatured, onClick, onWishlist, inWishlist, collectionTheme }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Determine grid size
  const getItemClass = () => {
    if (isFeatured && index === 0) return 'featured';
    if (isFeatured) return 'medium';
    return 'standard';
  };

  return (
    <motion.div
      ref={ref}
      className={`gallery-item ${getItemClass()}`}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.5) }}
      onClick={onClick}
      data-testid={`gallery-item-${photo.id}`}
    >
      <div className="gallery-item-inner">
        <img 
          src={photo.imageUrl} 
          alt={photo.title}
          loading={index < 4 ? "eager" : "lazy"}
        />
        
        {/* Featured badge */}
        {isFeatured && index === 0 && (
          <div className="featured-badge">
            <Sparkles size={12} className="inline mr-1" />
            Featured
          </div>
        )}

        {/* Overlay */}
        <div className="gallery-item-overlay">
          <span className="gallery-item-number">#{String(index + 1).padStart(2, '0')}</span>
          <h3 className="gallery-item-title">{photo.title}</h3>
          <div className="gallery-item-action">
            <Maximize2 size={16} />
            <span>Voir en grand</span>
          </div>
        </div>

        {/* Wishlist button */}
        <button
          className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onWishlist(); }}
          aria-label="Ajouter aux favoris"
        >
          <Heart 
            size={20} 
            fill={inWishlist ? "#ef4444" : "none"} 
            stroke={inWishlist ? "#ef4444" : "currentColor"}
          />
        </button>
      </div>
    </motion.div>
  );
};

// Ecology Section (Simplified for collections)
const EcologySection = ({ ecology, collection }) => {
  const [activeTab, setActiveTab] = useState('guidelines');
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const tabs = [
    { id: 'guidelines', label: 'Bonnes Pratiques', icon: '✅' },
    { id: 'species', label: 'Espèces', icon: '🐟' },
    { id: 'threats', label: 'Menaces', icon: '⚠️' },
  ];

  return (
    <section 
      ref={ref}
      className="py-24 bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white"
    >
      <div className="container-photo">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full mb-6">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium uppercase tracking-wider">
              Écologie & Préservation
            </span>
          </div>
          <h2 className="section-title text-white mb-4">
            Protégeons ces lieux
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {ecology.status}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {activeTab === 'guidelines' && ecology.respectGuidelines && (
              <div className="grid gap-3">
                {ecology.respectGuidelines.slice(0, 8).map((guideline, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-start gap-3 p-4 rounded-lg ${
                      guideline.startsWith('✅') ? 'bg-emerald-500/10 border border-emerald-500/20' :
                      guideline.startsWith('❌') ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/5'
                    }`}
                  >
                    <span className="text-xl">{guideline.substring(0, 2)}</span>
                    <span className="text-gray-300">{guideline.substring(2).trim()}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'species' && ecology.protectedSpecies && (
              <div className="grid md:grid-cols-2 gap-4">
                {ecology.protectedSpecies.map((species, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 rounded-lg p-5 border border-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{species.icon}</span>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{species.name}</h4>
                        <span className="inline-block px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded mb-2">
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
              <div className="grid md:grid-cols-2 gap-4">
                {ecology.threats.map((threat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 rounded-lg p-5 border border-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">{threat.icon}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-white">{threat.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            threat.impact.includes('Critique') 
                              ? 'bg-red-500/20 text-red-400' 
                              : 'bg-orange-500/20 text-orange-400'
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
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PremiumCollectionGallery;
