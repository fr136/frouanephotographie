#!/bin/bash

# Script de déploiement Git pour Frouane Photographie
# Usage: ./deploy.sh "votre message de commit"

echo "🚀 Déploiement Frouane Photographie"
echo "===================================="

# Vérifier si un message de commit est fourni
if [ -z "$1" ]; then
    echo "❌ Erreur : Veuillez fournir un message de commit"
    echo "Usage: ./deploy.sh \"feat: ajout nouvelle collection\""
    exit 1
fi

COMMIT_MSG="$1"

echo ""
echo "📝 Message de commit : $COMMIT_MSG"
echo ""

# Vérifier si git est initialisé
if [ ! -d ".git" ]; then
    echo "🔧 Initialisation de Git..."
    git init
    git branch -M main
    echo "✅ Git initialisé"
fi

# Configurer git user (à adapter)
echo "👤 Configuration utilisateur Git..."
git config user.name "Franck Rouane"
git config user.email "contact@franckrouane-photo.fr"

# Ajouter tous les fichiers
echo "📦 Ajout des fichiers..."
git add .

# Commit
echo "💾 Création du commit..."
git commit -m "$COMMIT_MSG"

# Vérifier si remote existe
if ! git remote | grep -q "origin"; then
    echo "🔗 Ajout du remote GitHub..."
    echo "⚠️  Vous devez avoir créé le repo sur GitHub !"
    read -p "URL du repo (https://github.com/fr136/frouane-photographie.git) : " REPO_URL
    git remote add origin "$REPO_URL"
fi

# Push
echo "🚀 Push vers GitHub..."
git push -u origin main

echo ""
echo "✅ Déploiement terminé !"
echo "🌐 Vercel va déployer automatiquement si configuré"
echo ""
