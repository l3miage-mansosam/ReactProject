import { getProducts, saveProducts } from "@/lib/db";
import { verifyToken, extractTokenFromHeader } from "@/lib/jwt";
import { getCorsHeaders } from "@/lib/cors";
import { NextResponse } from "next/server";

// ✅ OPTIONS — pour le CORS preflight
export async function OPTIONS(request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

// ✅ GET — récupérer tous les produits
export async function GET(request) {
  const origin = request.headers.get("origin");
  const products = getProducts();
  return NextResponse.json(products, { headers: getCorsHeaders(origin) });
}

// ✅ POST — ajouter un produit (admin uniquement)
export async function POST(request) {
  try {
    const origin = request.headers.get("origin");

    // Vérifie le token
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401, headers: getCorsHeaders(origin) }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Accès refusé — réservé aux administrateurs" },
        { status: 403, headers: getCorsHeaders(origin) }
      );
    }

    // Lecture du corps de la requête
    const { name, price, description, image, category, stock } = await request.json();

    if (!name || !price || !description || !image || !category || stock === undefined) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    if (Number(price) <= 0) {
      return NextResponse.json(
        { error: "Le prix doit être supérieur à 0" },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    if (Number(stock) < 0) {
      return NextResponse.json(
        { error: "Le stock ne peut pas être négatif" },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    // Ajout du produit
    const products = getProducts();
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name,
      price: parseFloat(price),
      description,
      image,
      category,
      stock: parseInt(stock),
      createdAt: new Date().toISOString(),
    };

    products.push(newProduct);
    saveProducts(products);

    return NextResponse.json(
      { message: "Produit créé avec succès", product: newProduct },
      { status: 201, headers: getCorsHeaders(origin) }
    );

  } catch (error) {
    console.error("Erreur POST /api/products :", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du produit" },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}
// 