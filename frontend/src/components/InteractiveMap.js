import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, MapPin, X } from "lucide-react";
import L from "leaflet";

import { getPhotoTitleFromPath } from "../data/photoTitles";

import "leaflet/dist/leaflet.css";

const COLLECTION_LABELS = {
  calanques: "Calanques & littoral méditerranéen",
  sunset: "Couchers de soleil",
  sunrise: "Lever de soleil",
};

const createCustomIcon = (isActive = false) =>
  L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: ${isActive ? "40px" : "30px"};
        height: ${isActive ? "40px" : "30px"};
        background: ${isActive ? "#C9A961" : "#1a1a1a"};
        border: 3px solid ${isActive ? "#1a1a1a" : "#C9A961"};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${
          isActive ? "#1a1a1a" : "#C9A961"
        }" stroke-width="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
      </div>
    `,
    iconSize: [isActive ? 40 : 30, isActive ? 40 : 30],
    iconAnchor: [isActive ? 20 : 15, isActive ? 40 : 30],
    popupAnchor: [0, -35],
  });

const photoLocations = [
  {
    id: "loc-sormiou",
    name: "Sormiou",
    coordinates: [43.2101, 5.4192],
    collection: "calanques",
    collectionLabel: COLLECTION_LABELS.calanques,
    routeTo: "/collections/calanques?lieu=sormiou",
    photos: [
      {
        title: getPhotoTitleFromPath("/Calanques/calanque-sormiou01.webp", "Calanque de Sormiou"),
        image: "/Calanques/calanque-sormiou01.webp",
      },
      {
        title: getPhotoTitleFromPath("/Calanques/calanque-sormiou06.webp", "Calanque de Sormiou"),
        image: "/Calanques/calanque-sormiou06.webp",
      },
    ],
    description:
      "La calanque de Sormiou est l'une des plus accessibles depuis Marseille. Ses eaux turquoise et ses falaises calcaires en font un lieu de référence du littoral.",
  },
  {
    id: "loc-sugiton",
    name: "Sugiton",
    coordinates: [43.2094, 5.4567],
    collection: "calanques",
    collectionLabel: COLLECTION_LABELS.calanques,
    routeTo: "/collections/calanques?lieu=sugiton",
    photos: [
      { title: getPhotoTitleFromPath("/Calanques/sugiton01.jpeg", "Sugiton"), image: "/Calanques/sugiton01.jpeg" },
      { title: getPhotoTitleFromPath("/Calanques/sugiton02.jpg", "Sugiton"), image: "/Calanques/sugiton02.jpg" },
      { title: getPhotoTitleFromPath("/Calanques/sugiton03.webp", "Sugiton"), image: "/Calanques/sugiton03.webp" },
      { title: getPhotoTitleFromPath("/Calanques/sugiton04.webp", "Sugiton"), image: "/Calanques/sugiton04.webp" },
    ],
    description: "Sugiton est accessible à pied depuis Luminy. Moins fréquentée que Sormiou, elle offre une lumière plus sauvage et un silence rare à cette distance de la ville.",
  },
  {
    id: "loc-envau",
    name: "En-Vau",
    coordinates: [43.2112, 5.499],
    collection: "calanques",
    collectionLabel: COLLECTION_LABELS.calanques,
    routeTo: "/collections/calanques?lieu=en-vau",
    photos: [
      {
        title: getPhotoTitleFromPath("/Calanques/calanque-en-vau02.jpeg", "Calanque d'En-Vau"),
        image: "/Calanques/calanque-en-vau02.jpeg",
      },
    ],
    description: "En-Vau est souvent citée comme la plus belle calanque du massif. Encaissée entre deux falaises, elle ne se découvre qu'à pied ou par la mer.",
  },
  {
    id: "loc-cassis",
    name: "Port de Cassis",
    coordinates: [43.2144, 5.5375],
    collection: "calanques",
    collectionLabel: COLLECTION_LABELS.calanques,
    routeTo: "/collections/calanques?lieu=port-de-cassis",
    photos: [
      {
        title: getPhotoTitleFromPath("/Calanques/port-de-cassis01.webp", "Port de Cassis"),
        image: "/Calanques/port-de-cassis01.webp",
      },
    ],
    description: "Le port de Cassis marque la limite orientale des calanques. Entre voiliers au mouillage et Cap Canaille en fond, il offre une composition naturellement équilibrée.",
  },
  {
    id: "loc-port-dalon",
    name: "Port d'Alon",
    coordinates: [43.149, 5.712],
    collection: "calanques",
    collectionLabel: COLLECTION_LABELS.calanques,
    routeTo: "/collections/calanques?lieu=port-d-alon",
    photos: [
      {
        title: getPhotoTitleFromPath("/Calanques/calanque-port-d-alon01.webp", "Calanque de Port d'Alon"),
        image: "/Calanques/calanque-port-d-alon01.webp",
      },
    ],
    description: "Port d'Alon est une petite calanque discrète entre Bandol et Saint-Cyr-sur-Mer. Moins connue que ses voisines, elle conserve une ambiance intime et des eaux remarquablement claires.",
  },
  {
    id: "loc-sunset-ciotat",
    name: "La Ciotat – Route des Crêtes",
    coordinates: [43.1854, 5.6070],
    collection: "sunset",
    collectionLabel: COLLECTION_LABELS.sunset,
    routeTo: "/collections/couchers-de-soleil?lieu=la-ciotat",
    photos: [
      {
        title: getPhotoTitleFromPath(
          "/Sunset/Coucher de soleil La Ciotat éléphant routedes crêtes.webp",
          "Route des Crêtes, La Ciotat"
        ),
        image: "/Sunset/Coucher de soleil La Ciotat éléphant routedes crêtes.webp",
      },
      {
        title: getPhotoTitleFromPath("/Sunset/sunset fire la ciotat.webp", "La Ciotat au coucher du soleil"),
        image: "/Sunset/sunset fire la ciotat.webp",
      },
    ],
    description:
      "La Route des Crêtes surplombe la baie de La Ciotat et offre l'un des meilleurs belvédères du littoral pour photographier les couchers de soleil sur la mer.",
  },
  {
    id: "loc-catalans",
    name: "Plage des Catalans",
    coordinates: [43.2878, 5.3546],
    collection: "sunset",
    collectionLabel: COLLECTION_LABELS.sunset,
    routeTo: "/collections/couchers-de-soleil?lieu=marseille",
    photos: [
      {
        title: getPhotoTitleFromPath("/Sunset/Sunset catalans marseille.webp", "Plage des Catalans, Marseille"),
        image: "/Sunset/Sunset catalans marseille.webp",
      },
      {
        title: getPhotoTitleFromPath("/Sunset/Sunset catalans.webp", "Plage des Catalans, Marseille"),
        image: "/Sunset/Sunset catalans.webp",
      },
    ],
    description: "Face au Frioul et au château d'If, la plage des Catalans est l'un des rares endroits où Marseille et la mer se regardent directement, sans rupture.",
  },
  {
    id: "loc-estaque",
    name: "L'Estaque",
    coordinates: [43.3614, 5.3089],
    collection: "sunset",
    collectionLabel: COLLECTION_LABELS.sunset,
    routeTo: "/collections/couchers-de-soleil?lieu=marseille",
    photos: [
      {
        title: getPhotoTitleFromPath("/Sunset/sunset l'estaque Marseille.webp", "L'Estaque, Marseille"),
        image: "/Sunset/sunset l'estaque Marseille.webp",
      },
    ],
    description: "L'Estaque, au nord de Marseille, a inspiré Cézanne et Braque. Depuis le belvédère ou les quais, la lumière de fin de journée y prend une qualité particulière.",
  },
  {
    id: "loc-port-saint-jean",
    name: "Port Saint-Jean",
    coordinates: [43.186421, 5.628465],
    collection: "sunset",
    collectionLabel: COLLECTION_LABELS.sunset,
    routeTo: "/collections/couchers-de-soleil?lieu=la-ciotat",
    photos: [
      {
        title: getPhotoTitleFromPath("/Sunset/sunset port saintjean la ciotat.webp", "Port Saint-Jean, La Ciotat"),
        image: "/Sunset/sunset port saintjean la ciotat.webp",
      },
    ],
    description: "Port Saint-Jean ouvre sur la rade de La Ciotat. C'est depuis ce quai que la lumière du soir traverse la baie avec le plus de profondeur.",
  },
  {
    id: "loc-bain-des-dames",
    name: "Bain des Dames",
    coordinates: [43.23995, 5.36246],
    collection: "sunset",
    collectionLabel: COLLECTION_LABELS.sunset,
    routeTo: "/collections/couchers-de-soleil?lieu=marseille",
    photos: [
      {
        title: getPhotoTitleFromPath(
          "/Sunset/sunset serpent bain des dames marseille.webp",
          "Bain des Dames, Marseille"
        ),
        image: "/Sunset/sunset serpent bain des dames marseille.webp",
      },
    ],
    description: "Le Bain des Dames est un accès discret à la mer dans le 8e arrondissement de Marseille. Cadre minéral, lumière latérale en fin de journée.",
  },
  {
    id: "loc-sunrise-ciotat",
    name: "Lever de soleil - La Ciotat",
    coordinates: [43.1745, 5.6044],
    collection: "sunrise",
    collectionLabel: COLLECTION_LABELS.sunrise,
    routeTo: "/collections/lever-de-soleil",
    photos: [
      {
        title: getPhotoTitleFromPath("/Sunrise/lever-de-soleil-laciotat01.jpg", "Lever de soleil à La Ciotat"),
        image: "/Sunrise/lever-de-soleil-laciotat01.jpg",
      },
      {
        title: getPhotoTitleFromPath("/Sunrise/lever-de-soleil-laciotat02.jpg", "Lever de soleil à La Ciotat"),
        image: "/Sunrise/lever-de-soleil-laciotat02.jpg",
      },
    ],
    description: "Depuis La Ciotat, le soleil se lève derrière les collines de Saint-Cyr-sur-Mer, projetant une lumière dorée et rasante sur la baie dans les premières minutes du jour.",
  },
];

const DEFAULT_MAP_CENTER = [43.25, 5.45];
const DEFAULT_MAP_ZOOM = 10;
const LOCATION_FOCUS_ZOOM = 13;

const FILTERS = [
  { id: "all", label: "Toutes" },
  { id: "calanques", label: COLLECTION_LABELS.calanques },
  { id: "sunset", label: COLLECTION_LABELS.sunset },
  { id: "sunrise", label: COLLECTION_LABELS.sunrise },
];

const getFilteredLocations = (collection) =>
  collection === "all" ? photoLocations : photoLocations.filter((location) => location.collection === collection);

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

    map.flyToBounds(L.latLngBounds(locations.map((location) => location.coordinates)), {
      padding: [48, 48],
      duration: 1.5,
      maxZoom: DEFAULT_MAP_ZOOM,
    });
  }, [filterCollection, isOpen, map, selectedLocation]);

  return null;
};

const InteractiveMap = ({ isOpen, onClose, initialCollection = "all" }) => {
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

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="interactive-map-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95"
        >
          <div className="absolute top-0 left-0 right-0 z-[110] bg-gradient-to-b from-black to-transparent p-6">
            <div className="container-photo flex items-center justify-between gap-6">
              <div>
                <h2 className="font-display text-2xl text-white mb-1">Carte des prises de vue</h2>
                <p className="text-gray-400 text-sm">
                  Lieux photographiés — Marseille, Calanques, La Ciotat et littoral varois
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Fermer la carte"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            <div className="container-photo mt-4 flex gap-3 flex-wrap">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setFilterCollection(filter.id);
                    setSelectedLocation(null);
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    filterCollection === filter.id
                      ? "bg-[var(--color-gold)] text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="absolute inset-0 pt-32 z-[1]">
            <MapContainer center={DEFAULT_MAP_CENTER} zoom={DEFAULT_MAP_ZOOM} style={{ height: "100%", width: "100%" }} zoomControl={false}>
              <MapController filterCollection={filterCollection} selectedLocation={selectedLocation} isOpen={isOpen} />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {filteredLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={location.coordinates}
                  icon={createCustomIcon(selectedLocation?.id === location.id)}
                  eventHandlers={{ click: () => setSelectedLocation(location) }}
                />
              ))}
            </MapContainer>
          </div>

          <AnimatePresence>
            {selectedLocation ? (
              <motion.div
                key={selectedLocation.id}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute top-32 right-0 bottom-0 w-full md:w-[420px] bg-[#1a1a1a] border-l border-white/10 overflow-y-auto z-[105]"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[var(--color-gold)] mb-4">
                    <MapPin size={18} />
                    <span className="text-sm uppercase tracking-wider">Lieu de prise de vue</span>
                  </div>

                  <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70 mb-4">
                    {selectedLocation.collectionLabel}
                  </div>

                  <h3 className="font-display text-2xl text-white mb-6">{selectedLocation.name}</h3>

                  <div className="space-y-4">
                    <p className="text-white/60 text-sm uppercase tracking-wider">
                      {selectedLocation.photos.length} vue{selectedLocation.photos.length > 1 ? "s" : ""}
                    </p>
                    {selectedLocation.photos.map((photo, index) => (
                      <motion.div
                        key={photo.image}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-sm overflow-hidden"
                      >
                        <img src={photo.image} alt={photo.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <h4 className="text-white font-medium">{photo.title}</h4>
                        </div>
                      </motion.div>
                    ))}
                  </div>

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

                  <Link
                    to={selectedLocation.routeTo}
                    onClick={onClose}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[var(--color-gold)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:bg-[#d7b66f]"
                  >
                    Voir dans la collection
                  </Link>

                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="mt-4 w-full py-3 border border-white/20 text-white hover:bg-white/10 transition-colors rounded-sm"
                  >
                    Fermer
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

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
    <span className="font-medium">Carte des photos</span>
  </motion.button>
);

export default InteractiveMap;
