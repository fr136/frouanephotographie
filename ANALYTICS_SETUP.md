# Configuration Google Analytics & Search Console

## 📊 Google Analytics 4

### 1. Créer une propriété GA4

1. Allez sur [Google Analytics](https://analytics.google.com/)
2. Créez un compte si vous n'en avez pas
3. Créez une propriété GA4 :
   - Nom : "Frouane Photographie"
   - Fuseau horaire : Europe/Paris
   - Devise : EUR
4. Créez un flux de données Web :
   - URL du site : `https://frouanephotographie.com`
   - Nom du flux : "Site Web Principal"
5. **Copiez votre ID de mesure** (format : `G-XXXXXXXXXX`)

### 2. Configurer dans votre site

Éditez le fichier `/app/frontend/.env` :

```bash
REACT_APP_GA4_ID=G-VOTRE-ID-ICI
```

### 3. Événements trackés automatiquement

✅ **Pages vues** - Chaque changement de page
✅ **Scroll** - Profondeur de scroll
✅ **Clics sortants** - Liens externes
✅ **Recherche sur site** - Si implémenté
✅ **Téléchargements de fichiers** - PDFs, images

### 4. Événements e-commerce trackés

- `view_item` - Vue d'une photo
- `add_to_cart` - Ajout au panier
- `add_to_wishlist` - Ajout aux favoris
- `begin_checkout` - Début du checkout
- `purchase` - Achat complété
- `newsletter_signup` - Inscription newsletter

### 5. Données disponibles dans GA4

- **Acquisition** : D'où viennent vos visiteurs
- **Engagement** : Temps passé, pages vues, scroll
- **Monétisation** : Revenus, transactions, valeur panier
- **Rétention** : Visiteurs récurrents
- **Démographie** : Âge, sexe, centres d'intérêt
- **Technologie** : Appareils, navigateurs, OS
- **Géographie** : Pays, villes

---

## 🔍 Google Search Console

### 1. Vérifier votre propriété

1. Allez sur [Google Search Console](https://search.google.com/search-console/)
2. Cliquez sur "Ajouter une propriété"
3. Choisissez **"Préfixe d'URL"** : `https://frouanephotographie.com`
4. Méthode de validation : **Balise HTML**
5. Copiez le code entre les guillemets : `content="VOTRE-CODE-ICI"`

Exemple de balise fournie par Google :
```html
<meta name="google-site-verification" content="abc123XYZ456..." />
```

Copiez uniquement : `abc123XYZ456...`

### 2. Configurer dans votre site

Éditez `/app/frontend/.env` :

```bash
REACT_APP_GSC_VERIFICATION=abc123XYZ456...
```

### 3. Finaliser la vérification

1. Sauvegardez et redéployez votre site
2. Retournez sur Google Search Console
3. Cliquez sur "Vérifier"
4. ✅ Votre site est vérifié !

### 4. Soumettre le sitemap

Une fois vérifié, soumettez votre sitemap :
- URL : `https://frouanephotographie.com/sitemap.xml`
- Dans Search Console : Sitemaps > Ajouter un sitemap

### 5. Données disponibles dans Search Console

- **Performances** : Impressions, clics, CTR, position
- **Couverture** : Pages indexées, erreurs
- **Expérience** : Core Web Vitals, ergonomie mobile
- **Liens** : Backlinks, liens internes
- **Actions manuelles** : Pénalités éventuelles

---

## 🚀 Déploiement

### Après configuration

1. Éditez `/app/frontend/.env` avec vos IDs
2. Redémarrez le frontend : `sudo supervisorctl restart frontend`
3. Vérifiez dans la console navigateur : Vous devriez voir "GA4 Page View: /"
4. Validez sur Google Search Console
5. Attendez 24-48h pour voir les premières données dans GA4

### Variables d'environnement finales

```bash
# Backend
REACT_APP_BACKEND_URL=https://votre-backend-url.com

# Analytics
REACT_APP_GA4_ID=G-XXXXXXXXXX

# Search Console
REACT_APP_GSC_VERIFICATION=votre-code-verification
```

---

## 📈 Objectifs recommandés dans GA4

### Conversions à configurer

1. **Achat complété** - `purchase` (auto)
2. **Ajout au panier** - `add_to_cart`
3. **Newsletter** - `newsletter_signup`
4. **Contact** - Clic sur bouton contact
5. **Temps d'engagement** - >60 secondes

### Audiences utiles

1. **Acheteurs potentiels** : Ont vu >3 photos, n'ont pas acheté
2. **Abandonnistes panier** : Ont ajouté au panier, pas acheté
3. **Fans engagés** : >3 visites, >2 min par visite
4. **Mobile** : Appareils mobiles uniquement

---

## 🔧 Debugging

### Vérifier que GA4 fonctionne

1. Ouvrez votre site en navigation privée
2. Ouvrez la console (F12)
3. Naviguez entre les pages
4. Vous devriez voir : `GA4 Page View: /collections`

### Extension Chrome utile

Installez [**Google Analytics Debugger**](https://chrome.google.com/webstore/detail/google-analytics-debugger)
- Active les logs détaillés dans la console
- Vérifie que tous les hits sont envoyés

### Real-Time dans GA4

1. Allez dans GA4 > Rapports > En temps réel
2. Naviguez sur votre site
3. Vous devriez vous voir apparaître immédiatement

---

## 📞 Support

Si vous rencontrez des problèmes :
- [Aide Google Analytics](https://support.google.com/analytics)
- [Aide Search Console](https://support.google.com/webmasters)
- Vérifiez que les variables d'environnement sont bien configurées
- Consultez la console du navigateur pour les erreurs

---

**Dernière mise à jour** : Février 2025
