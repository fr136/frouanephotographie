# Frouane Photographie

Les secrets backend doivent vivre dans `backend/.env` et ne doivent jamais
etre commites. Utilisez `backend/.env.example` comme modele local.

Verifications rapides :

- `git check-ignore -v backend/.env`
- `git status backend/.env.example`

En production, stockez les secrets dans les variables d'environnement Vercel,
pas dans Git. Si une cle a fuite dans l'historique, faites une rotation chez le
fournisseur puis purgez l'historique avant le prochain push.
