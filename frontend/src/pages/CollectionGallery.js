import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import L from "leaflet";

import { collectionsAPI } from "../services/api";
import { getCollectionBySlug } from "../data/collectionsData";
import HeroZoomEffect from "../components/HeroZoomEffect";
import { useCart } from "../context/CartContext";

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
} from "lucide-react";

import "../styles/photography.css";

// Fix Leaflet default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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

      const data = await collectionsAPI.getBySlug(slug);
      setCollection(data.collection);
      setPhotos(data.photos || []);

      const enriched = getCollectionBySlug(slug);
      setEnrichedData(enriched);

      setError(null);
    } catch (err) {
      setError("Impossible de charger la collection");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadCollectionData();
  }, [loadCollectionData]);

  const photosWithLocations = photos.filter(
    (p) => p.location && p.location.coordinates && p.location.coordinates.lat
  );

  const lightboxSlides = photos.map((photo) => ({
    src: photo.imageUrl,
    alt: photo.title,
    title: photo.title,
    description: photo.caption || "",
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-16">
        <div className="container-photo text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-gold)]"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-16">
        <div className="container-photo text-center">
          <h2 className="section-title mb-4">Collection introuvable</h2>
          <button
            onClick={() => navigate("/collections")}
            className="btn-primary"
          >
            Retour aux collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {showHeroZoom && collection && (
        <HeroZoomEffect
          imageUrl={collection.coverImage}
          onComplete={() => setShowHeroZoom(false)}
        />
      )}

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${collection.coverImage})`,
            transform: "scale(1.1)",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>

        <div className="relative z-10 container-photo text-center text-white">
          <button
            onClick={() => navigate("/collections")}
            className="absolute top-8 left-8 inline-flex items-center gap-2 text-white hover:text-[var(--color-gold)] transition-colors"
          >
            <ChevronLeft size={20} />
            Retour
          </button>

          <p className="section-subtitle text-gray-200 mb-4 animate-in fade-in slide-in-from-bottom-4">
            {collection.subtitle}
          </p>
          <h1 className="hero-title mb-6 animate-in fade-in slide-in-from-bottom-4 delay-200">
            {collection.title}
          </h1>
          <div className="gold-line mx-auto animate-in fade-in delay-300"></div>
          <p className="body-large text-gray-200 max-w-3xl mx-auto mt-6 animate-in fade-in slide-in-from-bottom-4 delay-400">
            {collection.description}
          </p>

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-300 animate-in fade-in delay-500">
            <span>{photos.length} photographies</span>
            {photosWithLocations.length > 0 && (
              <button
                onClick={() => setShowMap(!showMap)}
                className="inline-flex items-center gap-2 hover:text-[var(--color-gold)] transition-colors"
              >
                <MapIcon size={16} />
                {showMap ? "Masquer" : "Voir"} la carte
              </button>
            )}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {enrichedData?.anecdote && (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-gray-50">
          <div className="container-photo max-w-4xl">
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-2 bg-[var(--color-gold)] bg-opacity-20 text-[var(--color-gold)] text-sm font-semibold uppercase tracking-wider rounded-full mb-4">
                Le saviez-vous ?
              </span>
            </div>
            <p className="text-xl md:text-2xl leading-relaxed text-gray-700 italic text-center">
              "{enrichedData.anecdote}"
            </p>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="container-photo">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.slice(0, 4).map((photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={index}
                onClick={() => setLightboxIndex(photos.indexOf(photo))}
                onAddToWishlist={() => addToWishlist(photo.id)}
                isInWishlist={isInWishlist(photo.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {enrichedData?.story && (
        <section className="py-20 bg-black text-white">
          <div className="container-photo max-w-4xl">
            <div className="flex items-start gap-6">
              <div className="hidden md:block w-1 bg-[var(--color-gold)] flex-shrink-0"></div>
              <div>
                <h3 className="font-display text-3xl font-semibold mb-6">
                  Histoire d'une Photo
                </h3>
                <p className="text-lg md:text-xl leading-relaxed text-gray-300">
                  {enrichedData.story}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="container-photo">
          <div className="grid md:grid-cols-2 gap-8">
            {photos.slice(4, 7).map((photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={index + 4}
                onClick={() => setLightboxIndex(photos.indexOf(photo))}
                onAddToWishlist={() => addToWishlist(photo.id)}
                isInWishlist={isInWishlist(photo.id)}
                large={index === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {enrichedData?.ecology?.protectedSpecies &&
        enrichedData.ecology.protectedSpecies.length > 0 && (
          <section className="py-20 bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
            <div className="container-photo max-w-6xl">
              <div className="text-center mb-12">
                <Leaf className="inline-block text-green-600 mb-4" size={48} />
                <h3 className="font-display text-4xl font-semibold mb-4">
                  Vie Sauvage à Protéger
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Ces espèces fragiles dépendent de la préservation de leur
                  habitat. Chaque visite respectueuse compte.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {enrichedData.ecology.protectedSpecies.map((species, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start gap-6">
                      <span className="text-6xl">{species.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-display text-2xl font-semibold mb-2">
                          {species.name}
                        </h4>
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-4">
                          {species.status}
                        </span>
                        <p className="text-gray-700 leading-relaxed">
                          {species.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      <section className="py-16">
        <div className="container-photo">
          <div className="grid md:grid-cols-3 gap-6">
            {photos.slice(7, 10).map((photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={index + 7}
                onClick={() => setLightboxIndex(photos.indexOf(photo))}
                onAddToWishlist={() => addToWishlist(photo.id)}
                isInWishlist={isInWishlist(photo.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {enrichedData?.ecology?.threats && enrichedData.ecology.threats.length > 0 && (
        <section className="py-20 bg-red-50">
          <div className="container-photo max-w-6xl">
            <div className="text-center mb-12">
              <AlertTriangle
                className="inline-block text-red-600 mb-4"
                size={48}
              />
              <h3 className="font-display text-4xl font-semibold mb-4 text-red-900">
                Dangers Imminents
              </h3>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Ces menaces pèsent sur l'écosystème. Soyons conscients et
                agissons.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {enrichedData.ecology.threats.map((threat, idx) => (
                <div
                  key={idx}
                  className="bg-white border-l-4 border-red-500 p-6 rounded-r-lg shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{threat.icon}</span>
                    <div>
                      <h4 className="font-display text-xl font-semibold mb-2">
                        {threat.title}
                      </h4>
                      <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full mb-3">
                        {threat.impact}
                      </span>
                      <p className="text-sm text-gray-700">{threat.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {enrichedData?.ecology?.respectGuidelines &&
        enrichedData.ecology.respectGuidelines.length > 0 && (
          <section className="py-20 bg-gradient-to-br from-blue-900 to-black text-white">
            <div className="container-photo max-w-5xl">
              <div className="text-center mb-12">
                <Heart
                  className="inline-block text-[var(--color-gold)] mb-4"
                  size={48}
                />
                <h3 className="font-display text-4xl font-semibold mb-4">
                  Respectons Ce Paradis
                </h3>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Quelques gestes simples pour préserver ces lieux pour les
                  générations futures
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {enrichedData.ecology.respectGuidelines.map((rule, idx) => {
                  const isPositive = rule.startsWith("✅");
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-5 rounded-lg backdrop-blur-sm ${
                        isPositive
                          ? "bg-green-500 bg-opacity-20 border border-green-400"
                          : "bg-red-500 bg-opacity-20 border border-red-400"
                      }`}
                    >
                      {isPositive ? (
                        <CheckCircle
                          className="text-green-400 flex-shrink-0 mt-1"
                          size={24}
                        />
                      ) : (
                        <XCircle
                          className="text-red-400 flex-shrink-0 mt-1"
                          size={24}
                        />
                      )}
                      <span className="font-medium">
                        {rule.replace(/^[✅❌]\s*/, "")}
                      </span>
                    </div>
                  );
                })}
              </div>

              {enrichedData.ecology.positiveActions && (
                <div className="mt-12 p-8 bg-[var(--color-gold)] bg-opacity-20 rounded-lg border-2 border-[var(--color-gold)]">
                  <h4 className="font-display text-2xl font-semibold mb-6 text-center">
                    💚 Vous Pouvez Agir
                  </h4>
                  <ul className="space-y-3">
                    {enrichedData.ecology.positiveActions.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-[var(--color-gold)] text-2xl">
                          →
                        </span>
                        <span className="text-lg">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

      {showMap && photosWithLocations.length > 0 && (
        <section className="py-12">
          <div className="container-photo">
            <h3 className="font-display text-3xl font-semibold mb-8 text-center">
              Carte des Prises de Vue
            </h3>
            <div className="h-[600px] rounded-lg overflow-hidden shadow-2xl">
              <MapContainer
                center={[43.5, 5.5]}
                zoom={9}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {photosWithLocations.map((photo) => (
                  <Marker
                    key={photo.id}
                    position={[
                      photo.location.coordinates.lat,
                      photo.location.coordinates.lng,
                    ]}
                    eventHandlers={{
                      click: () => setLightboxIndex(photos.indexOf(photo)),
                    }}
                  >
                    <Popup>
                      <div className="text-center">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-32 h-24 object-cover rounded mb-2"
                        />
                        <p className="font-semibold text-sm">{photo.title}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </section>
      )}

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={lightboxSlides}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.95)" } }}
      />
    </div>
  );
};

// PhotoCard component with safe ref cleanup
const PhotoCard = ({
  photo,
  index,
  onClick,
  onAddToWishlist,
  isInWishlist,
  large = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`photo-card group cursor-pointer transform transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${large ? "md:col-span-2 md:row-span-2" : ""}`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onClick={onClick}
    >
      <div
        className={`image-container ${
          large ? "aspect-[16/10]" : "aspect-[4/5]"
        } relative overflow-hidden`}
      >
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className="image-zoom"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
            <Maximize2 size={40} className="mb-4" />
            <h3 className="font-display text-xl font-semibold text-center">
              {photo.title}
            </h3>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToWishlist();
          }}
          className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 rounded-full hover:bg-[var(--color-gold)] hover:text-white transition-colors z-10"
        >
          <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
        </button>

        {photo.location?.name && (
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
            <MapPin size={12} />
            {photo.location.name}
          </div>
        )}
      </div>

      {photo.caption && (
        <div className="p-4">
          <p className="text-sm text-gray-600 line-clamp-2">{photo.caption}</p>
        </div>
      )}
    </div>
  );
};

export default CollectionGallery;
