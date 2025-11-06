My Shop — API & Front-End

Projet e-commerce complet avec une API Next.js et un front-end React déployés sur Vercel.

Site en ligne

Front-end : https://frontapp-lilac.vercel.app/login

API : hébergée sur Vercel (connectée à JSONBin pour le stockage des données)

Comptes de test


Rôle	Email	Mot de passe
Admin	admin@test.com
	admin


Utilisateur	user@test.com
	1234


Fonctionnalités

Côté admin

Ajouter un produit

Modifier un produit

Supprimer un produit

(En ligne, les fonctionnalités POST et PUT ne sont pas encore actives. En local, tout fonctionne normalement.)

Côté utilisateur

Consulter la liste des produits

Filtrer et trier les produits

Voir les détails d’un produit

Gérer le panier

Stack technique
Partie	Technologie
Front-end	React + React Router + Context API
Back-end	Next.js 14 (Route Handlers)
Stockage	JSONBin (données JSON distantes)
Hébergement	Vercel
Authentification	JWT
Variables d’environnement
Backend (Vercel)
JWT_SECRET=Imasami123---
PRODUCTS_BIN_ID=690ba4bb43b1c97be99b3d92
USERS_BIN_ID=690ba43b43b1c97be99b3ccf
JSONBIN_MASTER_KEY=$2a$10$1jDeR.JHxQsNb2LGfUfhfe4LfZB0y0bNx11VPUSxhwZFcy7OmTd/K
NODE_ENV=production

Frontend (Vercel)
VITE_API_BASE_URL=https://react-project-ochre-theta.vercel.app/api

Statut actuel

Lecture des produits et utilisateurs : OK

Connexion / Inscription : OK

Interface front responsive : OK

Ajout et modification de produits : en cours de correction (non fonctionnel sur la version en ligne)