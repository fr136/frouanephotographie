# Frouane Photographie

Les secrets backend doivent vivre dans `backend/.env` et ne doivent jamais
etre commites. Utilisez `backend/.env.example` comme modele local.

Variables requises pour le tunnel de vente :

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PRODIGI_API_KEY`
- `FRONTEND_URL`
- `BLOB_READ_WRITE_TOKEN`

Upload Vercel Blob serveur uniquement :

- tous les masters d'impression : `npm --prefix frontend run upload:blob-masters`
- un seul produit : `npm --prefix frontend run upload:blob-product -- cal-001`

Verifications rapides :

- `git check-ignore -v backend/.env`
- `git status backend/.env.example`

En production, stockez les secrets dans les variables d'environnement Vercel,
pas dans Git. Si une cle a fuite dans l'historique, faites une rotation chez le
fournisseur puis purgez l'historique avant le prochain push.
