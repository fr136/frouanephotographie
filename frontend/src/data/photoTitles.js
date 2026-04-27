const PHOTO_TITLES = {
  "bougainvillier-bandol01.jpg": "Bandol",
  "calanque-des-anglais01.webp": "Calanque des Anglais",
  "calanque-en-vau02.jpeg": "Calanque d'En-Vau",
  "calanque-port-d-alon01.webp": "Calanque de Port d'Alon",
  "calanque-port-d-alon02.webp": "Calanque de Port d'Alon",
  "calanque-port-d-alon03.webp": "Calanque de Port d'Alon",
  "calanque-port-d-alon04.webp": "Calanque de Port d'Alon",
  "calanque-sormiou01.webp": "Calanque de Sormiou",
  "calanque-sormiou02.webp": "Calanque de Sormiou",
  "calanque-sormiou03.webp": "Calanque de Sormiou",
  "calanque-sormiou04.webp": "Calanque de Sormiou",
  "calanque-sormiou05.webp": "Calanque de Sormiou",
  "calanque-sormiou06.webp": "Calanque de Sormiou",
  "cap-canaille01.webp": "Cap Canaille",
  "cap-canaille02.jpg": "Cap Canaille",
  "la-madrague-saint-cyr-sur-mer01.webp": "La Madrague, Saint-Cyr-sur-Mer",
  "plage-beaucours01.webp": "Beaucours",
  "plage-beaucours02.webp": "Beaucours",
  "plage-la-fossette01.webp": "Plage de la Fossette",
  "plage-la-fossette02.webp": "Plage de la Fossette",
  "plage-la-fossette03.webp": "Plage de la Fossette",
  "plage-portissol01.webp": "Plage de Portissol",
  "port-de-cassis01.webp": "Port de Cassis",
  "sugiton01.jpeg": "Sugiton",
  "sugiton02.jpg": "Sugiton",
  "Coucher de soleil La Ciotat éléphant routedes crêtes.webp": "Route des Crêtes, La Ciotat",
  "sunset fire la ciotat.webp": "La Ciotat au coucher du soleil",
  "Sunset La Ciotat1.webp": "La Ciotat au coucher du soleil",
  "Sunset catalans marseille.webp": "Plage des Catalans, Marseille",
  "Sunset catalans.webp": "Plage des Catalans, Marseille",
  "Sunset fire la ciotat 4.webp": "La Ciotat au coucher du soleil",
  "sunset l'estaque Marseille.webp": "L'Estaque, Marseille",
  "sunset port saintjean la ciotat.webp": "Port Saint-Jean, La Ciotat",
  "sunset serpent bain des dames marseille.webp": "Bain des Dames, Marseille",
  "lever-de-soleil-laciotat01.jpg": "Lever de soleil à La Ciotat",
  "lever-de-soleil-laciotat02.jpg": "Lever de soleil à La Ciotat",
  "lever-de-soleil-laciotat03.jpg": "Lever de soleil à La Ciotat",
  "lever-de-soleil-laciotat05.jpg": "Lever de soleil à La Ciotat",
  "lever-de-soleil-laciotat06.jpg": "Lever de soleil à La Ciotat",
};

export const getPhotoTitle = (fileName, fallback = "") => PHOTO_TITLES[fileName] || fallback;

export const getPhotoTitleFromPath = (imagePath, fallback = "") => {
  const fileName = imagePath.split("/").pop() || imagePath;
  return getPhotoTitle(fileName, fallback);
};

export default PHOTO_TITLES;
