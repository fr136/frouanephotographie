import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { collectionsAPI } from '../services/api';
import { MapPin, Calendar, Camera, X, ChevronLeft, ChevronRight, Maximize2, Map as MapIcon } from 'lucide-react';
import L from 'leaflet';
import '../styles/photography.css';

// Fix for Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CollectionGallery = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [showMap, setShowMap] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    loadCollectionData();
  }, [slug]);

  const loadCollectionData = async () => {
    try {
      setLoading(true);
      const data = await collectionsAPI.getBySlug(slug);
      setCollection(data.collection);
      setPhotos(data.photos || []);
      setError(null);
    } catch (err) {
      setError('Impossible de charger la collection');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const photosWithLocations = photos.filter(
    (p) => p.location && p.location.coordinates && p.location.coordinates.lat
  );

  const lightboxSlides = photos.map((photo) => ({
    src: photo.imageUrl,
    alt: photo.title,
    title: photo.title,
    description: photo.caption || ''
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-16">
        <div className="container-photo">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-gold)]"></div>
            <p className="mt-4 text-gray-600">Chargement de la galerie...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-16">
        <div className="container-photo text-center">
          <h2 className="section-title mb-4">Collection introuvable</h2>
          <p className="body-text mb-8">{error || 'Cette collection n\'existe pas.'}</p>
          <button onClick={() => navigate('/collections')} className="btn-primary">
            Retour aux collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Header */}
      <section className="pt-32 pb-16 bg-black text-white relative">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${collection.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="container-photo relative z-10">
          <button
            onClick={() => navigate('/collections')}
            className="inline-flex items-center gap-2 text-white hover:text-[var(--color-gold)] transition-colors mb-6"
          >
            <ChevronLeft size={20} />
            Retour aux collections
          </button>
          <h1 className="section-title text-white mb-4">{collection.title}</h1>
          <p className="section-subtitle text-gray-300 mb-4">{collection.subtitle}</p>
          <div className="gold-line"></div>
          <p className="body-large text-gray-300 max-w-3xl mt-6">{collection.description}</p>
          <div className="flex items-center gap-6 mt-6 text-sm text-gray-400">
            <span>{photos.length} photographies</span>
            {photosWithLocations.length > 0 && (
              <button
                onClick={() => setShowMap(!showMap)}
                className="inline-flex items-center gap-2 hover:text-[var(--color-gold)] transition-colors"
              >
                <MapIcon size={16} />
                {showMap ? 'Masquer' : 'Voir'} la carte
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Map Section */}
      {showMap && photosWithLocations.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-photo">
            <div className="h-[500px] rounded-lg overflow-hidden shadow-lg">
              <MapContainer
                center={[43.5, 5.5]} // Côte d'Azur center
                zoom={9}
                style={{ height: '100%', width: '100%' }}
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
                      photo.location.coordinates.lng
                    ]}
                    eventHandlers={{
                      click: () => {
                        setSelectedPhoto(photo);
                        const index = photos.findIndex((p) => p.id === photo.id);
                        setLightboxIndex(index);
                      }
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
                        {photo.location.name && (
                          <p className="text-xs text-gray-600 mt-1">{photo.location.name}</p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group cursor-pointer photo-card"
                onClick={() => setLightboxIndex(index)}
              >
                <div className="image-container aspect-[4/5] relative overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="image-zoom"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 size={32} className="text-white" />
                    </div>
                  </div>
                  {photo.location && photo.location.coordinates && (
                    <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <MapPin size={12} />
                      {photo.location.name || 'Localisé'}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg font-semibold mb-2">{photo.title}</h3>
                  {photo.caption && (
                    <p className="text-sm text-gray-600 line-clamp-2">{photo.caption}</p>
                  )}
                  {photo.location && photo.location.name && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <MapPin size={12} />
                      <span>{photo.location.name}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={lightboxSlides}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' }
        }}
        render={{
          slide: ({ slide, rect }) => {
            const photo = photos[lightboxIndex];
            return (
              <div className="flex items-center justify-center h-full">
                <div className="max-w-7xl w-full px-4">
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    <div className="md:col-span-2">
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        className="w-full h-auto max-h-[80vh] object-contain"
                      />
                    </div>
                    <div className="text-white space-y-4">
                      <h2 className="font-display text-2xl font-semibold">{slide.title}</h2>
                      {photo?.caption && (
                        <p className="text-gray-300">{photo.caption}</p>
                      )}
                      {photo?.location?.name && (
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin size={16} className="mt-1 flex-shrink-0" />
                          <span>{photo.location.name}</span>
                        </div>
                      )}
                      {photo?.dateTaken && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar size={16} />
                          <span>{new Date(photo.dateTaken).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                      {photo?.camera && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Camera size={16} />
                          <span>{photo.camera}</span>
                        </div>
                      )}
                      {photo?.settings && (
                        <p className="text-xs text-gray-500">{photo.settings}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        }}
      />
    </div>
  );
};

export default CollectionGallery;
