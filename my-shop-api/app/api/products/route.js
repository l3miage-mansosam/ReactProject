import { getProducts, saveProducts } from "@/lib/db";
import { verifyToken, extractTokenFromHeader } from "@/lib/jwt";
import { corsHeaders } from "@/lib/cors";
import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// 🔹 GET – Récupère tous les produits
export async function GET() {
  const products = getProducts();
  return NextResponse.json(products, { headers: corsHeaders });
}

// 🔹 POST – Ajoute un nouveau produit (réservé admin)
export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401, headers: corsHeaders }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        {
          error:
            "Accès refusé. Seuls les administrateurs peuvent ajouter des produits.",
        },
        { status: 403, headers: corsHeaders }
      );
    }

    const { name, price, description, image, category, stock } =
      await request.json();

    if (
      !name ||
      !price ||
      !description ||
      !image ||
      !category ||
      stock === undefined
    ) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: "Le prix doit être supérieur à 0" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (stock < 0) {
      return NextResponse.json(
        { error: "Le stock ne peut pas être négatif" },
        { status: 400, headers: corsHeaders }
      );
    }

    const products = getProducts();
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
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
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erreur POST /api/products :", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du produit" },
      { status: 500, headers: corsHeaders }
    );
  }
}
