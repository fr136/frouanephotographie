const PHOTO_TITLES = {
  'Calanque Sormiou 2.webp': 'Calanque de Sormiou',
  'Calanque des anglais.webp': 'Calanque des Anglais',
  'sormiou-calanque.webp': 'Calanque de Sormiou',
  'Port de cassis.webp': 'Port de Cassis',
  "Calanque Port d'alon Saint Cyr sur mer.webp": "Calanque de Port d'Alon",
  'Calanque-agay.webp': 'Agay',
  'Calanque des anglais 4.webp': 'Calanque des Anglais',
  'Sormiou.webp': 'Calanque de Sormiou',
  '18119A7F-28BE-4A93-9230-6BEFED42DCD4.webp': 'Calanques de Marseille',
  '20190430_110445.webp': 'Calanques de Marseille',
  '20190501_145849.webp': 'Calanques de Marseille',
  '20190501_151736.webp': 'Calanques de Marseille',
  '20190512_143918.webp': 'Calanques de Marseille',
  '20190512_184000.webp': 'Calanques de Marseille',
  '20190619_181717.webp': 'Calanques de Marseille',
  '20190623_185257.webp': 'Calanques de Marseille',
  '20190721_173235.webp': 'Calanques de Marseille',
  '20190730_175539.webp': 'Calanques de Marseille',
  '20190811_203722.webp': 'Calanques de Marseille',
  '20160326_113351.webp': 'Calanques de Marseille',
  '20190430_233132.webp': 'Calanques de Marseille',
  '20190430_233154.webp': 'Calanques de Marseille',
  '20190501_001450.webp': 'Calanques de Marseille',
  '20190501_001511.webp': 'Calanques de Marseille',
  '20190501_001624.webp': 'Calanques de Marseille',
  '20190501_151749.webp': 'Calanques de Marseille',
  '20190501_155537.webp': 'Calanques de Marseille',
  '20190523_192306.webp': 'Calanques de Marseille',
  'Coucher de soleil La Ciotat éléphant routedes crêtes.webp': 'Route des Crêtes, La Ciotat',
  'sunset fire la ciotat.webp': 'La Ciotat',
  'Sunset La Ciotat1.webp': 'La Ciotat',
  'Sunset catalans marseille.webp': 'Plage des Catalans, Marseille',
  'Sunset catalans.webp': 'Plage des Catalans, Marseille',
  'Sunset fire la ciotat 4.webp': 'La Ciotat',
  'sunset fire  la ciotat.webp': 'La Ciotat',
  'sunset fire la ciotat 3.jpg': 'La Ciotat',
  "sunset l'estaque Marseille.webp": "L'Estaque, Marseille",
  'sunset port saintjean la ciotat.webp': 'Port Saint-Jean, La Ciotat',
  'sunset serpent bain des dames marseille.webp': 'Bain des Dames, Marseille',
};

export const getPhotoTitle = (fileName, fallback = '') => PHOTO_TITLES[fileName] || fallback;

export const getPhotoTitleFromPath = (imagePath, fallback = '') => {
  const fileName = imagePath.split('/').pop() || imagePath;
  return getPhotoTitle(fileName, fallback);
};

export default PHOTO_TITLES;
