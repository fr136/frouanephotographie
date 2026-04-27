import { getPhotoTitle } from "./photoTitles";
import productCatalog from "./productCatalog.json";

const PRODUCT_ID_BY_ASSET_PATH = Object.entries(productCatalog).reduce((mapping, [productId, product]) => {
  mapping[product.asset_path] = productId;
  return mapping;
}, {});

const createPhoto = (file, options = {}) => ({
  file,
  featured: false,
  ...options,
});

const RAW_COLLECTIONS = [
  {
    id: "calanques",
    slug: "calanques",
    legacySlugs: ["calanques-marseille"],
    category: "calanques",
    theme: "collection-calanques",
    assetFolder: "Calanques",
    title: "Calanques & littoral méditerranéen",
    subtitle: "Marseille, Cassis et littoral sud",
    description:
      "Sormiou, Sugiton, En-Vau et d'autres secteurs côtiers entre Marseille, Cassis et le Var.",
    tagline:
      "Marseille, les calanques, la côte entre Cassis et Bandol.",
    quote:
      "La lumière de la Méditerranée, les falaises, l'odeur de la garrigue. Il suffit d'y être tôt.",
    coverImage: "/Calanques/Cover hero.jpg",
    image: "/Calanques/calanque-sormiou01.webp",
    atmosphere: ["Roche blanche", "Eaux turquoise", "Garrigue"],
    anchor: "Marseille, Cassis, Saint-Cyr-sur-Mer, Bandol, Var",
    ecology: {
      eyebrow: "Observation du terrain",
      title: "Les paysages minéraux restent précis dans le regard, fragiles sur le terrain",
      intro:
        "Entre Marseille, les Calanques et le littoral sud, les lieux photographiés restent très identifiables. On y retrouve aussi des sentiers sollicités, des déchets visibles et une pression régulière sur le bord de mer.",
      observations: [
        {
          title: "Sentiers et accès sensibles",
          description:
            "Sugiton, Sormiou, En-Vau n'encaissent pas tous la même fréquentation, mais les mêmes mécanismes reviennent vite : raccourcis, piétinement, élargissement des traces.",
        },
        {
          title: "Déchets légers persistants",
          description:
            "Mégots, emballages, plastique léger ou restes de pique-nique restent parmi les signes les plus visibles autour des accès et des anses.",
        },
        {
          title: "Milieu marin vulnérable",
          description:
            "Depuis le rivage, la fragilité du bord de mer reste lisible : pression humaine continue, anses saturées et pollution flottante dans certains secteurs.",
        },
      ],
      documentaryPlaceholders: [],
      actions: [
        "Nommer précisément un lieu n'oblige pas à en faire un spot surexposé.",
        "Rester sur les tracés existants limite une partie de l'usure visible sur place.",
        "Photographier un site peut aussi servir à documenter ce qu'il encaisse.",
      ],
      closing:
        "La photographie montre ici la lumière et les reliefs, mais elle sert aussi à garder une trace fidèle de lieux déjà fragiles.",
      references: [
        { label: "Parc national des Calanques" },
        { label: "Littoral sud méditerranéen" },
        { label: "Littoral Var-Méditerranée" },
      ],
    },
    subcollections: [
      {
        id: "sormiou",
        slug: "sormiou",
        title: "Sormiou",
        location: "Marseille",
        description:
          "La calanque la plus accessible depuis Marseille. Eaux turquoise, falaises calcaires, fréquentation élevée.",
        coverFile: "calanque-sormiou01.webp",
        spotTags: ["Marseille", "calanque", "falaises"],
        photos: [
          createPhoto("calanque-sormiou01.webp", { featured: true }),
          createPhoto("calanque-sormiou02.webp"),
          createPhoto("calanque-sormiou03.webp"),
          createPhoto("calanque-sormiou04.webp"),
          createPhoto("calanque-sormiou05.webp"),
          createPhoto("calanque-sormiou06.webp", { featured: true }),
        ],
      },
      {
        id: "sugiton",
        slug: "sugiton",
        title: "Sugiton",
        location: "Marseille",
        description:
          "Accessible à pied depuis Luminy. Moins fréquentée que Sormiou, plus sauvage, lumière plus directe.",
        coverFile: "sugiton01.jpeg",
        spotTags: ["Marseille", "sugiton", "calcaire"],
        photos: [createPhoto("sugiton01.jpeg", { featured: true }), createPhoto("sugiton02.jpg")],
      },
      {
        id: "en-vau",
        slug: "en-vau",
        title: "En-Vau",
        location: "Calanques",
        description:
          "Encaissée entre deux falaises, accessible à pied ou par la mer. Souvent citée comme la plus belle du massif.",
        coverFile: "calanque-en-vau02.jpeg",
        spotTags: ["en-vau", "calanque", "falaises"],
        photos: [createPhoto("calanque-en-vau02.jpeg", { featured: true })],
      },
      {
        id: "port-de-cassis",
        slug: "port-de-cassis",
        title: "Port de Cassis",
        location: "Cassis",
        description:
          "Le port marque la limite orientale des calanques. Entre voiliers et Cap Canaille en fond, composition naturellement équilibrée.",
        coverFile: "port-de-cassis01.webp",
        spotTags: ["cassis", "port", "littoral"],
        photos: [createPhoto("port-de-cassis01.webp", { featured: true })],
      },
      {
        id: "port-d-alon",
        slug: "port-d-alon",
        title: "Port d'Alon",
        location: "Saint-Cyr-sur-Mer",
        description:
          "Petite calanque entre Bandol et Saint-Cyr-sur-Mer. Ambiance intime, eaux remarquablement claires.",
        coverFile: "calanque-port-d-alon01.webp",
        spotTags: ["port-d-alon", "saint-cyr-sur-mer", "crique"],
        photos: [
          createPhoto("calanque-port-d-alon01.webp", { featured: true }),
          createPhoto("calanque-port-d-alon02.webp"),
          createPhoto("calanque-port-d-alon03.webp"),
          createPhoto("calanque-port-d-alon04.webp"),
        ],
      },
      {
        id: "cap-canaille",
        slug: "cap-canaille",
        title: "Cap Canaille",
        location: "Route des Crêtes",
        description:
          "Le Cap Canaille domine Cassis à 362 mètres. Depuis la Route des Crêtes, la vue porte loin sur la côte.",
        coverFile: "cap-canaille01.webp",
        spotTags: ["cap-canaille", "falaises", "route des crêtes"],
        photos: [createPhoto("cap-canaille01.webp"), createPhoto("cap-canaille02.jpg")],
      },
      {
        id: "la-madrague",
        slug: "la-madrague",
        title: "La Madrague",
        location: "Saint-Cyr-sur-Mer",
        description:
          "Petit port de plaisance à Saint-Cyr-sur-Mer, à l'entrée de la baie des Lecques.",
        coverFile: "la-madrague-saint-cyr-sur-mer01.webp",
        spotTags: ["la madrague", "saint-cyr-sur-mer", "littoral sud"],
        photos: [createPhoto("la-madrague-saint-cyr-sur-mer01.webp")],
      },
      {
        id: "bandol",
        slug: "bandol",
        title: "Bandol",
        location: "Bandol",
        description:
          "Station balnéaire entre Sanary et La Ciotat. Lumière du Var, port animé, végétation méditerranéenne.",
        coverFile: "bougainvillier-bandol01.jpg",
        spotTags: ["bandol", "bougainvillier", "ville littorale"],
        photos: [createPhoto("bougainvillier-bandol01.jpg")],
      },
      {
        id: "beaucours",
        slug: "beaucours",
        title: "Beaucours",
        location: "Beaucours",
        description:
          "Plage de sable fin face à l'île des Embiez, dans le Var. Eaux calmes, lumière douce en fin de journée.",
        coverFile: "plage-beaucours01.webp",
        spotTags: ["beaucours", "plage", "littoral"],
        photos: [createPhoto("plage-beaucours01.webp"), createPhoto("plage-beaucours02.webp")],
      },
      {
        id: "la-fossette",
        slug: "la-fossette",
        title: "La Fossette",
        location: "Plage de la Fossette",
        description:
          "Plage abritée au Lavandou. Sable, pins maritimes, eaux peu profondes. Un coin tranquille du littoral varois.",
        coverFile: "plage-la-fossette01.webp",
        spotTags: ["la-fossette", "plage", "var"],
        photos: [
          createPhoto("plage-la-fossette01.webp"),
          createPhoto("plage-la-fossette02.webp"),
          createPhoto("plage-la-fossette03.webp"),
        ],
      },
      {
        id: "portissol",
        slug: "portissol",
        title: "Portissol",
        location: "Plage de Portissol",
        description:
          "Plage de Portissol à Sanary-sur-Mer. Eau claire, falaises dorées, atmosphère préservée.",
        coverFile: "plage-portissol01.webp",
        spotTags: ["portissol", "plage", "littoral"],
        photos: [createPhoto("plage-portissol01.webp")],
      },
      {
        id: "calanque-des-anglais",
        slug: "calanque-des-anglais",
        title: "Calanque des Anglais",
        location: "Agay",
        description:
          "Site naturel dans le massif de l'Estérel, près d'Agay. Roche rouge, eau transparente, accès par sentier.",
        coverFile: "calanque-des-anglais01.webp",
        spotTags: ["agay", "calanque", "estérel"],
        photos: [createPhoto("calanque-des-anglais01.webp")],
      },
    ],
  },
  {
    id: "sunset",
    slug: "couchers-de-soleil",
    legacySlugs: ["sunset", "couchers-soleil"],
    category: "sunset",
    theme: "collection-sunset",
    assetFolder: "Sunset",
    title: "Couchers de soleil",
    subtitle: "Marseille et La Ciotat",
    description:
      "La Ciotat et Marseille. Deux rivages différents, la même lumière de fin de journée sur la Méditerranée.",
    tagline:
      "La Ciotat et Marseille, deux rivages différents, la même lumière de fin de journée.",
    quote:
      "Entre la Route des Crêtes et la plage des Catalans, le soleil descend sur le même horizon.",
    coverImage: "/Sunset/Cover.JPEG",
    image: "/Sunset/Cover.JPEG",
    atmosphere: ["La Ciotat", "Marseille", "Lumière rasante"],
    anchor: "Marseille, La Ciotat",
    ecology: {
      eyebrow: "Observation du terrain",
      title: "Le soir reste spectaculaire, les rivages restent sensibles",
      intro:
        "À Marseille comme à La Ciotat, le coucher de soleil attire du monde. Les mêmes fins de journée laissent aussi apparaître stationnement saturé, déchets visibles et pression continue sur le bord de mer.",
      observations: [
        {
          title: "Concentration des usages",
          description:
            "Les mêmes points de vue reviennent vite : route des Crêtes, Catalans, Bain des Dames, Port Saint-Jean, L'Estaque.",
        },
        {
          title: "Traces de fin de journée",
          description:
            "Canettes, mégots et emballages abandonnés restent parmi les marqueurs les plus lisibles après le départ des visiteurs.",
        },
        {
          title: "Milieu marin sous tension",
          description:
            "Même quand la lumière adoucit le paysage, le littoral continue d'absorber bruit, surfréquentation et pollution diffuse.",
        },
      ],
      documentaryPlaceholders: [],
      actions: [
        "Un bon point de vue n'efface pas ce que le lieu supporte en fin de journée.",
        "Ces points de vue sont très fréquentés. Ce que la photo montre beau, le terrain l'absorbe en quantité.",
        "Montrer un rivage peut rester compatible avec une diffusion mesurée.",
      ],
      closing:
        "Ces images de soirée gardent leur puissance visuelle, mais elles restent liées à des sites côtiers déjà très sollicités.",
      references: [
        { label: "Littoral marseillais" },
        { label: "La Ciotat" },
        { label: "Route des Crêtes" },
      ],
    },
    subcollections: [
      {
        id: "la-ciotat",
        slug: "la-ciotat",
        title: "La Ciotat",
        location: "Route des Crêtes, Port Saint-Jean et baie",
        description:
          "Route des Crêtes, Port Saint-Jean et baie de La Ciotat. Lumière rasante sur la mer en fin de journée.",
        coverFile: "Coucher de soleil La Ciotat éléphant routedes crêtes.webp",
        spotTags: ["La Ciotat", "Route des Crêtes", "Port Saint-Jean"],
        photos: [
          createPhoto("Coucher de soleil La Ciotat éléphant routedes crêtes.webp", { featured: true }),
          createPhoto("sunset fire la ciotat.webp", { featured: true }),
          createPhoto("Sunset La Ciotat1.webp"),
          createPhoto("Sunset fire la ciotat 4.webp"),
          createPhoto("sunset port saintjean la ciotat.webp"),
        ],
      },
      {
        id: "marseille",
        slug: "marseille",
        title: "Marseille",
        location: "Catalans, L'Estaque, Bain des Dames",
        description:
          "Catalans, L'Estaque, Bain des Dames. Marseille face à la mer, en fin de journée.",
        coverFile: "Sunset catalans marseille.webp",
        spotTags: ["Marseille", "Catalans", "L'Estaque"],
        photos: [
          createPhoto("Sunset catalans marseille.webp"),
          createPhoto("Sunset catalans.webp"),
          createPhoto("sunset l'estaque Marseille.webp"),
          createPhoto("sunset serpent bain des dames marseille.webp"),
        ],
      },
    ],
  },
  {
    id: "sunrise",
    slug: "lever-de-soleil",
    legacySlugs: ["sunrise"],
    category: "sunrise",
    theme: "collection-sunrise",
    assetFolder: "Sunrise",
    title: "Lever de soleil",
    subtitle: "La Ciotat",
    description:
      "Six photographies, un seul lieu. La Ciotat au premier soleil, avant la chaleur et le bruit.",
    tagline:
      "Six photographies, un seul lieu. La Ciotat au premier soleil.",
    quote:
      "La Ciotat, avant le bruit. La mer, la lumière, et rien d'autre.",
    coverImage: "/Sunrise/lever-de-soleil-laciotat01.jpg",
    image: "/Sunrise/lever-de-soleil-laciotat01.jpg",
    atmosphere: ["La Ciotat", "Aube", "Lumière douce"],
    anchor: "La Ciotat",
    ecology: {
      eyebrow: "Observation du terrain",
      title: "Le calme de l'aube n'annule pas la fragilité du rivage",
      intro:
        "À La Ciotat, les premières lumières donnent une lecture plus calme du littoral. Elles n'effacent ni la vulnérabilité du milieu marin ni la pression qui revient ensuite sur les accès.",
      observations: [
        {
          title: "Littoral plus silencieux, pas moins fragile",
          description:
            "L'aube change l'ambiance du site, pas la sensibilité du milieu marin ni la capacité du rivage à encaisser les usages.",
        },
        {
          title: "Beauté documentaire",
          description:
            "Le lever de soleil montre une face plus calme du même territoire. Cela peut renforcer la lecture photographique sans gommer le réel.",
        },
        {
          title: "Pression différée",
          description:
            "Le moment photographié est paisible, mais il appartient au même littoral que les heures de saturation plus tardives.",
        },
      ],
      documentaryPlaceholders: [],
      actions: [
        "L'aube rend le littoral plus silencieux, pas moins vulnérable.",
        "Le lever de soleil peut montrer la beauté du site sans sortir du réel local.",
        "La photographie peut aussi garder trace d'un littoral fragile.",
      ],
      closing:
        "À La Ciotat, l'aube rend le paysage très lisible. Elle rend aussi sa fragilité plus calme, mais pas moins réelle.",
      references: [{ label: "La Ciotat" }, { label: "Littoral méditerranéen" }, { label: "Lever de soleil" }],
    },
    subcollections: [],
    photos: [
      createPhoto("lever-de-soleil-laciotat01.jpg", { featured: true }),
      createPhoto("lever-de-soleil-laciotat02.jpg", { featured: true }),
      createPhoto("lever-de-soleil-laciotat03.jpg"),
      createPhoto("lever-de-soleil-laciotat05.jpg"),
      createPhoto("lever-de-soleil-laciotat06.jpg"),
    ],
  },
];

const SLUG_MAPPING = RAW_COLLECTIONS.reduce((mapping, collection) => {
  mapping[collection.slug] = collection.slug;
  mapping[collection.id] = collection.slug;
  (collection.legacySlugs || []).forEach((legacySlug) => {
    mapping[legacySlug] = collection.slug;
  });
  return mapping;
}, {});

const hasSubcollections = (collection) => collection.subcollections.length > 0;

const getCollectionTotalPhotoCount = (collection) =>
  hasSubcollections(collection)
    ? collection.subcollections.reduce((total, subcollection) => total + subcollection.photos.length, 0)
    : (collection.photos || []).length;

const buildSubcollectionSummary = (collection, subcollection) => ({
  id: subcollection.id,
  slug: subcollection.slug,
  title: subcollection.title,
  location: subcollection.location,
  description: subcollection.description,
  coverImage: `/${collection.assetFolder}/${subcollection.coverFile}`,
  photoCount: subcollection.photos.length,
  spotTags: subcollection.spotTags || [],
});

const buildCollectionSummary = (collection) => ({
  id: collection.id,
  slug: collection.slug,
  legacySlugs: [...collection.legacySlugs],
  category: collection.category,
  theme: collection.theme,
  title: collection.title,
  subtitle: collection.subtitle,
  description: collection.description,
  tagline: collection.tagline,
  quote: collection.quote,
  coverImage: collection.coverImage,
  image: collection.image,
  atmosphere: [...collection.atmosphere],
  anchor: collection.anchor,
  photoCount: getCollectionTotalPhotoCount(collection),
  subcollectionCount: collection.subcollections.length,
  hasSubcollections: hasSubcollections(collection),
  subcollections: collection.subcollections.map((subcollection) =>
    buildSubcollectionSummary(collection, subcollection)
  ),
  ecology: {
    ...collection.ecology,
    observations: collection.ecology.observations.map((item) => ({ ...item })),
    documentaryPlaceholders: [...collection.ecology.documentaryPlaceholders],
    actions: [...collection.ecology.actions],
    references: collection.ecology.references.map((reference) => ({ ...reference })),
  },
});

const resolveCollection = (slug) => {
  const normalizedSlug = SLUG_MAPPING[slug] || slug;
  return RAW_COLLECTIONS.find((collection) => collection.slug === normalizedSlug) || null;
};

const buildGalleryPhoto = (collection, photo, index, subcollection = null) => ({
  id: subcollection ? `${collection.id}-${subcollection.id}-${index + 1}` : `${collection.id}-direct-${index + 1}`,
  title: getPhotoTitle(photo.file, photo.title || subcollection?.title || collection.title),
  imageUrl: `/${collection.assetFolder}/${photo.file}`,
  featured: Boolean(photo.featured),
  collectionId: collection.id,
  subcollectionId: subcollection?.id || null,
  subcollectionSlug: subcollection?.slug || "",
  subcollectionTitle: subcollection?.title || "",
  groupLabel: subcollection?.title || collection.anchor,
  location: subcollection?.location || collection.anchor,
  productId: PRODUCT_ID_BY_ASSET_PATH[`/${collection.assetFolder}/${photo.file}`] || null,
});

export const collectionsData = RAW_COLLECTIONS.map((collection) => buildCollectionSummary(collection));

export const getCollectionBySlug = (slug) => {
  const collection = resolveCollection(slug);
  return collection ? buildCollectionSummary(collection) : null;
};

export const getCollectionGalleryBySlug = (slug) => {
  const collection = resolveCollection(slug);

  if (!collection) {
    return null;
  }

  const photos = hasSubcollections(collection)
    ? collection.subcollections.flatMap((subcollection) =>
        subcollection.photos.map((photo, index) => buildGalleryPhoto(collection, photo, index, subcollection))
      )
    : (collection.photos || []).map((photo, index) => buildGalleryPhoto(collection, photo, index));

  return {
    collection: buildCollectionSummary(collection),
    photos,
  };
};

export const getAllCollections = () => RAW_COLLECTIONS.map((collection) => buildCollectionSummary(collection));
