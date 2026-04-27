/**
 * Données statiques du site — Franck Rouane Photographie
 *
 * Utilisé par : Home.js, About.js, Contact.js
 * Les collections sont gérées par services/api.js et data/collectionsData.js
 * Les produits boutique sont dans pages/Shop.js
 */

export const mockData = {
  photographer: {
    name: "Franck Rouane",
    tagline: "Photographies de paysages méditerranéens",
    specialty: "Paysages méditerranéens",
    bio: "Photographe de paysage basé à Marseille, je photographie les paysages de la côte méditerranéenne, de la rade de Marseille aux rivages de la Côte d'Azur. Mon travail se concentre sur les lumières naturelles, l'horizon de la Méditerranée et ses instants calmes où la mer, le ciel et la côte s'équilibrent. Je photographie ces lieux sans mise en scène, tels qu'ils sont, au moment précis où la lumière illumine leur beauté. Chaque image est pensée comme une photographie durable, destinée à être regardée dans le temps, imprimée et intégrée dans des intérieurs sobres. Mes tirages mettent en valeur la mer Méditerranée, ses couleurs, ses lignes et ses silences.",
    longBio: "Passionné par la mer depuis mon enfance, j'ai fait de la photographie mon moyen d'expression privilégié. Mes images naissent de longues heures d'observation, d'attente de la lumière parfaite, de cette communion silencieuse avec les éléments. Du lever du soleil sur les calanques aux ciels dramatiques du crépuscule, je cherche à capturer l'essence même de la Méditerranée, cette mer qui a façonné notre histoire et notre culture. Chaque tirage est le fruit d'une approche artisanale, où la technique photographique se met au service de l'émotion et de la beauté naturelle.",
    email: "rouanefra@live.fr",
    social: {
      instagram: "https://www.instagram.com/frouanephotographie",
      facebook: "https://www.facebook.com/frouanephotographie",
    },
  },

  services: [
    {
      id: 1,
      title: "Tirages d'Art",
      description:
        "Photographies en édition limitée, numérotées et signées, imprimées sur papier Fine Art de qualité muséale.",
      icon: "image",
    },
    {
      id: 2,
      title: "Commandes Personnalisées",
      description:
        "Créations sur mesure pour votre intérieur ou votre entreprise. Nous discutons ensemble de vos besoins spécifiques.",
      icon: "palette",
    },
    {
      id: 3,
      title: "Expositions & Galeries",
      description:
        "Collaborations avec des galeries d'art et organisation d'expositions pour présenter mes œuvres au public.",
      icon: "gallery-horizontal",
    },
  ],

  faq: [
    {
      id: 1,
      question: "Quels sont les formats disponibles pour les tirages ?",
      answer:
        "Je propose plusieurs formats adaptés à chaque image et chaque intérieur : 20x30 cm, 30x40 cm, 30x45 cm, 40x60 cm et 50x70 cm selon la résolution disponible. Chaque format est sélectionné pour garantir une qualité d'impression optimale.",
    },
    {
      id: 2,
      question: "Sur quel support sont imprimées les photographies ?",
      answer:
        "Tous mes tirages sont réalisés sur papier Enhanced Matte Art 200gsm, de qualité muséale, via impression giclée. Ce papier garantit une durabilité exceptionnelle et un rendu fidèle des couleurs.",
    },
    {
      id: 3,
      question: "Qu'est-ce qu'une édition limitée ?",
      answer:
        "Chaque photographie est imprimée en nombre limité (10 à 25 exemplaires selon l'image), numérotée et signée. Cette rareté garantit l'exclusivité et la valeur de votre acquisition.",
    },
    {
      id: 4,
      question: "Proposez-vous un service d'encadrement ?",
      answer:
        "Oui, je peux vous conseiller et vous mettre en relation avec des encadreurs professionnels qui sauront mettre en valeur votre tirage avec un encadrement de qualité muséale.",
    },
    {
      id: 5,
      question: "Puis-je commander une photographie d'un lieu spécifique ?",
      answer:
        "Absolument. Je prends des commandes personnalisées. Contactez-moi pour discuter de votre projet et nous verrons ensemble comment le concrétiser.",
    },
  ],
};
