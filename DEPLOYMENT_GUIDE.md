# 🚀 Guide de Déploiement - Frouane Photographie

## 📦 Préparation avant Déploiement

### 1. Push sur GitHub (username: fr136)

```bash
# Dans le terminal
cd /app

# Initialiser git (si pas déjà fait)
git init

# Configurer votre identité
git config user.name "Franck Rouane"
git config user.email "votre@email.com"

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "feat: Portfolio photographie maritime complet avec e-commerce et écologie"

# Créer le repo sur GitHub puis :
git remote add origin https://github.com/fr136/frouane-photographie.git
git branch -M main
git push -u origin main
```

---

## 🌐 Déploiement sur Vercel (RECOMMANDÉ)

### Pourquoi Vercel ?
- ✅ Deploy gratuit illimité
- ✅ HTTPS automatique
- ✅ Domaine custom facile
- ✅ Build React automatique
- ✅ Variables d'environnement sécurisées
- ✅ Preview branches automatiques

### Étapes Vercel

#### 1. Créer compte Vercel
- Allez sur [vercel.com](https://vercel.com)
- "Sign up with GitHub"
- Connectez votre compte GitHub

#### 2. Importer le projet
- "Add New..." > "Project"
- Cherchez `frouane-photographie`
- Cliquez "Import"

#### 3. Configuration Build

**Framework Preset:** Create React App

**Root Directory:** `frontend`

**Build Command:**
```bash
yarn build
```

**Output Directory:** `build`

**Install Command:**
```bash
yarn install
```

#### 4. Variables d'environnement

Dans Settings > Environment Variables, ajoutez :

```
REACT_APP_BACKEND_URL=https://votre-backend-url.com
REACT_APP_GA4_ID=G-XXXXXXXXXX
REACT_APP_GSC_VERIFICATION=votre-code-verification
```

**Important :** Le backend doit être déployé séparément (voir section Backend)

#### 5. Deploy
- Cliquez "Deploy"
- Attendez 2-3 minutes
- Votre site est live ! 🎉

Exemple URL : `https://frouane-photographie.vercel.app`

#### 6. Domaine personnalisé (frouanephotographie.com)

1. Dans Vercel > Settings > Domains
2. Ajoutez `frouanephotographie.com` et `www.frouanephotographie.com`
3. Vercel vous donne les enregistrements DNS à configurer :

**Chez votre registrar (OVH, Gandi, Namecheap, etc.) :**

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. Attendez 1-24h pour propagation DNS
5. ✅ Votre site est sur votre domaine !

---

## 🔧 Déploiement Backend

### Option 1 : Railway (Gratuit, Facile)

1. Allez sur [railway.app](https://railway.app)
2. "Start a New Project" > "Deploy from GitHub repo"
3. Sélectionnez `frouane-photographie`
4. Root Directory : `backend`
5. Start Command : `uvicorn server:app --host 0.0.0.0 --port $PORT`

**Variables d'environnement :**
```
MONGO_URL=mongodb+srv://...
DB_NAME=frouane_photo
CORS_ORIGINS=https://frouanephotographie.com,https://www.frouanephotographie.com
```

6. Deploy → Récupérez l'URL (ex: `https://frouane-backend.railway.app`)

### Option 2 : Render (Gratuit)

1. [render.com](https://render.com)
2. "New +" > "Web Service"
3. Connectez GitHub
4. Root Directory : `backend`
5. Build Command : `pip install -r requirements.txt`
6. Start Command : `uvicorn server:app --host 0.0.0.0 --port $PORT`

**Variables d'environnement :** (même que Railway)

### MongoDB Cloud (OBLIGATOIRE)

Le backend a besoin de MongoDB. Utilisez MongoDB Atlas (gratuit) :

1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. "Build a Database" > Free Tier (M0)
3. Créez cluster
4. Database Access : Créez un user
5. Network Access : Autorisez `0.0.0.0/0` (toutes IPs)
6. Copiez la connection string : `mongodb+srv://user:password@cluster.mongodb.net/`

**Mettez cette URL dans les variables d'environnement du backend**

---

## 🔄 Workflow de Mise à Jour

### Après chaque modification :

```bash
cd /app
git add .
git commit -m "fix: correction bug panier"
git push
```

**Vercel redéploie automatiquement !** 🎉

---

## 📋 Checklist Avant Déploiement

### Frontend
- [ ] `.env` configuré avec bonnes URLs
- [ ] GA4 ID ajouté
- [ ] Search Console verification code
- [ ] Images optimisées
- [ ] Tests sur mobile

### Backend
- [ ] MongoDB Atlas configuré
- [ ] Variables d'environnement sur Railway/Render
- [ ] CORS configuré avec votre domaine
- [ ] Seed data exécuté

### DNS & Domaine
- [ ] Enregistrements A et CNAME configurés
- [ ] SSL automatique vérifié (Vercel le fait)
- [ ] www redirige vers domaine principal

### Analytics
- [ ] Google Analytics property créée
- [ ] Search Console vérifié
- [ ] Sitemap soumis

---

## 🆘 Problèmes Courants

### Site ne charge pas
- Vérifiez que `REACT_APP_BACKEND_URL` pointe vers le bon backend
- Console navigateur pour erreurs

### API ne répond pas
- Backend déployé et démarré ?
- CORS bien configuré ?
- MongoDB connecté ?

### Domaine ne fonctionne pas
- DNS propagation peut prendre 24h
- Vérifiez avec [whatsmydns.net](https://whatsmydns.net)
- Essayez en navigation privée

### Images ne s'affichent pas
- Chemins relatifs corrects ?
- Images dans `/public/photos/` ?

---

## 💰 Coûts Estimés

**Gratuit (avec limitations) :**
- Vercel : Illimité builds, 100GB bande passante/mois
- Railway : 500h/mois ($5 après)
- MongoDB Atlas : 512MB gratuit
- Domain : ~10-15€/an

**Si vous dépassez :**
- Vercel Pro : $20/mois
- Railway : $5/mois
- MongoDB : $0.08/Go

**Pour votre site photographique : Gratuit suffit largement au début !**

---

## 📊 Monitoring

### Après déploiement, surveillez :

1. **Vercel Analytics** (inclus gratuit)
   - Pages vues
   - Performance
   - Erreurs

2. **Google Analytics**
   - Trafic détaillé
   - Conversions

3. **Railway/Render Logs**
   - Erreurs backend
   - Requêtes API

---

## 🎯 Prochaines Étapes Après Déploiement

1. **Tester tout le site** en production
2. **Partager sur réseaux sociaux**
3. **Soumettre à Google** (via Search Console)
4. **Ajouter à Google My Business**
5. **Créer profil Instagram/Facebook** avec lien
6. **Backlinks** : Forums photo, annuaires

---

## 📞 Support

**Vercel :**
- [vercel.com/docs](https://vercel.com/docs)
- [Discord Vercel](https://vercel.com/discord)

**Railway :**
- [docs.railway.app](https://docs.railway.app)

**Problème technique ?**
Consultez les logs Vercel/Railway pour identifier l'erreur exacte.

---

**Bon déploiement Franck ! 🚀**

Votre site va cartonner ! 📸✨
