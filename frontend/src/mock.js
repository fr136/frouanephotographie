// Mock data for Franck Rouane Photography Portfolio

export const mockData = {
  photographer: {
    name: "Franck Rouane",
    tagline: "Photographies de paysages méditerranéens",
    bio: " Photographe de paysage basé à Marseille, je photographie les paysages de la côte méditerranéenne, de la rade de Marseille aux rivages de la Côte d'azur. Mon travail se concentre sur les lumières naturelles, l'horizon de la Méditerranée et ses instants calmes où la mer, le ciel et la côte s’équilibrent. Je photographie ces lieux sans mise en scène, tels qu’ils sont, au moment précis où la lumière illumine leur beauté. Chaque image est pensée comme une photographie durable, destinée à être regardée dans le temps, imprimée et intégrée dans des intérieurs sobres. Mes tirages mettent en valeur la mer Méditerranée, ses couleurs, ses lignes et ses silences." ,
    longBio: "Passionné par la mer depuis mon enfance, j'ai fait de la photographie mon moyen d'expression privilégié. Mes images naissent de longues heures d'observation, d'attente de la lumière parfaite, de cette communion silencieuse avec les éléments. Du lever du soleil sur les calanques aux ciels dramatiques du crépuscule, je cherche à capturer l'essence même de la Méditerranée, cette mer qui a façonné notre histoire et notre culture. Chaque tirage est le fruit d'une approche artisanale, où la technique photographique se met au service de l'émotion et de la beauté naturelle." , 
    email: "rouanefra@live.fr",
    social: {
      instagram: "#",
      facebook: "#",
      pinterest: "#"
    }
  },

  collections: [
    {
      id: 1,
      title: "Sormiou",
      subtitle: "Le bijou marseillais",
      description: "Sormiou, c’est notre bijou. Une grande calanque ouverte, une eau claire comme une piscine, et cette lumière qui fait oublier tout le reste. Quand la mer est calme, la Méditerranée prend des airs de lagon. Pas besoin d’aller loin, ici, c’est les Maldives à la marseillaise.",
      image: "/sormiou-calanque.webp",
     category: "calanques",
     photoCount: 24
    },
    {
      id: 2,
      title: "Calanque des anglais",
      subtitle: "La corniche d'Or",
      description: "La calanque des Anglais, c’est une petite crique à part, nichée entre les roches rouges de l’Estérel. L’eau y est souvent limpide, profonde dès les premiers mètres, avec des reflets bleus intenses quand le soleil tape juste comme il faut. Moins carte postale, plus naturelle, elle garde ce côté sauvage et tranquille qui donne envie de s’arrêter, de regarder, et de profiter du moment",
      image: "/Calanque-agay.webp",
      category: "calanques",
      photoCount: 18,
    },
    {
      id: 3,
      title: "Couchers de Soleil",
      subtitle: "L'or de la Méditerranée",
      description: "Ces moments magiques où le ciel s'embrase et la mer se pare de mille reflets dorés.",
      image: "https://images.unsplash.com/photo-1712103554238-aca4fda947df",
      category: "sunset",
      photoCount: 32,
    },
    {
      id: 4,
      title: "La route des crètes",
      subtitle: "L'éléphant",
      description: "La route des Crêtes fait partie de ces routes qu’on n’oublie pas, souvent décor de films mais malheureusement victime de son succès. Entre La Ciotat et Cassis, elle serpente au-dessus de la Méditerranée, perchée sur les falaises, avec des panoramas ouverts sur la mer à perte de vue. Chaque virage offre une nouvelle perspective, entre ciel, roche et bleu profond. Une route spectaculaire, simple et brute, souvent citée comme l’une des plus belles de la Méditerranée, où le plaisir est autant dans le trajet que dans les points de vue",
      image: "/Coucher de soleil La Ciotat éléphant routedes crêtes.webp",
      category: "sunset",
      photoCount: 21
    },
    {
      id: 5,
      title: "Port d'alon",
      subtitle: "Un coin caché de Méditerrannée",
      description: "DeMalgré son nom, le port d’Alon n’a rien d’un port. C’est une calanque sauvage, sans bateaux ni installations, coincée entre falaises et pinède. Une crique préservée, avec une eau souvent limpide et un calme rare. Ici, pas d’agitation, juste la Méditerranée à l’état brut, idéale pour s’arrêter, observer et profiter du lieu tel qu’il est, et le point de départ du sentier du littoral.",
      image: "/Calanque Port d'alon Saint Cyr sur mer.webp",
      category: "calanques",
      photoCount: 15
    },
    {
      id: 6,
      title: "Paysages Maritimes",
      subtitle: "L'horizon infini",
      description: "La contemplation pure de la mer, ses horizons sans fin, ses couleurs changeantes au fil des heures.",
      image: "https://images.unsplash.com/photo-1627041193914-66f1cf8fbf4f",
      category: "seascapes",
      photoCount: 28
    }
  ],

  featuredProducts: [
    {
      id: 1,
      title: "Lumière Dorée sur la Calanque",
      location: "Calanque de Sormiou, Marseille",
      description: "Tirage d'art en édition limitée. Le soleil couchant illumine les falaises de la calanque de Sormiou, créant une atmosphère magique et sereine.",
      image: "https://images.unsplash.com/photo-1712103554238-aca4fda947df",
      price: 180,
      sizes: ["30x40cm", "50x70cm", "70x100cm"],
      edition: "20 exemplaires",
      category: "calanques"
    },
    {
      id: 2,
      title: "Falaises au Crépuscule",
      location: "Cap Canaille, Cassis",
      description: "Les plus hautes falaises maritimes d'Europe capturées dans la lumière dorée du soir. Un tableau de puissance et de sérénité.",
      image: "https://images.unsplash.com/photo-1691325011849-de814c92dbbd",
      price: 220,
      sizes: ["40x60cm", "60x90cm", "80x120cm"],
      edition: "15 exemplaires",
      category: "wild"
    },
    {
      id: 3,
      title: "Sérénité Marine",
      location: "Plage de Pampelonne, Saint-Tropez",
      description: "La douceur d'une fin de journée sur la plage, où les ondulations du sable créent un ballet de lumière et d'ombre.",
      image: "https://images.unsplash.com/photo-1758769523560-d060d8326fd8",
      price: 160,
      sizes: ["30x40cm", "50x70cm", "70x100cm"],
      edition: "25 exemplaires",
      category: "sunset"
    },
    {
      id: 4,
      title: "Horizon d'Or",
      location: "Baie des Anges, Nice",
      description: "Un coucher de soleil spectaculaire sur la Baie des Anges, avec la silhouette de la ville en toile de fond.",
      image: "https://images.unsplash.com/photo-1759325107581-cf3277629733",
      price: 200,
      sizes: ["40x60cm", "60x90cm", "80x120cm"],
      edition: "20 exemplaires",
      category: "sunset"
    },
    {
      id: 5,
      title: "Port de Cassis au Matin",
      location: "Port de Cassis",
      description: "La quiétude matinale du port de Cassis, où les bateaux colorés se reflètent dans l'eau calme.",
      image: "https://images.unsplash.com/photo-1712227609859-2818504d07cb",
      price: 170,
      sizes: ["30x40cm", "50x70cm", "70x100cm"],
      edition: "20 exemplaires",
      category: "ports"
    },
    {
      id: 6,
      title: "Baie Sauvage",
      location: "Calanque d'En-Vau",
      description: "Une vue aérienne époustouflante de la calanque d'En-Vau, révélant ses eaux cristallines et ses falaises blanches.",
      image: "https://images.pexels.com/photos/34712669/pexels-photo-34712669.jpeg",
      price: 240,
      sizes: ["50x70cm", "70x100cm", "100x150cm"],
      edition: "10 exemplaires",
      category: "calanques"
    }
  ],

  blogPosts: [
    {
      id: 1,
      title: "La Magie de l'Heure Dorée en Photographie Maritime",
      excerpt: "Découvrez pourquoi l'heure dorée est le moment privilégié des photographes maritimes et comment en tirer le meilleur parti.",
      content: "L'heure dorée, ce moment magique juste après le lever ou avant le coucher du soleil, transforme complètement la photographie maritime...",
      image: "https://images.unsplash.com/photo-1712103554238-aca4fda947df",
      date: "2024-01-15",
      category: "Technique",
      readTime: "5 min"
    },
    {
      id: 2,
      title: "Les Calanques : Un Trésor Photographique",
      excerpt: "Guide complet pour photographier les calanques de Marseille à Cassis, avec les meilleurs points de vue et conseils pratiques.",
      content: "Les calanques constituent l'un des plus beaux terrains de jeu pour la photographie de paysage maritime en France...",
      image: "https://images.unsplash.com/photo-1672861864274-6b24d19b578d",
      date: "2024-01-08",
      category: "Destinations",
      readTime: "8 min"
    },
    {
      id: 3,
      title: "Composition en Photographie Maritime : Les Règles d'Or",
      excerpt: "Apprenez à composer vos images maritimes pour créer des photographies captivantes et équilibrées.",
      content: "La composition est l'art de guider le regard du spectateur à travers votre image. En photographie maritime...",
      image: "https://images.unsplash.com/photo-1758769523560-d060d8326fd8",
      date: "2023-12-22",
      category: "Technique",
      readTime: "6 min"
    },
    {
      id: 4,
      title: "Photographier les Ports de la Côte d'Azur",
      excerpt: "Des conseils pratiques pour capturer l'âme des ports méditerranéens, de l'aube au crépuscule.",
      content: "Les ports de la Côte d'Azur offrent une diversité de sujets photographiques exceptionnelle...",
      image: "https://images.unsplash.com/photo-1712227609859-2818504d07cb",
      date: "2023-12-10",
      category: "Destinations",
      readTime: "7 min"
    }
  ],

  testimonials: [
    {
      id: 1,
      name: "Sophie Martin",
      location: "Marseille",
      text: "Les photographies de Franck ont transformé mon intérieur. Chaque jour, je voyage à travers ses images des calanques. Un travail d'une qualité exceptionnelle.",
      rating: 5
    },
    {
      id: 2,
      name: "Jean-Pierre Dubois",
      location: "Nice",
      text: "En tant que collectionneur de photographie d'art, je suis impressionné par la sensibilité et la maîtrise technique de Franck. Ses tirages sont magnifiques.",
      rating: 5
    },
    {
      id: 3,
      name: "Marie Leclerc",
      location: "Cannes",
      text: "J'ai offert un tirage à mes parents pour leur anniversaire. Ils sont tombés sous le charme de cette vue sur la Méditerranée. Merci Franck!",
      rating: 5
    }
  ],

  services: [
    {
      id: 1,
      title: "Tirages d'Art",
      description: "Photographies en édition limitée, numérotées et signées, imprimées sur papier Fine Art de qualité muséale.",
      icon: "image"
    },
    {
      id: 2,
      title: "Commandes Personnalisées",
      description: "Créations sur mesure pour votre intérieur ou votre entreprise. Nous discutons ensemble de vos besoins spécifiques.",
      icon: "palette"
    },
    {
      id: 3,
      title: "Expositions & Galeries",
      description: "Collaborations avec des galeries d'art et organisation d'expositions pour présenter mes œuvres au public.",
      icon: "gallery-horizontal"
    }
  ],

  faq: [
    {
      id: 1,
      question: "Quels sont les formats disponibles pour les tirages?",
      answer: "Je propose plusieurs formats adaptés à tous les intérieurs : 30x40cm, 40x60cm, 50x70cm, 60x90cm, 70x100cm, 80x120cm et 100x150cm. Chaque format est soigneusement choisi pour respecter les proportions et l'impact visuel de l'image."
    },
    {
      id: 2,
      question: "Sur quel support sont imprimées les photographies?",
      answer: "Tous mes tirages sont réalisés sur papier Fine Art de qualité professionnelle, garantissant une durabilité de plus de 100 ans et un rendu exceptionnel des couleurs et des détails."
    },
    {
      id: 3,
      question: "Qu'est-ce qu'une édition limitée?",
      answer: "Chaque photographie est imprimée en nombre limité (10 à 25 exemplaires selon l'image), numérotée et signée. Cette rareté garantit l'exclusivité et la valeur de votre acquisition."
    },
    {
      id: 4,
      question: "Proposez-vous un service d'encadrement?",
      answer: "Oui, je peux vous conseiller et vous mettre en relation avec des encadreurs professionnels qui sauront mettre en valeur votre tirage avec un encadrement de qualité muséale."
    },
    {
      id: 5,
      question: "Puis-je commander une photographie d'un lieu spécifique?",
      answer: "Absolument! Je prends des commandes personnalisées. Contactez-moi pour discuter de votre projet et nous verrons ensemble comment le concrétiser."
    }
  ]
};
