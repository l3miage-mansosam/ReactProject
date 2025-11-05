import { getProductById, getProducts, saveProducts } from "@/lib/db";
import { verifyToken, extractTokenFromHeader } from "@/lib/jwt";
import { getCorsHeaders } from "@/lib/cors";
import { NextResponse } from "next/server";

export async function OPTIONS(request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

export async function GET(request, { params }) {
  const origin = request.headers.get("origin");
  const { id } = await params; 

  const product = getProductById(id);
  if (!product) {
    return NextResponse.json(
      { error: "Produit non trouvé" },
      { status: 404, headers: getCorsHeaders(origin) }
    );
  }

  return NextResponse.json(product, { headers: getCorsHeaders(origin) });
}

export async function PUT(request, { params }) {
  try {
    const origin = request.headers.get("origin");
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
        { error: "Accès refusé" },
        { status: 403, headers: getCorsHeaders(origin) }
      );
    }

    const { id } = await params; 
    const body = await request.json();
    const { name, price, description, image, category, stock } = body || {};

    const products = getProducts();
    const idx = products.findIndex((p) => p.id === parseInt(id));

    if (idx === -1) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404, headers: getCorsHeaders(origin) }
      );
    }

    products[idx] = {
      ...products[idx],
      name: name ?? products[idx].name,
      price: price !== undefined ? parseFloat(price) : products[idx].price,
      description: description ?? products[idx].description,
      image: image ?? products[idx].image,
      category: category ?? products[idx].category,
      stock: stock !== undefined ? parseInt(stock) : products[idx].stock,
      updatedAt: new Date().toISOString(),
    };

    saveProducts(products);

    return NextResponse.json(
      { message: "Produit modifié avec succès", product: products[idx] },
      { headers: getCorsHeaders(origin) }
    );
  } catch (error) {
    console.error("Erreur PUT /api/products/[id]:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { error: "Erreur lors de la modification du produit" },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const origin = request.headers.get("origin");
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
        { error: "Accès refusé" },
        { status: 403, headers: getCorsHeaders(origin) }
      );
    }

    const { id } = await params; 
    const products = getProducts();
    const idx = products.findIndex((p) => p.id === parseInt(id));

    if (idx === -1) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404, headers: getCorsHeaders(origin) }
      );
    }

    const deletedProduct = products.splice(idx, 1)[0];
    saveProducts(products);

    return NextResponse.json(
      { message: "Produit supprimé avec succès", product: deletedProduct },
      { headers: getCorsHeaders(origin) }
    );
  } catch (error) {
    console.error("Erreur DELETE /api/products/[id]:", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { error: "Erreur lors de la suppression du produit" },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}
