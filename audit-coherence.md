# Audit de cohérence — frouanephotographie.com
**Date** : 2026-05-04  
**Version du code analysé** : branche `main`, commit `e852626`  
**Périmètre** : codebase complète (frontend), pas de crawler live (SPA React)

---

## Fichiers clés audités

| Rôle | Fichier |
|---|---|
| Carte interactive (coordonnées GPS) | `frontend/src/components/InteractiveMap.js` |
| Collections / sous-collections / emplacements | `frontend/src/data/collectionsData.js` |
| Titres des photos (par filename) | `frontend/src/data/photoTitles.js` |
| Catalogue produit (titre, lieu, prix) | `frontend/src/data/productCatalog.json` |
| Catalogue assets Prodigi | `frontend/src/data/printAssetCatalog.json` |
| Données photographe / FAQ | `frontend/src/mock.js` |
| SEO dynamique (Helmet) | `frontend/src/components/SEOHead.js` |
| SEO statique / OG / schema.org racine | `frontend/public/index.html` |
| Sitemap | `frontend/public/sitemap.xml` |
| Page d'accueil | `frontend/src/pages/Home.js` |
| Page À propos | `frontend/src/pages/About.js` |
| Assets photos | `frontend/public/Calanques/`, `/Sunset/`, `/Sunrise/` |

---

## Inventaire des marqueurs carte

| id | Nom affiché | Coordonnées déclarées | Collection |
|---|---|---|---|
| loc-sormiou | Sormiou | 43.2101, 5.4192 | calanques |
| loc-sugiton | Sugiton | 43.2102, 5.4426 | calanques |
| loc-envau | En-Vau | 43.2112, 5.4990 | calanques |
| loc-cassis | Port de Cassis | 43.2144, 5.5375 | calanques |
| loc-port-dalon | Port d'Alon | 43.1490, 5.7120 | calanques |
| loc-sunset-ciotat | La Ciotat - Route des Crêtes | 43.2153, 5.5524 | sunset |
| loc-catalans | Plage des Catalans | 43.2878, 5.3546 | sunset |
| loc-estaque | L'Estaque | 43.3614, 5.3089 | sunset |
| loc-port-saint-jean | Port Saint-Jean | 43.1864, 5.6285 | sunset |
| loc-bain-des-dames | Bain des Dames | 43.2400, 5.3625 | sunset |
| loc-sunrise-ciotat | Lever de soleil - La Ciotat | 43.1745, 5.6044 | sunrise |

---

## Inventaire des assets photos

### Calanques (public/Calanques/)
`calanque-sormiou01-06.webp`, `sugiton01.jpeg`, `sugiton02.jpg`, `sugiton03.webp`, `sugiton03.jpeg` ⚠️, `sugiton04.webp`, `sugiton04.jpeg` ⚠️, `calanque-en-vau02.jpeg`, `calanque-port-d-alon01-04.webp`, `port-de-cassis01.webp`, `cap-canaille01.webp`, `cap-canaille02.jpg`, `la-madrague-saint-cyr-sur-mer01.webp`, `bougainvillier-bandol01.jpg`, `plage-beaucours01-02.webp`, `plage-la-fossette01-03.webp`, `plage-portissol01.webp`, `calanque-des-anglais01.webp`

### Sunset (public/Sunset/)
`Coucher de soleil La Ciotat éléphant routedes crêtes.webp`, `Sunset La Ciotat1.webp`, `Sunset catalans marseille.webp`, `Sunset catalans.webp`, `Sunset fire la ciotat 4.webp`, `sunset fire la ciotat.webp`, `sunset fire  la ciotat.webp` ⚠️ (double espace), `sunset fire la ciotat 3.jpg` ⚠️, `sunset l'estaque Marseille.webp`, `sunset port saintjean la ciotat.webp`, `sunset serpent bain des dames marseille.webp`, `Cover.JPEG`

### Sunrise (public/Sunrise/)
`lever-de-soleil-laciotat01-06.jpg` (incl. `04.jpg` ⚠️ orphelin)

---

## PRIORITÉ 1 — Erreurs factuelles bloquantes

### E1 — Sugiton : coordonnées GPS fausses (1,1 km de décalage)

**Fichier** : `InteractiveMap.js:71`  
**Données actuelles** : `coordinates: [43.2102, 5.4426]`  
**Données correctes** : `[43.2094, 5.4567]`  
**Sources** : OpenStreetMap way #37888561 ; IGN Géoportail (calanque de Sugiton, commune de Marseille, massif des Calanques).

**Analyse** : L'écart en longitude est de `5.4567 - 5.4426 = 0.0141°`, soit environ **1 100 m vers l'ouest**. Le marqueur actuel se situe entre Sormiou et Sugiton, beaucoup plus près de Sormiou. Un utilisateur cliquant sur le lien Google Maps atterrit 1 km trop loin, dans un lieu qui n'est ni Sugiton ni Sormiou.

**Correction** :
```diff
- coordinates: [43.2102, 5.4426],
+ coordinates: [43.2094, 5.4567],
```

---

### E2 — "La Ciotat - Route des Crêtes" : marqueur géographiquement à Cassis

**Fichier** : `InteractiveMap.js:129`  
**Données actuelles** : `coordinates: [43.21527, 5.552392]`, `name: "La Ciotat - Route des Crêtes"`  
**Problème** : Les coordonnées `[43.21527, 5.552392]` se trouvent à moins d'1 km au nord-est du port de Cassis (`[43.2144, 5.5375]`), sur le territoire de la commune de **Cassis**, à l'entrée ouest de la Route des Crêtes. Ce point est géographiquement à Cassis, pas à La Ciotat.

**Repères Route des Crêtes (D141) :**
- Départ côté Cassis : ~43.207° N, 5.541° E
- Sommet / belvédère Cap Canaille : ~43.1999° N, 5.5795° E  
- Arrivée côté La Ciotat / Sémaphore : ~43.185° N, 5.607° E

**Source** : IGN Géoportail, trace de la D141 ; OSM relation #4553942.

**Options de correction** (décision éditoriale requise) :

*Option A — Représenter le belvédère du Cap Canaille (point le plus emblématique de la Route des Crêtes) :*
```diff
- name: "La Ciotat - Route des Crêtes",
- coordinates: [43.21527, 5.552392],
+ name: "Route des Crêtes – Cap Canaille",
+ coordinates: [43.1999, 5.5795],
```

*Option B — Représenter le point de vue côté La Ciotat (Sémaphore) :*
```diff
- name: "La Ciotat - Route des Crêtes",
- coordinates: [43.21527, 5.552392],
+ name: "La Ciotat – Route des Crêtes",
+ coordinates: [43.1854, 5.6070],
```

> **À DÉCIDER PAR FRANCK** : Quelle partie de la Route des Crêtes est photographiée ? Si c'est depuis le belvédère du Cap Canaille (côté Cassis), Option A. Si c'est depuis le versant La Ciotat, Option B.

---

### E3 — "Côte d'Azur" et "French Riviera" pour des lieux en Provence

**Fichiers concernés** :
- `index.html:51` — title : `"Photographie maritime & tirages d'art Côte d'Azur | Franck Rouane"`
- `index.html:15` — keywords : `"photographe Côte d'Azur"`
- `index.html:29` — og:description : `"...mer Méditerranée et de la Côte d'Azur"`
- `index.html:43` — twitter description : `"French Riviera landscapes"`, `"French Riviera photographer"`
- `index.html:95` — OG image caption : `"Paysage maritime en Côte d'Azur"`
- `index.html:102` — product schema : `"Photographies de la mer Méditerranée et de la Côte d'Azur"`
- `About.js:147` — `"Retrouvez mes captures vidéo de la Côte d'Azur sur ma chaîne YouTube."`
- `mock.js:14` — bio : `"...de la rade de Marseille aux rivages de la Côte d'Azur"`

**Analyse géographique** : Les lieux photographiés se répartissent en deux zones :
- **Provence / Bouches-du-Rhône (13)** : Marseille (Sormiou, Sugiton, En-Vau, Catalans, Bain des Dames, L'Estaque), Cassis (En-Vau, Cap Canaille), La Ciotat (Route des Crêtes, Port Saint-Jean, lever de soleil)
- **Var (83)** : Saint-Cyr-sur-Mer (Port d'Alon, La Madrague), Bandol, Sanary (Portissol), Six-Fours (Beaucours), Le Lavandou (La Fossette), Agay/Estérel (Calanque des Anglais)

**La Côte d'Azur** (sens touristique officiel du Comité Régional de Tourisme) **commence à Toulon ou Hyères** et s'étend jusqu'à Menton. Marseille, Cassis et La Ciotat (Bouches-du-Rhône) sont officiellement en **Provence**, pas en Côte d'Azur. La mention "French Riviera" (= Côte d'Azur stricte) pour des photos de Marseille est encore plus incorrecte.

**Correction proposée** : Remplacer "Côte d'Azur" / "French Riviera" par "Méditerranée Provençale", "Provence et littoral varois", ou "Méditerranée" selon le contexte.

Exemples concrets :
```diff
# index.html:51
- <title>Photographie maritime & tirages d'art Côte d'Azur | Franck Rouane</title>
+ <title>Photographie maritime & tirages d'art Méditerranée | Franck Rouane</title>

# index.html:15
- "photographe Côte d'Azur"
+ "photographe Provence Méditerranée"

# index.html:29
- "...de la mer Méditerranée et de la Côte d'Azur"
+ "...de la mer Méditerranée, des Calanques à la Côte Varoise"

# index.html:43 (twitter)
- "French Riviera landscapes" / "French Riviera photographer"
+ "Provence and Mediterranean landscapes" / "Provence Mediterranean photographer"

# About.js:147
- "Retrouvez mes captures vidéo de la Côte d'Azur sur ma chaîne YouTube."
+ "Retrouvez mes captures vidéo de la Méditerranée provençale sur ma chaîne YouTube."

# mock.js:14
- "...de la rade de Marseille aux rivages de la Côte d'Azur."
+ "...de la rade de Marseille aux rivages varois."
```

> **Note éditoriale** : Le terme "Côte d'Azur" peut être conservé pour les photos de l'Estérel/Agay (Var est, Saint-Raphaël), qui sont bien en Côte d'Azur. Mais il ne peut pas qualifier l'ensemble du portfolio.

---

### E4 — Numéro de téléphone placeholder dans schema.org

**Fichier** : `index.html:65`  
**Données actuelles** : `"telephone": "+33 6 00 00 00 00"`  
**Problème** : Numéro fictif exposé dans le schema.org LocalBusiness. Google peut l'indexer et l'afficher dans les résultats de recherche / Google Maps.  
**Correction** :
```diff
- "telephone": "+33 6 00 00 00 00",
+ // Supprimer la ligne, ou remplacer par le vrai numéro si Franck souhaite l'exposer
```

---

### E5 — Prix produit inexact dans schema.org

**Fichier** : `index.html:113`  
**Données actuelles** : `"price": "180"` (EUR)  
**Problème** : Aucun tirage au catalogue ne coûte 180 €. Les prix réels (productCatalog.json) vont de 49 € à 79 €. Cette valeur peut induire les moteurs de recherche en erreur et créer une attente erronée chez l'acheteur.  
**Correction** :
```diff
"offers": {
  "@type": "Offer",
- "price": "180",
+ "price": "49",
+ "priceSpecification": {
+   "@type": "PriceSpecification",
+   "minPrice": "49",
+   "maxPrice": "79",
+   "priceCurrency": "EUR"
+ },
  "priceCurrency": "EUR",
  "availability": "https://schema.org/InStock",
  "url": "https://frouanephotographie.com/boutique"
}
```

---

## PRIORITÉ 2 — Incohérences inter-pages

### I1 — Sitemap : URL slug erronée pour la collection couchers de soleil

**Fichier** : `sitemap.xml:20`  
**Données actuelles** : `https://frouanephotographie.com/collections/sunset`  
**Problème** : Le slug canonique défini dans `collectionsData.js:229` est `couchers-de-soleil`. Le slug `sunset` est un `legacySlug` (redirect), pas l'URL canonique. Le sitemap doit pointer vers l'URL canonique.  
**Correction** :
```diff
- <loc>https://frouanephotographie.com/collections/sunset</loc>
+ <loc>https://frouanephotographie.com/collections/couchers-de-soleil</loc>
```

---

### I2 — Incohérence www / non-www entre sitemap et SEOHead

**Fichiers** :
- `sitemap.xml` : utilise `https://frouanephotographie.com/` (sans www)
- `SEOHead.js:12` : `const siteUrl = 'https://www.frouanephotographie.com'` (avec www)
- `index.html:21` : `<link rel="canonical" href="https://frouanephotographie.com/" />` (sans www)

**Problème** : Les balises canonical générées par Helmet (`https://www.frouanephotographie.com/...`) divergent de celles de index.html et du sitemap. Risque de duplicate content signal pour les moteurs de recherche.  
**Décision à prendre** : Choisir une forme canonique (www ou non-www, selon la configuration Vercel) et l'appliquer uniformément.

```diff
# Si décision : sans www
# SEOHead.js:12
- const siteUrl = 'https://www.frouanephotographie.com';
+ const siteUrl = 'https://frouanephotographie.com';
```

---

### I3 — Cap Canaille : location incohérente selon les fichiers

**Fichiers** :
- `collectionsData.js:148` : `location: "Route des Crêtes"`
- `productCatalog.json:160,175` : `location: "Route des Crêtes"`
- `InteractiveMap.js` : Cap Canaille n'a pas de marqueur dédié (intégré dans "La Ciotat - Route des Crêtes")

**Problème** : Cap Canaille est une entité géographique distincte — le cap lui-même, à 362 m d'altitude, plus haut escarpement maritime de France métropolitaine, sur la commune de **Cassis** (Bouches-du-Rhône). La "Route des Crêtes" est la route (D141) qui le longe. Indiquer "Route des Crêtes" comme emplacement d'une photo de Cap Canaille confond le sujet photographique (le cap) avec l'axe routier d'accès.

**Correction** :
```diff
# collectionsData.js:148
- location: "Route des Crêtes",
+ location: "Cap Canaille, Cassis",

# productCatalog.json (cal-017 et cal-018)
- "location": "Route des Crêtes",
+ "location": "Cap Canaille, Cassis",
```

---

### I4 — Sugiton : nouvelles photos absentes du marqueur carte

**Fichier** : `InteractiveMap.js:76-78`  
**Problème** : Le marqueur Sugiton n'affiche que `sugiton01.jpeg` et `sugiton02.jpg`. Les photos `sugiton03.webp` et `sugiton04.webp` (ajoutées dans le commit `e852626`) sont dans collectionsData.js et le catalogue produit (cal-027, cal-028) mais absentes de la carte.  
**Correction** :
```diff
photos: [
  { title: getPhotoTitleFromPath("/Calanques/sugiton01.jpeg", "Sugiton"), image: "/Calanques/sugiton01.jpeg" },
  { title: getPhotoTitleFromPath("/Calanques/sugiton02.jpg", "Sugiton"), image: "/Calanques/sugiton02.jpg" },
+ { title: getPhotoTitleFromPath("/Calanques/sugiton03.webp", "Sugiton"), image: "/Calanques/sugiton03.webp" },
+ { title: getPhotoTitleFromPath("/Calanques/sugiton04.webp", "Sugiton"), image: "/Calanques/sugiton04.webp" },
],
```

---

### I5 — Photo lever-de-soleil-laciotat04.jpg : orpheline

**Fichier** : `frontend/public/Sunrise/lever-de-soleil-laciotat04.jpg`  
**Problème** : Ce fichier existe dans `public/Sunrise/` (et dans `build/Sunrise/`) mais est absent de :
- `collectionsData.js` (liste des photos sunrise : 01, 02, 03, 05, 06 — le 04 manque)
- `productCatalog.json` (sunrise-001 à sunrise-006 mais pas sunrise-004)
- `photoTitles.js` (pas de mapping)

La séquence 01→02→03→**05**→06 suggère que le 04 a été délibérément omis ou oublié.  
> **À DÉCIDER PAR FRANCK** : Cette photo doit-elle être ajoutée à la collection et au catalogue, ou supprimée/archivée ?

---

### I6 — Fichier "sunset fire  la ciotat.webp" (double espace) non référencé

**Fichier** : `frontend/public/Sunset/sunset fire  la ciotat.webp` (double espace entre "fire" et "la")  
**Problème** : Ce fichier coexiste avec `sunset fire la ciotat.webp` (un espace), qui lui est référencé dans collectionsData.js, photoTitles.js et productCatalog.json. Le fichier à double espace n'est référencé nulle part — probable doublon accidentel.  
**Correction** : Supprimer `"sunset fire  la ciotat.webp"` (double espace) si c'est un doublon du fichier à espace simple.

---

### I7 — Fichier "sunset fire la ciotat 3.jpg" non référencé

**Fichier** : `frontend/public/Sunset/sunset fire la ciotat 3.jpg`  
**Problème** : Ce fichier est présent dans `public/Sunset/` et `build/Sunset/` mais n'apparaît dans aucun fichier de données (collectionsData, photoTitles, productCatalog).  
> **À DÉCIDER PAR FRANCK** : Photo à ajouter au catalogue ou à supprimer ?

---

## PRIORITÉ 3 — Imprécisions toponymiques et géographiques

### T1 — Calanque d'En-Vau : location "Calanques" (trop vague)

**Fichier** : `collectionsData.js:113`  
**Données actuelles** : `location: "Calanques"`  
**Problème** : La calanque d'En-Vau est sur le territoire de la **commune de Cassis** (Bouches-du-Rhône). "Calanques" n'est pas une entité administrative mais un massif / parc national.  
**Source** : IGN, OSM ; Parc national des Calanques — En-Vau, commune de Cassis (13260).  
**Correction** :
```diff
- location: "Calanques",
+ location: "Cassis",
```

---

### T2 — Port d'Alon : commune erronée dans la description

**Fichiers** :
- `InteractiveMap.js:124` : `"entre Bandol et Saint-Cyr-sur-Mer"`
- `collectionsData.js:134` : `"Petite calanque entre Bandol et Saint-Cyr-sur-Mer"`

**Problème** : La calanque de Port d'Alon est intégralement sur la commune de **Saint-Cyr-sur-Mer** (Var, 83270). Elle n'est pas "entre" les deux communes — elle se situe sur le territoire de Saint-Cyr-sur-Mer, à l'est de la commune.  
**Source** : IGN Géoportail, cadastre 83 — Port d'Alon, commune de Saint-Cyr-sur-Mer.  
**Correction** :
```diff
# InteractiveMap.js:124
- "entre Bandol et Saint-Cyr-sur-Mer"
+ "à Saint-Cyr-sur-Mer"

# collectionsData.js:134
- "Petite calanque entre Bandol et Saint-Cyr-sur-Mer."
+ "Petite calanque à Saint-Cyr-sur-Mer, à l'est de la commune."
```

---

### T3 — Bain des Dames : arrondissement potentiellement incorrect

**Fichier** : `InteractiveMap.js:214`  
**Données actuelles** : `"8e arrondissement de Marseille"`  
**Problème** : Le nom "Bain des Dames" à Marseille désigne une crique rocheuse dans le secteur de Malmousque / Endoume, qui relève du **7e arrondissement** de Marseille (non du 8e). Le 8e arrondissement correspond au secteur Périer / Sainte-Anne / Bompard, plus à l'est.  
**Source** : Délimitations arrondissements Marseille (INSEE) ; OSM node pour le secteur Malmousque.  
> **À VÉRIFIER PAR FRANCK** : Confirmer l'emplacement exact de la prise de vue ("Bain des Dames" — secteur Malmousque 7e, ou autre zone du 8e ?). Si la photo est bien à Malmousque/Endoume, corriger en "7e arrondissement".

---

### T4 — Rocher de l'Éléphant non identifié dans les métadonnées

**Fichier** : `photoTitles.js:29`, `collectionsData.js:293`  
**Données actuelles** : titre `"Route des Crêtes, La Ciotat"` pour le fichier `"Coucher de soleil La Ciotat éléphant routedes crêtes.webp"`  
**Problème** : Le filename mentionne "éléphant" — probable référence au **Rocher de l'Éléphant**, formation rocheuse emblématique de la baie de La Ciotat. Ce sujet n'est mentionné dans aucun titre affiché, aucune description, aucun marqueur carte.  
> **À VÉRIFIER PAR FRANCK** : Le Rocher de l'Éléphant est-il effectivement visible (et sujet principal) sur cette photo ? Si oui, le titre devrait le mentionner : ex. `"Rocher de l'Éléphant depuis la Route des Crêtes, La Ciotat"`.

---

### T5 — "Beaucours" : commune de rattachement absente

**Fichiers** : `collectionsData.js:182`, `productCatalog.json:221,236`  
**Données actuelles** : `location: "Beaucours"` (sans commune)  
**Problème** : Beaucours est un hameau de **Six-Fours-les-Plages** (Var, 83140). La location devrait inclure la commune.  
**Source** : IGN, mairie de Six-Fours-les-Plages.  
**Correction** :
```diff
- location: "Beaucours",
+ location: "Beaucours, Six-Fours-les-Plages",
```

---

### T6 — Description "coucher de soleil" depuis La Ciotat : orientation à clarifier

**Fichier** : `InteractiveMap.js:147`, `collectionsData.js:289`  
**Données actuelles** : `"La Route des Crêtes surplombe la baie de La Ciotat et offre l'un des meilleurs belvédères du littoral pour photographier les couchers de soleil sur la mer."`  
**Analyse** : La baie de La Ciotat s'ouvre vers le **sud**. Le soleil se couche à l'**ouest** (ouest-nord-ouest en été, ouest-sud-ouest en hiver). Depuis la Route des Crêtes (dominant la baie côté ouest), on peut effectivement capter la lumière du couchant sur la mer en été (azimut ~300° en juin). Ce n'est pas une incohérence physique — c'est géographiquement plausible depuis le versant ouest du Cap Canaille. Cependant, depuis Port Saint-Jean (qui ouvre vers le sud), le soleil ne se couche pas "sur la mer" au sens strict.  
> **À VÉRIFIER PAR FRANCK** : Confirmer la direction de prise de vue pour chaque photo "coucher de soleil La Ciotat" (vers l'ouest depuis les hauteurs, ou lumière rasante sur la baie sud ?). Si la vue est vers la baie sud, remplacer "couchers de soleil sur la mer" par "lumière de fin de journée sur la mer".

---

### T7 — Fichier "routedes crêtes" (mot soudé dans le filename)

**Fichier** : `public/Sunset/Coucher de soleil La Ciotat éléphant routedes crêtes.webp`  
**Problème** : "routedes" est une faute de frappe ("route des" soudé). Sans conséquence fonctionnelle (le titre affiché est correct via photoTitles.js), mais témoigne d'un manque de rigueur dans le nommage des assets.  
> **À DÉCIDER PAR FRANCK** : Renommer le fichier si la rigueur est souhaitée (implique de mettre à jour collectionsData.js, photoTitles.js, productCatalog.json, printAssetCatalog.json).

---

## PRIORITÉ 4 — Problèmes SEO et accessibilité

### S1 — Keyword "tirage art" (apostrophe manquante)

**Fichier** : `SEOHead.js:131`  
**Données actuelles** : `"...tirage art, photographie paysage..."`  
**Correction** :
```diff
- "photographe marseille, calanques, littoral méditerranéen, tirage art, photographie paysage, méditerranée, coucher de soleil, fine art, photo provence"
+ "photographe marseille, calanques, littoral méditerranéen, tirage d'art, photographie paysage, méditerranée, coucher de soleil, fine art, photo provence"
```

---

### S2 — hreflang EN vers URL inexistante

**Fichier** : `index.html:22`  
**Données actuelles** : `<link rel="alternate" hreflang="en" href="https://frouanephotographie.com/en" />`  
**Problème** : Il n'existe pas de version anglaise du site. Cette balise crée un signal hreflang orphelin — Google peut ignorer ou pénaliser ce type de configuration cassée.  
**Correction** : Supprimer la balise, ou implémenter réellement une page `/en`.
```diff
- <link rel="alternate" hreflang="en" href="https://frouanephotographie.com/en" />
```

---

### S3 — schema.org LocalBusiness : addressLocality = "Côte d'Azur" (non valide)

**Fichier** : `index.html:68`  
**Données actuelles** : `"addressLocality": "Côte d'Azur"`  
**Problème** : "Côte d'Azur" n'est pas une commune — c'est une région touristique. Le champ `addressLocality` dans schema.org PostalAddress doit être une ville ou une commune.  
**Correction** :
```diff
"address": {
  "@type": "PostalAddress",
- "addressLocality": "Côte d'Azur",
+ "addressLocality": "Marseille",
+ "addressRegion": "Provence-Alpes-Côte d'Azur",
+ "postalCode": "13000",
  "addressCountry": "FR"
},
```

---

### S4 — schema.org collection : locationCreated toujours "Marseille, France"

**Fichier** : `SEOHead.js:96-99`  
**Données actuelles** : `"locationCreated": { "@type": "Place", "name": "Marseille, France" }`  
**Problème** : Ce schema est généré pour toutes les collections (calanques, couchers de soleil, lever de soleil). Les photos de La Ciotat, Cassis, ou du Var n'ont pas été créées à Marseille. Ce champ est inexact pour les collections non-Marseille.  
**Correction proposée** : Passer `locationCreated` en fonction du `collection.anchor` ou supprimer ce champ.

---

### S5 — Sitemap incomplet : URLs de collections manquantes

**Fichier** : `sitemap.xml`  
**Problème** : Le sitemap ne liste pas les URLs des collections individuelles `/collections/lever-de-soleil` et `/collections/couchers-de-soleil`, ni les sous-collections importantes.  
**Correction** : Ajouter au minimum :
```xml
<url>
  <loc>https://frouanephotographie.com/collections/couchers-de-soleil</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://frouanephotographie.com/collections/lever-de-soleil</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

### S6 — og:image utilise %PUBLIC_URL% dans index.html

**Fichier** : `index.html:32`  
**Données actuelles** : `<meta property="og:image" content="%PUBLIC_URL%/og-image.jpg" />`  
**Note** : `%PUBLIC_URL%` est une variable de template React remplacée au build. Dans le fichier source, c'est correct. Vérifier que le build produit bien une URL absolue (ex: `https://frouanephotographie.com/og-image.jpg`) et non une URL relative.

---

## PRIORITÉ 5 — Problèmes techniques

### P1 — sugiton03.jpeg / sugiton04.jpeg : fichiers originaux non nettoyés

**Fichiers** : `public/Calanques/sugiton03.jpeg`, `public/Calanques/sugiton04.jpeg`  
**Problème** : Ces fichiers coexistent avec `sugiton03.webp` et `sugiton04.webp`. Le commit `e852626` ("add sugiton03 and sugiton04 to collection and store (WebP optimized)") suggère que les .jpeg sont les originaux avant optimisation. Les .webp sont référencés dans tous les fichiers de données. Les .jpeg ne sont référencés nulle part.  
> **À DÉCIDER PAR FRANCK** : Archiver ou supprimer les .jpeg originaux si les .webp sont les versions finales. Si les .jpeg doivent être conservés comme backup, les placer hors du dossier public.

---

### P2 — Cohérence commerciale : éditions limitées non unifiées

**Fichier** : `productCatalog.json`  
**Problème** : Les produits cap-canaille (cal-017, cal-018) et d'autres ont `"edition_label": "Édition limitée"` sans numéro de tirage. Les produits Sugiton ont `"Édition limitée 1/20"`, La Ciotat sunset `"1/15"`, etc. Cette hétérogénéité est cohérente si volontaire, mais :
- `cal-017` et `cal-018` (Cap Canaille) : label vague sans numéro → à compléter si l'édition est limitée avec un nombre précis.
- `sunrise-*` : `"Édition limitée"` sans numéro alors que la FAQ mentionne "10 à 25 exemplaires".

> **À DÉCIDER PAR FRANCK** : Définir les numéros d'édition pour tous les produits marqués "Édition limitée" sans numéro.

---

## Résumé des décisions humaines requises

| Ref | Sujet | Question |
|---|---|---|
| E2 | Route des Crêtes | Quel point de la Route des Crêtes est photographié ? (côté Cassis/Cap Canaille ou côté La Ciotat ?) |
| I5 | lever-de-soleil-laciotat04.jpg | À ajouter au catalogue ou à supprimer ? |
| I7 | sunset fire la ciotat 3.jpg | À ajouter au catalogue ou à supprimer ? |
| T3 | Bain des Dames | Arrondissement exact : 7e ou 8e ? (dépend de la prise de vue) |
| T4 | Rocher de l'Éléphant | Est-il effectivement le sujet de la photo "éléphant routedes crêtes" ? |
| T6 | Coucher de soleil La Ciotat | Direction de prise de vue : vers l'ouest (coucher visible) ou vers la baie sud (lumière rasante) ? |
| T7 | Filename "routedes crêtes" | Renommer le fichier ou laisser tel quel ? |
| P1 | sugiton03/04.jpeg | Archiver ou supprimer les originaux .jpeg ? |
| P2 | Éditions limitées | Compléter les numéros d'édition manquants (Cap Canaille, Sunrise) ? |

---

## Récapitulatif par fichier

| Fichier | Issues | Priorités |
|---|---|---|
| `InteractiveMap.js` | E1, E2, I4, T3, T6 | P1, P1, P2, P3, P3 |
| `index.html` | E3, E4, E5, S2, S3 | P1, P1, P1, P4, P4 |
| `collectionsData.js` | I5, T1, T2, T5, S4 | P2, P3, P3, P3, P4 |
| `productCatalog.json` | I3, T5, P2 | P2, P3, P5 |
| `sitemap.xml` | I1, I2, S5 | P2, P2, P4 |
| `SEOHead.js` | I2, S1, S4 | P2, P4, P4 |
| `About.js` | E3 | P1 |
| `mock.js` | E3 | P1 |
| `photoTitles.js` | T4 | P3 |
| `public/Sunset/` | I6, I7, T7 | P2, P2, P3 |
| `public/Sunrise/` | I5, P1 | P2, P5 |
| `public/Calanques/` | P1 (sugiton jpeg) | P5 |

---

*Rapport généré le 2026-05-04 — sources géographiques : OpenStreetMap, IGN Géoportail, Parc national des Calanques, INSEE communes.*
