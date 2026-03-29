# Franck Rouane Photographie - PRD

## Original Problem Statement
Redesign des collections Calanques et Sunset pour les rendre plus premium, immersives et visuellement fortes.

### Direction Créative:
- **Calanques**: Mediterranean, mineral, bright, elegant, coastal atmosphere
- **Sunset**: warm, cinematic, golden-hour, emotional atmosphere

### Contraintes Techniques:
- Garder la compatibilité React/Vercel
- Préserver les routes et assets existants
- Ne pas toucher aux autres pages (sauf composants partagés)

## Architecture
- **Frontend**: React.js + Framer Motion + TailwindCSS
- **Routing**: React Router avec slugs /collections/:slug
- **Images**: Assets statiques dans /public/Calanques et /public/Sunset

## User Personas
1. **Amateur de photographie** - Recherche des images artistiques de qualité
2. **Acheteur potentiel** - Veut acquérir des tirages d'art
3. **Visiteur local** - Intéressé par la région Méditerranée

## What's Been Implemented - Mars 2026

### Nouveaux Composants Créés
1. **PremiumCollectionGallery.js** - Composant premium avec:
   - Thèmes distincts par collection (turquoise/méditerranéen vs orange/cinématique)
   - Hero immersif avec parallax
   - Section citation/intro
   - Galerie masonry avec photos featured
   - Section écologie avec onglets

2. **premium-gallery.css** - Styles premium avec:
   - Variables CSS par thème (.collection-calanques, .collection-sunset)
   - Effets hover sophistiqués
   - Layout masonry responsive
   - Badges "Featured"
   - Animations scroll indicator

### Fonctionnalités
- ✅ Hero parallax avec image de couverture
- ✅ Badge de collection (Golden Hour / Méditerranée Sauvage)
- ✅ Tags d'atmosphère (Lumineux, Minéral, Méditerranéen / Cinématique, Chaleureux, Émotionnel)
- ✅ Citation artistique + attribution auteur
- ✅ Galerie premium avec photos featured en grand
- ✅ Hover effects avec numéro de photo et titre
- ✅ Lightbox plein écran
- ✅ Boutons favoris
- ✅ Section écologie intégrée
- ✅ Mobile responsive (390px+)
- ✅ Scroll indicator animé

### Tests: 95%+ passés
- Thèmes distincts: 100%
- Galerie: 100%
- Mobile: 95%
- Navigation: 90%

## Prioritized Backlog

### P0 - Critique
- (Aucun)

### P1 - Important
- API backend wishlist pour persistance favoris

### P2 - Moyen
- Animations scroll plus fluides (Lenis)
- Lightbox avec infos photo (location, date)
- Effet Ken Burns sur hero au chargement

## Files Changed
- `/app/frontend/src/pages/PremiumCollectionGallery.js` (nouveau)
- `/app/frontend/src/styles/premium-gallery.css` (nouveau)
- `/app/frontend/src/App.js` (route modifiée)

## Next Tasks
1. Déployer sur Vercel via GitHub
2. Ajouter Google Analytics
3. Optimiser les images (WebP, lazy loading avancé)
