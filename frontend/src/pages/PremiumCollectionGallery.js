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
      { file: "Port de cassis.webp", featured: true, title: "Port de Cassis" },
      { file: "Calanque Port d'alon Saint Cyr sur mer.webp", featured: false, title: "Port d'Alon" },
      { file: "Calanque-agay.webp", featured: false, title: "Agay" },
      { file: "Calanque des anglais 4.webp", featured: false, title: "Les Anglais - Crépuscule" },
      { file: "Sormiou.webp", featured: false, title: "Sormiou - Matin" },
      { file: "18119A7F-28BE-4A93-9230-6BEFED42DCD4.webp", featured: false, title: "Vue sur mer" },
      { file: "20190430_110445.webp", featured: false, title: "Calanque Secrète" },
      { file: "20190501_145849.webp", featured: false, title: "Plage Cachée" },
      { file: "20190501_151736.webp", featured: false, title: "Rochers et Pins" },
      { file: "20190512_143918.webp", featured: false, title: "Eau Turquoise" },
      { file: "20190512_184000.webp", featured: false, title: "Fin de Journée" },
      { file: "20190619_181717.webp", featured: false, title: "Lumière d'Été" },
      { file: "20190623_185257.webp", featured: false, title: "Reflets" },
      { file: "20190721_173235.webp", featured: false, title: "Baie Secrète" },
      { file: "20190730_175539.webp", featured: false, title: "Criques" },
      { file: "20190811_203722.webp", featured: false, title: "Coucher sur les Calanques" },
      { file: "20160326_113351.webp", featured: false, title: "Printemps" },
      { file: "20190430_233132.webp", featured: false, title: "Nuit Étoilée" },
      { file: "20190430_233154.webp", featured: false, title: "Voie Lactée" },
      { file: "20190501_001450.webp", featured: false, title: "Aube" },
      { file: "20190501_001511.webp", featured: false, title: "Premiers Rayons" },
      { file: "20190501_001624.webp", featured: false, title: "Matin Calme" },
      { file: "20190501_151749.webp", featured: false, title: "Midi Méditerranéen" },
      { file: "20190501_155537.webp", featured: false, title: "Après-midi" },
      { file: "20190523_192306.webp", featured: false, title: "Soir d'Été" },
    ],
  },
  sunset: {
    photos: [
      { file: "Coucher de soleil La Ciotat éléphant routedes crêtes.webp", featured: true, title: "La Ciotat - Route des Crêtes" },
      { file: "sunset fire la ciotat.webp", featured: true, title: "Ciel de Feu" },
      { file: "Sunset La Ciotat1.webp", featured: false, title: "La Ciotat - Horizon" },
      { file: "Sunset catalans marseille.webp", featured: false, title: "Catalans - Marseille" },
      { file: "Sunset catalans.webp", featured: false, title: "Plage des Catalans" },
      { file: "Sunset fire la ciotat 4.webp", featured: false, title: "Embrasement" },
      { file: "sunset fire  la ciotat.webp", featured: false, title: "Or et Pourpre" },
      { file: "sunset fire la ciotat 3.jpg", featured: false, title: "Flammes Dorées" },
      { file: "sunset l'estaque Marseille.webp", featured: false, title: "L'Estaque" },
      { file: "sunset port saintjean la ciotat.webp", featured: false, title: "Port Saint-Jean" },
      { file: "sunset serpent bain des dames marseille.webp", featured: false, title: "Bain des Dames" },
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
  const photos = useMemo(() => galleryData?.photos || [], [galleryData]);
  const enrichedData = useMemo(() => getCollectionBySlug(slug), [slug]);

  // Cinema mode available for both collections
  const hasCinemaMode = slug === 'sunset' || slug === 'couchers-soleil' || slug === 'calanques' || slug === 'calanques-marseille';

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
        showCinemaButton={hasCinemaMode}
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
        showCinemaButton={hasCinemaMode}
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

      {/* CINEMA MODE - Available for all premium collections */}
      {hasCinemaMode && (
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

        {/* Cinema Mode Button - Only for Sunset */}
        {showCinemaButton && (
          <motion.button
            onClick={onCinemaMode}
            className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-full transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Film size={20} />
            <span>Mode Cinéma</span>
            <Play size={16} className="ml-1" />
          </motion.button>
        )}
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
const GallerySection = ({ photos, collection, onPhotoClick, onWishlist, isInWishlist, showCinemaButton, onCinemaMode }) => {
  return (
    <section className="gallery-section">
      <div className="container-photo">
        <FadeInOnScroll>
          <div className="gallery-header">
            <h2 className="gallery-title">La Collection</h2>
            <p className="gallery-description">
              {photos.length} photographies soigneusement sélectionnées
            </p>
            {/* Cinema Mode Button in Gallery */}
            {showCinemaButton && (
              <motion.button
                onClick={onCinemaMode}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-full transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                data-testid="cinema-mode-button"
              >
                <Film size={18} />
                <span>Lancer le diaporama cinématique</span>
              </motion.button>
            )}
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

// Ecology Section - Style harmonisé avec la page d'accueil
const EcologySection = ({ ecology, collection }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  // Données spécifiques selon la collection
  const collectionData = {
    calanques: {
      title: 'Préserver les Calanques',
      intro: "Entre Marseille et La Ciotat, les Calanques sont un trésor fragile. Chaque année, plus de 3 millions de visiteurs foulent ces sentiers. À nous de les protéger.",
      quote: "« Ici, on laisse que des traces de pas. Le reste, on le ramène avec nous. »",
      quoteAuthor: "Garde du Parc National des Calanques",
      conseils: [
        { titre: 'Restez sur les sentiers balisés', description: "La garrigue met des décennies à se régénérer. Les raccourcis détruisent la végétation et accélèrent l'érosion." },
        { titre: 'Emportez vos déchets', description: "Même les peaux de fruits. Un trognon de pomme met 6 mois à se décomposer, un mégot 12 ans." },
        { titre: 'Crème solaire minérale', description: "Les filtres chimiques détruisent les herbiers de posidonie, poumons de la Méditerranée." },
        { titre: 'Évitez les heures de pointe', description: "Partez tôt le matin ou en fin d'après-midi. La lumière est plus belle, et vous aurez la calanque pour vous." }
      ]
    },
    sunset: {
      title: 'Respecter le littoral',
      intro: "Ces couchers de soleil que je capture, c'est la Méditerranée dans toute sa splendeur. Mais derrière la beauté, il y a un écosystème fragile qui mérite notre respect.",
      quote: "« Le soleil se couche sur la même mer depuis des millénaires. À nous de faire en sorte qu'il continue de le faire. »",
      quoteAuthor: "Pêcheur de La Ciotat",
      conseils: [
        { titre: 'Pas de feu sur la côte', description: "Le risque d'incendie est permanent. Un mégot mal éteint peut ravager des hectares de garrigue." },
        { titre: 'Respectez la faune', description: "Au crépuscule, les oiseaux marins regagnent leurs nids. Évitez le bruit et les flashs." },
        { titre: 'Stationnement responsable', description: "Garez-vous sur les parkings prévus. Le stationnement sauvage détruit la végétation." },
        { titre: 'Partagez avec conscience', description: "Vos photos attirent du monde. Évitez de géolocaliser les spots secrets pour les préserver." }
      ]
    }
  };

  const data = collectionData[collection.id] || collectionData.calanques;

  return (
    <section 
      ref={ref}
      className="py-24 bg-[#1a1a1a] text-white overflow-hidden"
    >
      <div className="container-photo">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <p className="text-[var(--color-gold)] text-sm uppercase tracking-widest mb-4">
            Engagement
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6">
            {data.title}
          </h2>
          <div className="w-16 h-0.5 bg-[var(--color-gold)] mx-auto mb-8"></div>
          <p className="text-gray-400 text-lg leading-relaxed">
            {data.intro}
          </p>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16 px-8 py-12 border-l-2 border-[var(--color-gold)] bg-white/5"
        >
          <p className="font-display text-2xl md:text-3xl italic text-white/90 mb-6">
            {data.quote}
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-0.5 bg-[var(--color-gold)]"></div>
            <p className="text-gray-400">{data.quoteAuthor}</p>
          </div>
        </motion.div>

        {/* Conseils */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="font-display text-2xl font-semibold text-center mb-12">
            Visiter en conscience
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {data.conseils.map((conseil, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="p-6 bg-white/5 rounded-sm border border-white/5 hover:border-[var(--color-gold)]/20 transition-all duration-300"
              >
                <h4 className="font-display text-lg font-semibold text-white mb-3">
                  {conseil.titre}
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  {conseil.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Source */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a 
            href="http://www.calanques-parcnational.fr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--color-gold)] transition-colors text-sm"
          >
            Source : Parc National des Calanques
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumCollectionGallery;
