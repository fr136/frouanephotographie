# Franck Rouane Photographie - PRD

## Original Problem Statement
L'utilisateur souhaitait améliorer son site de photographie existant sans toucher aux personnalisations existantes:
- Scroll animations immersives sur les pages collections
- Aperçu des collections amélioré sur la Home avec liens
- Bloc sensibilisation au surtourisme et à l'écologie sur Home et pages collection
- SEO et Google Analytics

## Architecture
- **Frontend**: React.js avec Framer Motion pour animations
- **Backend**: FastAPI (existant)
- **Database**: MongoDB (existant)
- **Styling**: Tailwind CSS + CSS personnalisé (photography.css)

## User Personas
1. **Visiteur** - Découvre les photographies de la Méditerranée
2. **Acheteur potentiel** - Intéressé par les tirages d'art
3. **Écologiste** - Sensible aux enjeux environnementaux

## Core Requirements (Static)
- Préserver le design existant (polices, couleurs, structure)
- Expérience immersive sur les collections
- Sensibilisation écologique intégrée

## What's Been Implemented - Jan 17, 2026

### Composants Créés
1. **ScrollAnimations.js** - Animations au scroll (FadeInOnScroll, ParallaxImage, StaggerContainer, etc.)
2. **CollectionsPreview.js** - Section aperçu collections avec parallax
3. **EcologySection.js** - Bloc sensibilisation Home (stats, alerte, actions)
4. **SEO.js** - Composant SEO (désactivé temporairement)

### Pages Modifiées
1. **Home.js** - Ajout animations hero, section collections preview, section écologie
2. **CollectionGallery.js** - Ajout animations photos, bloc écologie détaillé avec onglets
3. **App.js** - Intégration des nouveaux composants

### Fonctionnalités Ajoutées
- ✅ Hero animé avec indicateur de scroll
- ✅ Section About avec fade-in au scroll
- ✅ Collections Preview avec effets parallax et liens
- ✅ Section Écologie avec stats (2M+ visiteurs, 25% biodiversité, +20cm niveau mer)
- ✅ Alerte surtourisme et 4 gestes éco-responsables
- ✅ Galerie photos avec animations fade-in progressives
- ✅ Bloc écologie détaillé sur collections avec 4 onglets (Espèces, Menaces, Bonnes Pratiques, Agir)

## Prioritized Backlog

### P0 - Critical
- (Aucun)

### P1 - High Priority
- Réactiver SEO avec react-helmet-async (problème de configuration)
- Intégration Google Analytics 4 complète
- Google Search Console

### P2 - Medium Priority
- Smooth scroll avec Lenis
- Effet Ken Burns sur hero
- Curseur personnalisé
- Lightbox amélioré avec infos écologiques

## Next Tasks
1. Corriger le composant SEO pour les meta tags dynamiques
2. Configurer Google Analytics 4 avec l'ID GA4 de l'utilisateur
3. Ajouter sitemap dynamique pour SEO
4. Personnaliser l'image hero avec l'image souhaitée par l'utilisateur
