// Données enrichies des collections avec sensibilisation écologique

export const collectionsData = [
  {
    id: "calanques-marseille",
    title: "Calanques de Marseille",
    subtitle: "Les joyaux cachés de la côte",
    slug: "calanques-marseille",
    category: "calanques",
    description: "Explorez la beauté sauvage des calanques, ces criques où la roche blanche plonge dans les eaux turquoise cristallines. Un écosystème unique et fragile à préserver.",
    
    // Contenu enrichi
    anecdote: "Les Calanques sont nées il y a 120 millions d'années, lorsque la mer a envahi les vallées creusées par les rivières. Ce labyrinthe de calcaire blanc cache des grottes sous-marines et des criques secrètes accessibles seulement par la mer. Chaque lever de soleil révèle une palette de couleurs changeantes sur ces falaises majestueuses.",
    
    story: "Un matin d'avril, alors que le mistral soufflait encore, j'ai attendu trois heures que la lumière parfaite caresse les falaises de Sormiou. Le silence était absolu, seul le cri d'un goéland rompait la quiétude. C'est dans ces moments de patience que naissent les plus belles images, quand la nature accepte de révéler son âme.",
    
    photographyTips: [
      "🌅 Privilégiez l'aube (6h-8h) pour éviter la foule et profiter d'une lumière dorée magique",
      "📸 Utilisez un filtre polarisant pour intensifier le bleu turquoise de l'eau",
      "🎯 Les meilleures vues : Sugiton (rocher du Torpilleur), En-Vau (plage), Sormiou (hauteurs)",
      "⛰️ Pensez grand-angle (16-35mm) pour capturer l'immensité, téléobjectif (70-200mm) pour les détails"
    ],
    
    ecology: {
      status: "Parc National depuis 2012 - Zone hautement protégée",
      protectedSpecies: [
        {
          name: "Aigle de Bonelli",
          status: "En danger critique d'extinction",
          description: "Moins de 30 couples nicheurs en France. Ce rapace majestueux chasse dans les calanques. Ne jamais s'approcher des falaises durant la période de nidification (février-juillet).",
          icon: "🦅"
        },
        {
          name: "Posidonie (Posidonia oceanica)",
          status: "Espèce protégée - Patrimoine mondial",
          description: "Poumon de la Méditerranée, ces herbiers produisent 20L d'oxygène par jour et par m². Ils abritent 25% de la biodiversité marine méditerranéenne. Ne jamais jeter l'ancre sur un herbier !",
          icon: "🌱"
        },
        {
          name: "Puffin yelkouan",
          status: "Vulnérable",
          description: "Oiseau marin emblématique nichant dans les grottes. Sensible à la pollution lumineuse et sonore.",
          icon: "🐦"
        },
        {
          name: "Mérou brun",
          status: "Espèce protégée",
          description: "Poisson curieux qui peut vivre 50 ans. Sa population se reconstruit grâce à la protection. Observation uniquement, jamais de pêche.",
          icon: "🐟"
        }
      ],
      
      threats: [
        {
          title: "Surfréquentation estivale",
          description: "Plus de 2 millions de visiteurs/an. Les sentiers s'érodent, la faune est dérangée, les déchets s'accumulent.",
          impact: "🔴 Critique",
          icon: "👥"
        },
        {
          title: "Pollution marine",
          description: "Plastiques, mégots, crèmes solaires chimiques détruisent l'écosystème marin. Un mégot pollue 500L d'eau pendant 12 ans.",
          impact: "🔴 Critique", 
          icon: "🗑️"
        },
        {
          title: "Ancrage sauvage",
          description: "Les ancres des bateaux arrachent les herbiers de posidonie qui mettent 100 ans à se reconstituer.",
          impact: "🔴 Critique",
          icon: "⚓"
        },
        {
          title: "Incendies",
          description: "Climat méditerranéen + sécheresse + négligence humaine = risque maximal. La garrigue met 30 ans à se régénérer.",
          impact: "🔴 Critique",
          icon: "🔥"
        }
      ],
      
      respectGuidelines: [
        "✅ Venez hors saison (avril-mai, septembre-octobre) pour préserver les lieux",
        "✅ Restez sur les sentiers balisés - L'érosion détruit la flore endémique",
        "✅ Ramener TOUS vos déchets - Même organiques (pelures d'orange = 2 ans de décomposition)",
        "✅ Crème solaire minérale uniquement - Les filtres chimiques tuent le corail et la posidonie",
        "✅ Pas de musique, respect du silence - Les oiseaux nicheurs sont ultra-sensibles",
        "✅ Réservation obligatoire l'été (juillet-août) - Limitez votre impact",
        "❌ Zéro cueillette de plantes, coquillages, roches",
        "❌ Interdiction absolue de feu (mai-septembre) sous peine d'amende + prison",
        "❌ Pas de camping sauvage - Aires dédiées uniquement",
        "❌ Pas de drones sans autorisation - Dérangement de la faune protégée"
      ],
      
      positiveActions: [
        "🌊 Participez aux clean-ups organisés par le Parc National (calendrier sur leur site)",
        "♻️ Utilisez les poubelles de tri en sortant du parc",
        "🚶 Préférez les navettes maritimes ou vélo plutôt que la voiture",
        "📚 Éduquez votre entourage sur la fragilité de cet écosystème",
        "💚 Soutenez les associations locales de protection (Parc National, LPO, SOS Grand Bleu)"
      ]
    },
    
    bestPeriods: {
      ideal: "Avril-Mai & Septembre-Octobre",
      avoid: "Juillet-Août (canicule, affluence, restrictions d'accès)",
      photography: "Mars-Avril pour les fleurs, Septembre pour les lumières dorées"
    },
    
    practicalInfo: {
      access: "Bus 21 depuis Marseille, parking Luminy (complet dès 8h l'été)",
      difficulty: "Randonnées moyennes à difficiles, dénivelé important",
      duration: "4h à 8h selon les calanques",
      water: "Aucun point d'eau - Prévoir 2L/personne minimum",
      rescue: "☎️ 196 (secours en mer), 112 (urgence)",
      regulations: "Massif fermé en cas d'alerte rouge incendie - Vérifier Météo France"
    }
  },
  
  {
    id: "ports-cote-azur",
    title: "Ports de la Côte d'Azur",
    subtitle: "L'élégance maritime menacée",
    slug: "ports-cote-azur",
    category: "ports",
    description: "Des petits ports de pêche authentiques aux marinas prestigieuses, découvrez le charme intemporel de nos havres maritimes. Mais derrière la carte postale, un équilibre fragile entre tradition et bétonisation.",
    
    anecdote: "Cassis, Sanary, Villefranche... Ces ports ont vu passer les Phéniciens, les Grecs, les Romains. Aujourd'hui, les pointus traditionnels côtoient les yachts de luxe. Chaque port raconte l'histoire d'un village qui résiste ou se transforme face au tourisme de masse. Les pêcheurs partent à 4h du matin, rentrent à 11h. Si vous voulez capturer l'authenticité, c'est à l'aube qu'il faut être là.",
    
    story: "À Cassis, un vieux pêcheur m'a raconté qu'il y a 40 ans, on comptait 80 pointus. Aujourd'hui, il en reste 15. Les loyers ont explosé, les fils ne reprennent plus le métier. 'Les touristes veulent voir des bateaux de pêche, mais ils ne veulent plus manger du poisson local, trop cher', m'a-t-il dit avec amertume. Cette photo de son bateau au lever du soleil, c'est peut-être le dernier témoignage d'un monde qui disparaît.",
    
    photographyTips: [
      "🌅 Lever du soleil (5h30-7h) : retour des pêcheurs, lumière rasante sur les façades colorées",
      "🌊 Marée basse pour les reflets dans l'eau calme",
      "📸 50mm f/1.8 pour isoler les détails, 24mm pour les panoramas de port",
      "🎨 Cassis (authentique), Villefranche (pittoresque), Saint-Jean-Cap-Ferrat (luxueux)"
    ],
    
    ecology: {
      status: "Écosystème côtier sous haute pression urbanistique",
      protectedSpecies: [
        {
          name: "Grande nacre (Pinna nobilis)",
          status: "En danger critique - Quasi-éteinte",
          description: "Plus grand coquillage de Méditerranée (jusqu'à 1m20). Épidémie de parasite en 2016 : 99% de mortalité. Survie de l'espèce en jeu.",
          icon: "🐚"
        },
        {
          name: "Hippocampe moucheté",
          status: "Protégé",
          description: "Vit dans les herbiers peu profonds près des ports. Indicateur de qualité de l'eau.",
          icon: "🐎"
        },
        {
          name: "Corb (poisson)",
          status: "Surpêché",
          description: "Poisson emblématique de la pêche traditionnelle. Stocks en chute libre.",
          icon: "🐠"
        }
      ],
      
      threats: [
        {
          title: "Bétonisation du littoral",
          description: "86% du littoral français artificialisé. Chaque nouveau port de plaisance détruit des zones de frai.",
          impact: "🔴 Critique",
          icon: "🏗️"
        },
        {
          title: "Pollution des eaux portuaires",
          description: "Hydrocarbures, peintures antifouling toxiques, eaux noires des bateaux. Les ports sont des zones mortes pour la vie marine.",
          impact: "🔴 Critique",
          icon: "🛢️"
        },
        {
          title: "Surpêche et pêche illégale",
          description: "Stocks de poissons en effondrement. Tailles minimales non respectées. Pêche de loisir non régulée.",
          impact: "🔴 Critique",
          icon: "🎣"
        },
        {
          title: "Tourisme de masse",
          description: "Villages saturés l'été. Hausse des loyers = départ des locaux. Perte d'authenticité et de culture maritime.",
          impact: "🟠 Élevé",
          icon: "🚢"
        }
      ],
      
      respectGuidelines: [
        "✅ Consommez du poisson local de pêche durable - Cherchez le label MSC ou Pavillon France",
        "✅ Respectez les tailles minimales de capture (bar 42cm, daurade 23cm, etc.)",
        "✅ Visitez hors-saison - Les villages retrouvent leur âme en automne/hiver",
        "✅ Soutenez les petits commerces locaux plutôt que les chaînes",
        "✅ Ne jetez RIEN dans l'eau - Même biodégradable (pelures, mégots, etc.)",
        "❌ Ne nourrissez pas les poissons et oiseaux - Perturbation de la chaîne alimentaire",
        "❌ Pas de pêche dans les zones interdites (herbiers, réserves)",
        "❌ Pas d'achat de coquillages vivants pour décoration",
        "❌ Refusez le plastique à usage unique sur les terrasses",
        "❌ Ne marchez pas sur les rochers à marée basse - Vous écrasez des centaines d'organismes"
      ],
      
      positiveActions: [
        "🐟 Achetez directement aux pêcheurs à leur retour (vente à quai)",
        "♻️ Participez aux opérations 'Ports propres' - Nettoyage des fonds marins",
        "🚲 Privilégiez vélo/bus - Parkings saturés = pollution",
        "📸 Partagez la beauté pour sensibiliser, pas pour faire venir plus de monde",
        "💙 Soutenez les associations: Clean My Calanques, Longitude 181, Wings of the Ocean"
      ]
    },
    
    bestPeriods: {
      ideal: "Mai-Juin & Septembre-Octobre",
      avoid: "Juillet-Août (foule, chaleur, authenticité perdue)",
      photography: "Automne pour les lumières chaudes et les villages paisibles"
    }
  },
  
  {
    id: "couchers-soleil",
    title: "Couchers de Soleil",
    subtitle: "L'or fragile de la Méditerranée",
    slug: "couchers-soleil",
    category: "sunset",
    description: "Ces moments magiques où le ciel s'embrase et la mer se pare de mille reflets dorés. Mais combien de couchers de soleil verront nos enfants si nous ne protégeons pas ce littoral ?",
    
    anecdote: "Un coucher de soleil sur la Méditerranée n'est jamais le même. La poussière du Sahara colore le ciel en rose, les embruns créent des halos, le mistral nettoie l'atmosphère pour un orange éclatant. Les anciens marins savaient lire le ciel : 'Ciel rouge le soir, espoir. Ciel rouge le matin, chagrin.' J'ai photographié plus de 500 couchers de soleil. Chacun unique. Chacun éphémère.",
    
    story: "Cap d'Antibes, juin 2023. Je photographie le coucher de soleil depuis 10 ans au même endroit. Cette année, j'ai remarqué quelque chose d'inquiétant : la ligne d'horizon est brouillée par la pollution atmosphérique, même en été. Les couleurs sont moins éclatantes. Le changement climatique et la pollution modifient même la beauté de nos crépuscules.",
    
    photographyTips: [
      "🌅 Golden hour : 30 min avant le coucher jusqu'à 20 min après",
      "📸 Mode manuel : ISO 100-400, f/8-11, vitesse adaptée (1/125 à 1/500)",
      "🎨 Sous-exposez de -1 EV pour saturer les couleurs",
      "🏖️ Meilleurs spots : Calanque de Sormiou, Cap d'Antibes, Plage de l'Estaque"
    ],
    
    ecology: {
      status: "Paysages côtiers menacés par le changement climatique",
      protectedSpecies: [
        {
          name: "Tortue caouanne",
          status: "En danger",
          description: "Vient pondre sur certaines plages la nuit. La pollution lumineuse des fronts de mer désoriente les bébés tortues qui vont vers les lumières au lieu de la mer.",
          icon: "🐢"
        }
      ],
      
      threats: [
        {
          title: "Pollution lumineuse",
          description: "Les fronts de mer illuminés toute la nuit perturbent la faune nocturne et gaspillent l'énergie. Biodiversité marine en danger.",
          impact: "🔴 Critique",
          icon: "💡"
        },
        {
          title: "Montée des eaux",
          description: "+20cm depuis 1900. Prévision : +1m d'ici 2100. Les plages où vous photographiez disparaîtront.",
          impact: "🔴 Critique",
          icon: "🌊"
        },
        {
          title: "Érosion côtière",
          description: "Le littoral recule de 50cm à 2m par an. Bétonisation + tempêtes + montée des eaux = disparition des plages.",
          impact: "🔴 Critique",
          icon: "🏖️"
        },
        {
          title: "Pollution atmosphérique et plastique",
          description: "Microplastiques dans l'air, dans l'eau, dans les poissons. Visibilité réduite, santé menacée.",
          impact: "🟠 Élevé",
          icon: "🌫️"
        }
      ],
      
      respectGuidelines: [
        "✅ Éteignez vos éclairages inutiles en bord de mer la nuit",
        "✅ Ramassez les déchets même s'ils ne sont pas les vôtres",
        "✅ Préférez les transports doux pour accéder aux plages",
        "✅ Sensibilisez sur le changement climatique à travers vos photos",
        "❌ Pas de feu de camp sur les plages (amendes + dégâts écologiques)",
        "❌ Ne dérangez pas la faune au crépuscule (période d'alimentation)",
        "❌ Pas de drones près des colonies d'oiseaux marins"
      ],
      
      positiveActions: [
        "🌍 Réduisez votre empreinte carbone - Le changement climatique détruit ces paysages",
        "🔦 Utilisez des lampes rouges la nuit (moins perturbantes pour la faune)",
        "📸 Documentez l'érosion côtière - Vos photos sont des archives scientifiques",
        "🗳️ Votez pour des politiques environnementales ambitieuses"
      ]
    }
  },
  
  {
    id: "cote-sauvage",
    title: "Côte Sauvage",
    subtitle: "Derniers remparts face à l'urbanisation",
    slug: "cote-sauvage",
    category: "wild",
    description: "Les falaises abruptes, les vagues qui se brisent, la nature dans toute sa force et sa majesté. Ces portions de littoral préservées sont les derniers sanctuaires d'une Méditerranée authentique.",
    
    ecology: {
      threats: [
        {
          title: "Projets immobiliers illégaux",
          description: "Constructions sauvages, lotissements sur le littoral. Loi Littoral bafouée.",
          impact: "🔴 Critique",
          icon: "🏠"
        }
      ],
      respectGuidelines: [
        "✅ Signalez les constructions illégales sur le littoral",
        "✅ Respectez la propriété du Conservatoire du littoral",
        "❌ Aucun prélèvement de roches, coquillages, plantes"
      ]
    }
  }
];

// Mapping des slugs pour correspondance
const SLUG_MAPPING = {
  'calanques': 'calanques-marseille',
  'calanques-marseille': 'calanques-marseille',
  'sunset': 'couchers-soleil',
  'couchers-soleil': 'couchers-soleil',
};

// Fonction helper pour récupérer une collection par slug
export const getCollectionBySlug = (slug) => {
  const mappedSlug = SLUG_MAPPING[slug] || slug;
  return collectionsData.find(c => c.slug === mappedSlug);
};

export const getAllCollections = () => {
  return collectionsData;
};
