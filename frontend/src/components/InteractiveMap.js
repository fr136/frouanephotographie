import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Camera, ExternalLink } from 'lucide-react';
import L from 'leaflet';
import { getPhotoTitleFromPath } from '../data/photoTitles';
import 'leaflet/dist/leaflet.css';

// Custom marker icon
const createCustomIcon = (isActive = false) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${isActive ? '40px' : '30px'};
        height: ${isActive ? '40px' : '30px'};
        background: ${isActive ? '#C9A961' : '#1a1a1a'};
        border: 3px solid ${isActive ? '#1a1a1a' : '#C9A961'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${isActive ? '#1a1a1a' : '#C9A961'}" stroke-width="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
      </div>
    `,
    iconSize: [isActive ? 40 : 30, isActive ? 40 : 30],
    iconAnchor: [isActive ? 20 : 15, isActive ? 40 : 30],
    popupAnchor: [0, -35],
  });
};

// Photo locations data
const photoLocations = [
  // CALANQUES
  {
    id: 'loc-1',
    name: 'Calanque de Sormiou',
    coordinates: [43.2101, 5.4192],
    collection: 'calanques',
    photos: [
      { title: getPhotoTitleFromPath('/Calanques/Calanque Sormiou 2.webp', 'Calanque de Sormiou'), image: '/Calanques/Calanque Sormiou 2.webp' },
      { title: getPhotoTitleFromPath('/Calanques/Sormiou.webp', 'Calanque de Sormiou'), image: '/Calanques/Sormiou.webp' },
    ],
    description: 'La plus grande calanque de Marseille, accessible en voiture (l\'été sur réservation) ou à pied depuis le col de la Gineste.',
  },
  {
    id: 'loc-2',
    name: 'Calanque des Anglais',
    coordinates: [43.2073, 5.4269],
    collection: 'calanques',
    photos: [
      { title: getPhotoTitleFromPath('/Calanques/Calanque des anglais.webp', 'Calanque des Anglais'), image: '/Calanques/Calanque des anglais.webp' },
      { title: getPhotoTitleFromPath('/Calanques/Calanque des anglais 4.webp', 'Calanque des Anglais'), image: '/Calanques/Calanque des anglais 4.webp' },
    ],
    description: 'Une petite crique intimiste au pied des falaises calcaires, idéale pour la plongée.',
  },
  {
    id: 'loc-3',
    name: 'Port de Cassis',
    coordinates: [43.2144, 5.5375],
    collection: 'calanques',
    photos: [
      { title: getPhotoTitleFromPath('/Calanques/Port de cassis.webp', 'Port de Cassis'), image: '/Calanques/Port de cassis.webp' },
    ],
    description: 'Le pittoresque port de Cassis, point de départ pour les excursions en bateau vers les calanques.',
  },
  {
    id: 'loc-4',
    name: 'Calanque de Port d\'Alon',
    coordinates: [43.1612, 5.6983],
    collection: 'calanques',
    photos: [
      { title: getPhotoTitleFromPath('/Calanques/Calanque Port d\'alon Saint Cyr sur mer.webp', 'Calanque de Port d\'Alon'), image: '/Calanques/Calanque Port d\'alon Saint Cyr sur mer.webp' },
    ],
    description: 'Entre Saint-Cyr-sur-Mer et Bandol, une calanque préservée au cœur d\'une forêt de pins.',
  },
  {
    id: 'loc-5',
    name: 'Agay',
    coordinates: [43.4308, 6.8631],
    collection: 'calanques',
    photos: [
      { title: getPhotoTitleFromPath('/Calanques/Calanque-agay.webp', 'Agay'), image: '/Calanques/Calanque-agay.webp' },
    ],
    description: 'Les roches rouges de l\'Estérel plongent dans les eaux bleu intense de la Méditerranée.',
  },
  // SUNSET
  {
    id: 'loc-6',
    name: 'La Ciotat - Route des Crêtes',
    coordinates: [43.1975, 5.6089],
    collection: 'sunset',
    photos: [
      { title: getPhotoTitleFromPath('/Sunset/Coucher de soleil La Ciotat éléphant routedes crêtes.webp', 'Route des Crêtes, La Ciotat'), image: '/Sunset/Coucher de soleil La Ciotat éléphant routedes crêtes.webp' },
      { title: getPhotoTitleFromPath('/Sunset/sunset fire la ciotat.webp', 'La Ciotat'), image: '/Sunset/sunset fire la ciotat.webp' },
    ],
    description: 'La mythique route des crêtes offre des vues spectaculaires sur le bec de l\'Aigle et le rocher de l\'éléphant.',
  },
  {
    id: 'loc-7',
    name: 'Plage des Catalans',
    coordinates: [43.2878, 5.3546],
    collection: 'sunset',
    photos: [
      { title: getPhotoTitleFromPath('/Sunset/Sunset catalans marseille.webp', 'Plage des Catalans, Marseille'), image: '/Sunset/Sunset catalans marseille.webp' },
      { title: getPhotoTitleFromPath('/Sunset/Sunset catalans.webp', 'Plage des Catalans, Marseille'), image: '/Sunset/Sunset catalans.webp' },
    ],
    description: 'La plage emblématique de Marseille, à deux pas du Vieux-Port.',
  },
  {
    id: 'loc-8',
    name: 'L\'Estaque',
    coordinates: [43.3614, 5.3089],
    collection: 'sunset',
    photos: [
      { title: getPhotoTitleFromPath('/Sunset/sunset l\'estaque Marseille.webp', 'L\'Estaque, Marseille'), image: '/Sunset/sunset l\'estaque Marseille.webp' },
    ],
    description: 'Ce quartier cher à Cézanne et Braque offre des couchers de soleil uniques sur la rade de Marseille.',
  },
  {
    id: 'loc-9',
    name: 'Port Saint-Jean, La Ciotat',
    coordinates: [43.1740, 5.6044],
    collection: 'sunset',
    photos: [
      { title: getPhotoTitleFromPath('/Sunset/sunset port saintjean la ciotat.webp', 'Port Saint-Jean, La Ciotat'), image: '/Sunset/sunset port saintjean la ciotat.webp' },
    ],
    description: 'Un petit port pittoresque au pied des falaises, idéal pour les couchers de soleil.',
  },
  {
    id: 'loc-10',
    name: 'Bain des Dames',
    coordinates: [43.2933, 5.3458],
    collection: 'sunset',
    photos: [
      { title: getPhotoTitleFromPath('/Sunset/sunset serpent bain des dames marseille.webp', 'Bain des Dames, Marseille'), image: '/Sunset/sunset serpent bain des dames marseille.webp' },
    ],
    description: 'Site de baignade historique avec sa sculpture de serpent emblématique.',
  },
];

const DEFAULT_MAP_CENTER = [43.25, 5.45];
const DEFAULT_MAP_ZOOM = 10;
const LOCATION_FOCUS_ZOOM = 13;

const getFilteredLocations = (collection) => (
  collection === 'all'
    ? photoLocations
    : photoLocations.filter((location) => location.collection === collection)
);

// Map center controller
const MapController = ({ filterCollection, selectedLocation, isOpen }) => {
  const map = useMap();

  useEffect(() => {
    if (!isOpen) return;

    if (selectedLocation) {
      map.flyTo(selectedLocation.coordinates, LOCATION_FOCUS_ZOOM, { duration: 1.5 });
      return;
    }

    const locations = getFilteredLocations(filterCollection);

    if (!locations.length) {
      map.flyTo(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, { duration: 1.5 });
      return;
    }

    if (locations.length === 1) {
      map.flyTo(locations[0].coordinates, LOCATION_FOCUS_ZOOM, { duration: 1.5 });
      return;
    }

    map.flyToBounds(
      L.latLngBounds(locations.map((location) => location.coordinates)),
      {
        padding: [48, 48],
        duration: 1.5,
        maxZoom: DEFAULT_MAP_ZOOM,
      }
    );
  }, [filterCollection, isOpen, map, selectedLocation]);

  return null;
};

// Interactive Map Component
const InteractiveMap = ({ isOpen, onClose, initialCollection = 'all' }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filterCollection, setFilterCollection] = useState(initialCollection);

  const filteredLocations = getFilteredLocations(filterCollection);

  useEffect(() => {
    if (!isOpen) {
      setSelectedLocation(null);
      setFilterCollection(initialCollection);
      return;
    }

    setSelectedLocation(null);
    setFilterCollection(initialCollection);
  }, [initialCollection, isOpen]);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  return (
    <AnimatePresence>
      {isOpen && (
      <motion.div
        key="interactive-map-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-[110] bg-gradient-to-b from-black to-transparent p-6">
          <div className="container-photo flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-white mb-1">Carte des Prises de Vue</h2>
              <p className="text-gray-400 text-sm">Découvrez où chaque photo a été capturée</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
          
          {/* Filters */}
          <div className="container-photo mt-4 flex gap-3">
            {[
              { id: 'all', label: 'Toutes' },
              { id: 'calanques', label: 'Calanques' },
              { id: 'sunset', label: 'Couchers de Soleil' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setFilterCollection(filter.id);
                  setSelectedLocation(null);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  filterCollection === filter.id
                    ? 'bg-[var(--color-gold)] text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Map — z-[1] crée un stacking context qui contient les z-indexes internes de Leaflet (200-800) */}
        <div className="absolute inset-0 pt-32 z-[1]">
          <MapContainer
            center={DEFAULT_MAP_CENTER}
            zoom={DEFAULT_MAP_ZOOM}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <MapController
              filterCollection={filterCollection}
              selectedLocation={selectedLocation}
              isOpen={isOpen}
            />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {filteredLocations.map((location) => (
              <Marker
                key={location.id}
                position={location.coordinates}
                icon={createCustomIcon(selectedLocation?.id === location.id)}
                eventHandlers={{
                  click: () => handleLocationClick(location),
                }}
              />
            ))}
          </MapContainer>
        </div>

        {/* Location Details Panel */}
        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-32 right-0 bottom-0 w-full md:w-[400px] bg-[#1a1a1a] border-l border-white/10 overflow-y-auto z-[105]"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 text-[var(--color-gold)] mb-4">
                  <MapPin size={18} />
                  <span className="text-sm uppercase tracking-wider">Lieu de prise de vue</span>
                </div>
                
                <h3 className="font-display text-2xl text-white mb-3">{selectedLocation.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{selectedLocation.description}</p>

                <div className="space-y-4">
                  <p className="text-white/60 text-sm uppercase tracking-wider">Photos de ce lieu</p>
                  {selectedLocation.photos.map((photo, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-sm overflow-hidden"
                    >
                      <img
                        src={photo.image}
                        alt={photo.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="text-white font-medium">{photo.title}</h4>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Coordinates */}
                <div className="mt-6 p-4 bg-white/5 rounded-sm">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Coordonnées GPS</p>
                  <p className="text-white font-mono text-sm">
                    {selectedLocation.coordinates[0].toFixed(4)}°N, {selectedLocation.coordinates[1].toFixed(4)}°E
                  </p>
                  <a
                    href={`https://www.google.com/maps?q=${selectedLocation.coordinates[0]},${selectedLocation.coordinates[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-[var(--color-gold)] text-sm hover:underline"
                  >
                    Ouvrir dans Google Maps <ExternalLink size={14} />
                  </a>
                </div>

                <button
                  onClick={() => setSelectedLocation(null)}
                  className="mt-6 w-full py-3 border border-white/20 text-white hover:bg-white/10 transition-colors rounded-sm"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

// Map Button Component to trigger the map
export const MapButton = ({ onClick }) => (
  <motion.button
    onClick={onClick}
    className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 bg-[#1a1a1a] text-white rounded-full shadow-2xl hover:bg-[var(--color-gold)] hover:text-black transition-all group"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1 }}
  >
    <MapPin size={20} className="group-hover:animate-bounce" />
    <span className="font-medium">Carte des Photos</span>
  </motion.button>
);

export default InteractiveMap;
