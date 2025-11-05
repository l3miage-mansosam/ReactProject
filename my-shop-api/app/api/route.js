import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";

export async function GET() {
  return NextResponse.json(
    {
      message: "MyShop API - Backend Next.js",
      version: "1.0.0",
      endpoints: {
        products: {
          "GET /api/products": "Liste tous les produits",
          "GET /api/products/:id": "Détails d'un produit",
          "POST /api/products": "Créer un produit (admin)",
          "PUT /api/products/:id": "Modifier un produit (admin)",
          "DELETE /api/products/:id": "Supprimer un produit (admin)"
        },
        users: {
          "POST /api/users/login": "Connexion utilisateur",
          "POST /api/users/register": "Inscription utilisateur",
          "GET /api/users/profile": "Profil utilisateur (authentifié)"
        },
        cart: {
          "GET /api/cart": "Récupérer le panier",
          "POST /api/cart": "Ajouter au panier",
          "PUT /api/cart/:id": "Modifier quantité",
          "DELETE /api/cart/:id": "Retirer du panier",
          "DELETE /api/cart": "Vider le panier"
        }
      },
      documentation: "https://github.com/votre-repo"
    },
    { headers: corsHeaders }
  );
}
