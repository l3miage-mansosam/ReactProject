import { products } from "@/data/products";
import { verifyToken, extractTokenFromHeader } from "@/lib/jwt";
import { NextResponse } from "next/server";

const allowedOrigin = "http://localhost:5173";

const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  return NextResponse.json(products, {
    headers: corsHeaders,
  });
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 401, headers: corsHeaders }
      );
    }
    
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: "Accès refusé. Seuls les administrateurs peuvent ajouter des produits" },
        { status: 403, headers: corsHeaders }
      );
    }
    
    const { name, price, description, image, category, stock } = await request.json();
    
    if (!name || !price || !description || !image || !category || stock === undefined) {
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
    
    const product = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name,
      price: parseFloat(price),
      description,
      image,
      category,
      stock: parseInt(stock),
      createdAt: new Date().toISOString()
    };
    
    products.push(product);
    
    return NextResponse.json(
      { message: "Produit créé avec succès", product },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création du produit" },
      { status: 400, headers: corsHeaders }
    );
  }
}
