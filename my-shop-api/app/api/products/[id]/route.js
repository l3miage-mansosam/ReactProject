import { getProductById, products } from "@/data/products";
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

export async function GET(request, { params }) {
  const { id } = await params;
  const product = getProductById(id);
  
  if (!product) {
    return NextResponse.json(
      { error: "Produit non trouvé" },
      { status: 404, headers: corsHeaders }
    );
  }
  
  return NextResponse.json(product, {
    headers: corsHeaders,
  });
}

export async function PUT(request, { params }) {
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
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: "Accès refusé. Seuls les administrateurs peuvent modifier des produits" },
        { status: 403, headers: corsHeaders }
      );
    }

    const { id } = await params;
    const { name, price, description, image, category, stock } = await request.json();
    
    const productIndex = products.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404, headers: corsHeaders }
      );
    }

    if (!name || !price || !description || !image || !category || stock === undefined) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400, headers: corsHeaders }
      );
    }

    products[productIndex] = {
      ...products[productIndex],
      name,
      price: parseFloat(price),
      description,
      image,
      category,
      stock: parseInt(stock),
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(
      { message: "Produit modifié avec succès", product: products[productIndex] },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la modification du produit" },
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function DELETE(request, { params }) {
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
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: "Accès refusé. Seuls les administrateurs peuvent supprimer des produits" },
        { status: 403, headers: corsHeaders }
      );
    }

    const { id } = await params;
    const productIndex = products.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404, headers: corsHeaders }
      );
    }

    const deletedProduct = products.splice(productIndex, 1)[0];
    
    return NextResponse.json(
      { message: "Produit supprimé avec succès", product: deletedProduct },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression du produit" },
      { status: 400, headers: corsHeaders }
    );
  }
}
