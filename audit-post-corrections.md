# Audit post-corrections — frouanephotographie.com
**Date** : 2026-05-04  
**Branche** : `audit-corrections-2026-05`  
**Commits produits** : 4

---

## Ce qui a été corrigé

### Commit 1 — `8d14b62` — Corrections AUTO lot principal

| Ref | Fichier(s) modifié(s) | Correction appliquée |
|---|---|---|
| E1 | `InteractiveMap.js:71` | Sugiton GPS : `[43.2102, 5.4426]` → `[43.2094, 5.4567]` |
| I4 | `InteractiveMap.js:76` | Sugiton : photos 03 et 04 ajoutées au marqueur carte |
| I3 | `collectionsData.js:148` | Cap Canaille location : "Route des Crêtes" → "Cap Canaille, Cassis" |
| — | `collectionsData.js:153` | Cap Canaille altitude : 362 m → 394 m (IGN) |
| T1 | `collectionsData.js:113` | En-Vau location : "Calanques" → "Cassis" |
| T5 | `collectionsData.js:181` | Beaucours location : "Beaucours" → "Sanary-sur-Mer" |
| I3 | `productCatalog.json` (cal-017, cal-018) | Cap Canaille location → "Cap Canaille, Cassis" |
| T5 | `productCatalog.json` (cal-021, cal-022) | Beaucours location → "Beaucours, Sanary-sur-Mer" |
| T3 | `productCatalog.json` (sun-006) | Bain des Dames location → "Marseille, 8e arrondissement" |
| I1 | `sitemap.xml` | `/collections/sunset` → `/collections/couchers-de-soleil` + ajout `/collections/lever-de-soleil` |
| S1 | `SEOHead.js:131` | keywords : "tirage art" → "tirage d'art" |
| S2 | `index.html:22` | Suppression hreflang EN (URL inexistante) |
| S3 | `index.html:64-70` | schema.org addressLocality "Côte d'Azur" → "Marseille" + ajout addressRegion + postalCode |
| E4 | `index.html:65` | Suppression téléphone placeholder "+33 6 00 00 00 00" |
| E5 | `index.html:113` | Prix schema.org 180€ → PriceSpecification 49–79 EUR |
| E3 | `index.html` (×6) | Remplacement "Côte d'Azur" / "French Riviera" par "Méditerranée" / "Méditerranée provençale" / "Mediterranean & Provence" |
| E3 | `About.js:147` | "Côte d'Azur" → "Méditerranée provençale" |
| E3 | `mock.js:14` | "rivages de la Côte d'Azur" → "rivages de la Méditerranée" |

### Commit 2 — `0d79b65` — Route des Crêtes GPS

| Fichier | Correction |
|---|---|
| `InteractiveMap.js:127-130` | Marqueur "La Ciotat – Route des Crêtes" repositionné : `[43.21527, 5.552392]` (territoire Cassis) → `[43.1854, 5.6070]` (versant La Ciotat, belvédère Sémaphore) |

### Commit 3 — `80027c6` — Canonical www

| Fichier | Correction |
|---|---|
| `sitemap.xml` (×11 URLs) | `https://frouanephotographie.com/` → `https://www.frouanephotographie.com/` |
| `index.html` (canonical, hreflang, og:url, twitter:url, schema url) | Alignement www (Vercel sert www comme canonical) |

**Découverte en cours** : La redirection `frouanephotographie.com → www.frouanephotographie.com` est actuellement un **307 Temporary Redirect**. Il devrait être en **301 Permanent** pour consolider le signal SEO. À corriger dans le dashboard Vercel (Project Settings > Domains).

### Commit 4 — `887b5db` — Archivage fichiers orphelins

| Fichier | Mouvement |
|---|---|
| `public/Calanques/sugiton03.jpeg` | → `_archive/Calanques/` (original JPEG, remplacé par .webp) |
| `public/Calanques/sugiton04.jpeg` | → `_archive/Calanques/` (original JPEG, remplacé par .webp) |
| `public/Sunrise/lever-de-soleil-laciotat04.jpg` | → `_archive/Sunrise/` (photo orpheline, hors collection) |
| `public/Sunset/sunset fire  la ciotat.webp` | → `_archive/Sunset/` (doublon double-espace, non référencé) |
| `public/Sunset/sunset fire la ciotat 3.jpg` | → `_archive/Sunset/` (photo orpheline, non référencée) |

Nouveau fichier `.vercelignore` → exclut `frontend/_archive/` du déploiement.

---

## Ce qui reste à faire

### Actions hors code (Franck)

| Priorité | Action | Détail |
|---|---|---|
| 🔴 Urgent | **Vercel : 307 → 301** | Project Settings > Domains. La redirection apex→www doit être Permanent (301) pour que Google consolide le PageRank. |
| 🟡 Important | **Google Search Console : resoumettre le sitemap** | URL : `https://www.frouanephotographie.com/sitemap.xml`. Vérifier couverture dans 48h. |
| 🟡 Important | **Google Rich Results Test** | Tester `https://www.frouanephotographie.com/` et une page collection. |
| 🟡 Important | **Vérification carte interactive** | Après déploiement, cliquer chaque marqueur. Check liste ci-dessous. |
| 🟠 À planifier | **Filename "routedes crêtes"** | `Coucher de soleil La Ciotat éléphant routedes crêtes.webp` — "routedes" est soudé. Si renommage : mettre à jour collectionsData.js, photoTitles.js, productCatalog.json, printAssetCatalog.json en même temps. |
| 🟠 À planifier | **Photo lever-de-soleil-laciotat04.jpg** | Archivée. Décider si elle rejoint le catalogue ou reste archivée. |
| 🟠 À planifier | **Photo sunset fire la ciotat 3.jpg** | Archivée. Même décision. |
| 🟢 Facultatif | **Rocher de l'Éléphant dans le titre** | Si la photo "routedes crêtes" montre effectivement le Rocher de l'Éléphant, enrichir le titre : "Rocher de l'Éléphant depuis la Route des Crêtes, La Ciotat". |
| 🟢 Facultatif | **Éditions limitées sans numéro** | Cap Canaille (cal-017, cal-018) et Sunrise ont "Édition limitée" sans numéro. Compléter si les tirages ont un nombre défini. |

### Checklist de vérification carte (post-déploiement)

- [ ] **Sugiton** → coordonnées 43.2094°N, 5.4567°E ✓ ; affiche photos 01, 02, 03, 04
- [ ] **En-Vau** → libellé "Cassis" dans la fiche lieu
- [ ] **Cap Canaille** → libellé "Cap Canaille, Cassis" ; altitude "394 mètres" dans la description
- [ ] **Port d'Alon** → libellé "Saint-Cyr-sur-Mer" ; description conserve "entre Bandol et Saint-Cyr-sur-Mer"
- [ ] **La Ciotat – Route des Crêtes** → marqueur sur versant La Ciotat (43.1854°N, 5.6070°E), tiret demi-cadratin
- [ ] **Bain des Dames** → fiche lieu cohérente avec "8e arrondissement"
- [ ] **Beaucours** → libellé "Sanary-sur-Mer"

### Vérification SEO (post-déploiement)

- [ ] Aucune mention "Côte d'Azur" en dehors du nom de région INSEE dans les balises rendues
- [ ] `<title>` de la home : "...Méditerranée..."
- [ ] `og:image` résout bien vers une URL absolue (pas `%PUBLIC_URL%`)
- [ ] Sitemap accessible à `https://www.frouanephotographie.com/sitemap.xml`
- [ ] Balise canonical sur plusieurs pages = `https://www.frouanephotographie.com/...`

---

## Points résiduels détectés en cours d'application

1. **Redirection 307 au lieu de 301** (voir ci-dessus) : découverte lors de la vérification live du domaine pour le commit 3.

2. **printAssetCatalog.json non mis à jour** : les champs `location` de ce fichier n'ont pas été modifiés (ils ne sont pas affichés à l'utilisateur mais servent à Prodigi). À synchroniser avec productCatalog.json lors d'une prochaine passe de maintenance si la cohérence est requise côté Prodigi.

3. **Schema.org collection — locationCreated hardcodé "Marseille, France"** (SEOHead.js:96) : non corrigé dans cette session. Pour les collections La Ciotat et Var, ce champ reste inexact. Correction future : passer `locationCreated` via les données de collection.

4. **Beaucours — à valider** : la décision Sanary-sur-Mer est appliquée sur indication de Franck. La plage de Beaucours est physiquement entre Six-Fours-les-Plages et Sanary ; si une vérification cadastrale contredit, corriger.

---

*Rapport généré le 2026-05-04 — branche `audit-corrections-2026-05`*
