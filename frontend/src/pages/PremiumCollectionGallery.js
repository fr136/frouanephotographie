import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Camera, ChevronLeft, Film, Heart, MapPin, Maximize2, Play, Sparkles } from "lucide-react";

import { getCollectionGalleryBySlug } from "../data/collectionsData";
import { useCart } from "../context/CartContext";
import { FadeInOnScroll } from "../components/ScrollAnimations";
import CinemaMode from "../components/CinemaMode";
import LazyImage from "../components/LazyImage";

import "../styles/photography.css";
import "../styles/premium-gallery.css";

const PremiumCollectionGallery = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToWishlist, isInWishlist } = useCart();

  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [cinemaMode, setCinemaMode] = useState(false);

  const galleryData = useMemo(() => getCollectionGalleryBySlug(slug), [slug]);
  const collection = galleryData?.collection || null;
  const photos = useMemo(() => galleryData?.photos || [], [galleryData]);
  const activeSubcollectionSlug = searchParams.get("lieu") || "";
  const collectionHasSubcollections = Boolean(collection?.hasSubcollections && collection.subcollections.length > 0);

  const activeSubcollection = useMemo(() => {
    if (!collection || !collectionHasSubcollections || !activeSubcollectionSlug) {
      return null;
    }

    return collection.subcollections.find((subcollection) => subcollection.slug === activeSubcollectionSlug) || null;
  }, [collection, activeSubcollectionSlug, collectionHasSubcollections]);

  const displayPhotos = useMemo(() => {
    const scopedPhotos = activeSubcollection
      ? photos.filter((photo) => photo.subcollectionSlug === activeSubcollection.slug)
      : photos;

    const featured = scopedPhotos.filter((photo) => photo.featured);
    const regular = scopedPhotos.filter((photo) => !photo.featured);
    return [...featured, ...regular];
  }, [activeSubcollection, photos]);

  const lightboxSlides = useMemo(
    () =>
      displayPhotos.map((photo) => ({
        src: photo.imageUrl,
        alt: photo.title,
        title: photo.title,
      })),
    [displayPhotos]
  );

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 350);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => clearTimeout(timer);
  }, [slug]);

  useEffect(() => {
    setLightboxIndex(-1);
    setCinemaMode(false);
  }, [activeSubcollectionSlug, slug]);

  const updateActiveSubcollection = (nextSlug) => {
    const params = new URLSearchParams(searchParams);

    if (nextSlug) {
      params.set("lieu", nextSlug);
    } else {
      params.delete("lieu");
    }

    setSearchParams(params);
  };

  const jumpToGallery = () => {
    const galleryElement = document.getElementById("collection-gallery");
    if (galleryElement) {
      galleryElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubcollectionSelection = (nextSlug) => {
    updateActiveSubcollection(nextSlug);
    window.setTimeout(jumpToGallery, 60);
  };

  if (loading || !collection) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm uppercase tracking-widest">Chargement...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`${collection.theme} bg-white`}>
      <HeroSection
        collection={collection}
        activeSubcollection={activeSubcollection}
        onNavigateBack={() => navigate("/collections")}
        onCinemaMode={() => setCinemaMode(true)}
      />

      <IntroSection collection={collection} />

      {collectionHasSubcollections ? (
        <SubcollectionsSection
          collection={collection}
          activeSubcollection={activeSubcollection}
          onSelectSubcollection={handleSubcollectionSelection}
          onClearSubcollection={() => handleSubcollectionSelection("")}
        />
      ) : null}

      <GallerySection
        collection={collection}
        photos={displayPhotos}
        activeSubcollection={activeSubcollection}
        onSelectSubcollection={handleSubcollectionSelection}
        onClearSubcollection={() => handleSubcollectionSelection("")}
        onPhotoClick={(index) => setLightboxIndex(index)}
        onWishlist={addToWishlist}
        isInWishlist={isInWishlist}
        onCinemaMode={() => setCinemaMode(true)}
      />

      <CollectionEcologySection collection={collection} activeSubcollection={activeSubcollection} />

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={lightboxSlides}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
        }}
      />

      <CinemaMode
        photos={displayPhotos}
        isOpen={cinemaMode}
        onClose={() => setCinemaMode(false)}
        collectionTitle={activeSubcollection ? `${collection.title} - ${activeSubcollection.title}` : collection.title}
      />
    </div>
  );
};

const HeroSection = ({ collection, activeSubcollection, onNavigateBack, onCinemaMode }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const secondaryStatValue = collection.hasSubcollections ? collection.subcollectionCount : 1;
  const secondaryStatLabel = collection.hasSubcollections ? "Lieux" : "Lieu principal";

  return (
    <section className="hero-collection">
      <motion.div className="hero-background" style={{ backgroundImage: `url(${collection.coverImage})`, y }} />
      <div className="hero-overlay" />

      <motion.div className="hero-content" style={{ opacity }}>
        <motion.button
          onClick={onNavigateBack}
          className="absolute top-8 left-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
        >
          <ChevronLeft size={20} />
          <span className="text-sm uppercase tracking-wider">Collections</span>
        </motion.button>

        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Camera size={14} />
          <span>{collection.subtitle}</span>
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
        >
          <span className="hero-title-accent">{collection.title}</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          {activeSubcollection ? activeSubcollection.location : collection.tagline}
        </motion.p>

        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <MapPin size={16} />
          <span>{activeSubcollection ? activeSubcollection.location : collection.anchor}</span>
        </motion.div>

        <motion.div
          className="flex justify-center gap-3 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {collection.atmosphere.map((tag) => (
            <span key={tag} className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm">
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="hero-stat">
            <div className="hero-stat-value">{collection.photoCount}</div>
            <div className="hero-stat-label">Photographies</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">{secondaryStatValue}</div>
            <div className="hero-stat-label">{secondaryStatLabel}</div>
          </div>
        </motion.div>

        <motion.button
          onClick={onCinemaMode}
          className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-full transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Film size={20} />
          <span>Mode Cinéma</span>
          <Play size={16} className="ml-1" />
        </motion.button>
      </motion.div>

      <motion.div className="scroll-indicator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
        <span className="scroll-indicator-text">Découvrir</span>
        <div className="scroll-indicator-line" />
      </motion.div>
    </section>
  );
};

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
      </motion.div>
    </section>
  );
};

const SubcollectionsSection = ({ collection, activeSubcollection, onSelectSubcollection, onClearSubcollection }) => {
  if (!collection.hasSubcollections) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-photo">
        <FadeInOnScroll>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <p className="section-subtitle mb-4">Navigation locale</p>
              <h2 className="section-title">Parcourir par lieu</h2>
            </div>

            {activeSubcollection ? (
              <button onClick={onClearSubcollection} className="btn-outline self-start lg:self-auto">
                Voir toute la collection
              </button>
            ) : null}
          </div>
        </FadeInOnScroll>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {collection.subcollections.map((subcollection) => {
            const isActive = activeSubcollection?.id === subcollection.id;

            return (
              <article
                key={subcollection.id}
                className={`overflow-hidden border transition-all ${
                  isActive
                    ? "border-[var(--color-gold)] shadow-[0_20px_60px_rgba(201,169,97,0.16)]"
                    : "border-[var(--color-gray-200)] shadow-[0_18px_45px_rgba(0,0,0,0.05)]"
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={subcollection.coverImage}
                    alt={subcollection.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-[var(--color-gold)] text-xs uppercase tracking-[0.3em] mb-2">
                      {subcollection.photoCount} photo{subcollection.photoCount > 1 ? "s" : ""}
                    </p>
                    <h3 className="font-display text-2xl font-semibold">{subcollection.title}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-sm uppercase tracking-[0.16em] text-[var(--color-gray-500)] mb-3">
                    {subcollection.location}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {subcollection.spotTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-[var(--color-gray-100)] px-3 py-1 text-xs uppercase tracking-[0.12em] text-[var(--color-gray-600)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onSelectSubcollection(subcollection.slug)}
                    className={`inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] transition-colors ${
                      isActive ? "text-[var(--color-gold)]" : "text-[var(--color-gray-900)] hover:text-[var(--color-gold)]"
                    }`}
                  >
                    {isActive ? "Lieu actif" : "Explorer ce lieu"}
                    <ChevronLeft size={16} className="rotate-180" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const GallerySection = ({
  collection,
  photos,
  activeSubcollection,
  onSelectSubcollection,
  onClearSubcollection,
  onPhotoClick,
  onWishlist,
  isInWishlist,
  onCinemaMode,
}) => {
  const galleryMeta = activeSubcollection
    ? `${photos.length} photographie${photos.length > 1 ? "s" : ""} • ${activeSubcollection.location}`
    : collection.hasSubcollections
      ? `${collection.photoCount} photographies • ${collection.subcollectionCount} lieux`
      : `${collection.photoCount} photographies • ${collection.anchor}`;

  return (
    <section id="collection-gallery" className="gallery-section">
      <div className="container-photo">
        <FadeInOnScroll>
          <div className="gallery-header">
            <h2 className="gallery-title">{activeSubcollection ? activeSubcollection.title : collection.title}</h2>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gray-500)]">{galleryMeta}</p>

            {collection.hasSubcollections ? (
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  onClick={onClearSubcollection}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] border transition-colors ${
                    activeSubcollection
                      ? "bg-white text-[var(--color-gray-700)] border-[var(--color-gray-200)] hover:border-[var(--color-gold)]"
                      : "bg-black text-white border-black"
                  }`}
                >
                  Toute la collection
                </button>
                {collection.subcollections.map((subcollection) => (
                  <button
                    key={subcollection.id}
                    onClick={() => onSelectSubcollection(subcollection.slug)}
                    className={`px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] border transition-colors ${
                      activeSubcollection?.id === subcollection.id
                        ? "bg-black text-white border-black"
                        : "bg-white text-[var(--color-gray-700)] border-[var(--color-gray-200)] hover:border-[var(--color-gold)]"
                    }`}
                  >
                    {subcollection.title}
                  </button>
                ))}
              </div>
            ) : null}

            <motion.button
              onClick={onCinemaMode}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-full transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              data-testid="cinema-mode-button"
            >
              <Film size={18} />
              <span>Mode cinéma</span>
            </motion.button>
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
          />
        ))}
      </div>
    </section>
  );
};

const GalleryItem = ({ photo, index, isFeatured, onClick, onWishlist, inWishlist }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const getItemClass = () => {
    if (isFeatured && index === 0) return "featured";
    if (isFeatured) return "medium";
    return "standard";
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
        <LazyImage
          src={photo.imageUrl}
          alt={photo.title}
          eager={index < 4}
          wrapperStyle={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />

        {isFeatured && index === 0 && (
          <div className="featured-badge">
            <Sparkles size={12} className="inline mr-1" />
            Sélection
          </div>
        )}

        <div className="gallery-item-overlay">
          <span className="gallery-item-number">#{String(index + 1).padStart(2, "0")}</span>
          {photo.groupLabel ? (
            <p className="text-xs uppercase tracking-[0.2em] text-white/55 mb-2">{photo.groupLabel}</p>
          ) : null}
          <h3 className="gallery-item-title">{photo.title}</h3>
          <div className="gallery-item-action">
            <Maximize2 size={16} />
            <span>Voir en grand</span>
          </div>
        </div>

        <button
          className={`wishlist-btn ${inWishlist ? "active" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            onWishlist();
          }}
          aria-label="Ajouter aux favoris"
        >
          <Heart size={20} fill={inWishlist ? "#ef4444" : "none"} stroke={inWishlist ? "#ef4444" : "currentColor"} />
        </button>
      </div>
    </motion.div>
  );
};

const CollectionEcologySection = ({ collection, activeSubcollection }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const ecology = collection.ecology;

  return (
    <section ref={ref} className="py-20 bg-[#f4eee5] text-[var(--color-gray-900)] overflow-hidden">
      <div className="container-photo">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <p className="text-[var(--color-gold)] text-sm uppercase tracking-[0.3em] mb-4">{ecology.eyebrow}</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6">{ecology.title}</h2>
          <div className="w-16 h-0.5 bg-[var(--color-gold)] mx-auto mb-8" />
          <p className="text-[var(--color-gray-700)] text-lg leading-relaxed">
            {activeSubcollection ? `${activeSubcollection.title} rappelle que ` : ""}
            {ecology.intro}
          </p>
        </motion.div>

        <div className="grid xl:grid-cols-[1.05fr_0.95fr] gap-8">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-5"
          >
            {ecology.observations.map((item) => (
              <article
                key={item.title}
                className="border border-[#e6ddcf] bg-white px-6 py-6 shadow-[0_16px_40px_rgba(0,0,0,0.04)]"
              >
                <h3 className="font-display text-2xl text-[var(--color-gray-900)] mb-3">{item.title}</h3>
                <p className="text-[var(--color-gray-600)] leading-relaxed">{item.description}</p>
              </article>
            ))}

            <div className="border-t border-[#ddd3c4] pt-6">
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-gold)] mb-4">Repères du terrain</p>
              <div className="grid gap-3">
                {ecology.actions.map((action) => (
                  <p key={action} className="text-[var(--color-gray-700)] leading-relaxed">
                    {action}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="space-y-6"
          >
            <article className="relative min-h-[320px] overflow-hidden border border-[#e6ddcf] shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${activeSubcollection?.coverImage || collection.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-8">
                <p className="text-[var(--color-gold)] text-xs uppercase tracking-[0.3em] mb-3">Image du territoire</p>
                <h3 className="font-display text-3xl font-semibold text-white mb-3">
                  {activeSubcollection ? activeSubcollection.title : collection.title}
                </h3>
                <p className="text-white/85 max-w-md">{ecology.closing}</p>
              </div>
            </article>

          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          {ecology.references.map((reference) => (
            <span
              key={reference.label}
              className="inline-flex items-center rounded-full border border-[#ddd3c4] bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.14em] text-[var(--color-gray-600)]"
            >
              {reference.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumCollectionGallery;

