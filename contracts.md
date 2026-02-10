# Contrats API & Intégration - Frouane Photographie

## Vue d'ensemble

Site de portfolio photographique maritime avec :
- 6 collections thématiques
- ~10 photos par collection
- Galerie immersive avec carte interactive
- Backend FastAPI + MongoDB
- Frontend React optimisé

---

## Structure des Données

### Collection
```json
{
  "_id": "ObjectId",
  "id": "string (calanques-marseille)",
  "title": "string (Calanques de Marseille)",
  "subtitle": "string (Les joyaux cachés de la côte)",
  "description": "string (long)",
  "category": "string (calanques)",
  "coverImage": "string (URL)",
  "photoCount": "number",
  "slug": "string",
  "order": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Photo
```json
{
  "_id": "ObjectId",
  "id": "string",
  "title": "string",
  "collectionId": "string (ref to collection)",
  "imageUrl": "string",
  "caption": "string (optionnel - à remplir plus tard)",
  "location": {
    "name": "string (optionnel)",
    "coordinates": {
      "lat": "number (optionnel)",
      "lng": "number (optionnel)"
    }
  },
  "dateTaken": "datetime (optionnel)",
  "camera": "string (optionnel)",
  "settings": "string (optionnel)",
  "tags": ["array of strings"],
  "order": "number",
  "featured": "boolean",
  "createdAt": "datetime"
}
```

---

## Endpoints API

### Collections

#### GET /api/collections
Récupère toutes les collections
```json
Response: [Collection]
```

#### GET /api/collections/:slug
Récupère une collection spécifique avec ses photos
```json
Response: {
  "collection": Collection,
  "photos": [Photo]
}
```

#### POST /api/collections
Crée une nouvelle collection (admin)
```json
Request: Collection data
Response: Collection
```

#### PUT /api/collections/:id
Met à jour une collection
```json
Request: Partial<Collection>
Response: Collection
```

### Photos

#### GET /api/photos
Récupère toutes les photos (avec pagination optionnelle)
```json
Query params: ?collection=slug&limit=50&skip=0
Response: {
  "photos": [Photo],
  "total": number,
  "hasMore": boolean
}
```

#### GET /api/photos/:id
Récupère une photo spécifique
```json
Response: Photo
```

#### POST /api/photos
Ajoute une nouvelle photo
```json
Request: {
  "title": "string",
  "collectionId": "string",
  "imageUrl": "string",
  "caption": "string (optional)",
  "location": { ... } (optional),
  ...
}
Response: Photo
```

#### PUT /api/photos/:id
Met à jour une photo (légendes, localisations)
```json
Request: Partial<Photo>
Response: Photo
```

#### DELETE /api/photos/:id
Supprime une photo
```json
Response: { "success": true }
```

### Upload

#### POST /api/upload
Upload une photo (fichier)
```json
Request: multipart/form-data
Response: {
  "url": "string",
  "filename": "string"
}
```

---

## Frontend - Structure des Composants

### Pages

#### /collections
- Vue grille de toutes les collections
- Filtres par catégorie
- Animations au scroll

#### /collections/:slug
- **Galerie immersive** (composant principal)
- Grille mosaïque adaptive
- Lightbox avec navigation clavier
- Carte interactive (Leaflet) avec marqueurs
- Filtres et tri
- Mode plein écran

#### /photo/:id (optionnel)
- Vue détaillée d'une photo
- Métadonnées complètes
- Partage social
- Photos similaires

### Composants clés

#### `<Gallery />`
- Grille masonry responsive
- Lazy loading progressif
- Transitions fluides
- Hover effects subtils

#### `<Lightbox />`
- Navigation entre photos
- Zoom progressif
- Swipe mobile
- Affichage métadonnées
- Fermeture ESC/clic extérieur

#### `<InteractiveMap />`
- Leaflet.js (léger)
- Marqueurs cliquables par photo
- Clustering si besoin
- Style personnalisé sobre
- Intégration dans galerie

#### `<PhotoCard />`
- Image optimisée (lazy)
- Overlay info au hover
- Click ouvre lightbox
- Skeleton loading

---

## Migration Mock → Backend

### Actuellement (mock.js)
- Données statiques dans `/app/frontend/src/mock.js`
- Images Unsplash temporaires
- 6 collections définies
- Aucune persistance

### Après intégration
- Données en MongoDB
- API endpoints fonctionnels
- Images dans `/app/frontend/public/photos/` ou CDN
- Système d'upload intégré
- Champs légendes/localisations vides mais présents

### Process de remplacement
1. Backend : Créer models MongoDB (Collection, Photo)
2. Backend : Implémenter tous les endpoints
3. Backend : Créer script de seed initial avec données mock
4. Frontend : Créer services API (`/src/services/api.js`)
5. Frontend : Remplacer imports mock par appels API
6. Frontend : Ajouter états de chargement (skeletons)
7. Frontend : Gérer erreurs réseau
8. Testing : Vérifier toutes les pages

---

## Optimisations Performance

### Images
- Format WebP avec fallback JPEG
- Lazy loading natif + IntersectionObserver
- Responsive images (srcset)
- Compression optimale (quality 85%)
- CDN-ready structure

### Code
- Code splitting par route
- Composants React.lazy()
- Memoization (useMemo, useCallback)
- Debounce sur recherche/filtres
- Pagination backend

### Lighthouse Targets
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

---

## Gestion des Photos

### Structure fichiers
```
/app/frontend/public/photos/
  /calanques/
    photo-001.jpg
    photo-002.jpg
  /ports/
    photo-001.jpg
  ...
```

### Ou via Upload API
- Endpoint `/api/upload`
- Stockage : `/app/backend/uploads/`
- Accessible via route statique FastAPI
- Noms de fichiers avec UUID

### Workflow utilisateur (Franck)
1. **Option A** : Déposer photos dans `/public/photos/{collection}/`
2. **Option B** : Interface admin avec upload (à créer si souhaité)
3. Mettre à jour légendes via appels API ou interface admin
4. Ajouter coordonnées GPS via API ou interface

---

## Carte Interactive - Spécifications

### Librairie : Leaflet.js
- Légère (~40KB)
- Performante
- Personnalisable
- Mobile-friendly

### Fonctionnalités
- Marqueurs pour chaque photo avec location
- Popup au clic : miniature + titre
- Vue par défaut : Côte d'Azur (Marseille-Monaco)
- Zoom sur marqueur au clic photo
- Style sobre (Mapbox Streets ou custom)
- Pas de markers si pas de coordonnées

### Intégration
- Section dédiée sous la galerie
- Synchronisation : clic photo → zoom map
- Optionnel : toggle pour afficher/masquer

---

## SEO & Métadonnées

### Pages Collections
```html
<title>Calanques de Marseille | Franck Rouane Photographe</title>
<meta name="description" content="Collection de photographies...">
<meta property="og:image" content="cover-image-url">
<meta property="og:type" content="website">
```

### Schema.org
```json
{
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": "Collection Name",
  "description": "...",
  "image": [...],
  "creator": {
    "@type": "Person",
    "name": "Franck Rouane"
  }
}
```

---

## Déploiement GitHub

### Structure repo
```
frouane-photographie/
├── frontend/
│   ├── src/
│   ├── public/
│   │   └── photos/  (git-ignored si trop gros)
│   └── package.json
├── backend/
│   ├── server.py
│   ├── models/
│   ├── routes/
│   ├── uploads/  (git-ignored)
│   └── requirements.txt
├── README.md
├── .gitignore
└── contracts.md (ce fichier)
```

### README.md doit inclure
- Description projet
- Stack technique
- Installation locale
- Variables d'environnement
- Commandes de démarrage
- Déploiement Vercel
- Structure des collections

### Commits types
- `feat: add immersive gallery component`
- `backend: implement collections API`
- `perf: optimize image loading`
- `docs: update README with deploy instructions`

---

## État actuel vs État final

### Actuellement ✓
- Frontend React fonctionnel avec mock
- 6 collections définies
- Design élégant noir/blanc/or
- Navigation complète
- Responsive

### À implémenter ⏳
- Backend MongoDB complet
- Endpoints API collections/photos
- Galerie immersive avec lightbox
- Carte interactive Leaflet
- Système d'upload photos
- Intégration API frontend
- Champs légendes/localisations vides
- Optimisations performance
- Tests et validation
- Push GitHub propre

---

## Notes importantes

1. **Photos actuelles** : Images Unsplash temporaires, structure prête pour remplacement
2. **Légendes** : Champ présent mais vide, Franck remplira après
3. **Localisations** : Coordonnées GPS optionnelles, structure prête
4. **Performance** : Priorité absolue, pas d'effet gadget
5. **3D** : Non implémenté initialement (ajout possible plus tard si pertinent)
6. **Admin UI** : Optionnel, peut être ajouté après (pour upload/édition)

---

**Date de création** : 7 février 2025
**Dernière mise à jour** : 7 février 2025
**Statut** : En cours de développement
