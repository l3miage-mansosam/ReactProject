import { removeFromCart } from "@/lib/db";
import { getCorsHeaders } from "@/lib/cors";
import { NextResponse } from "next/server";

// ✅ Gère la requête OPTIONS pour le CORS
export async function OPTIONS(request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

// ✅ Gère la suppression d’un produit du panier
export async function DELETE(request, { params }) {
  try {
    const origin = request.headers.get("origin");
    const { productId } = params; // pas besoin de "await", params n'est pas une promesse
    const userId = request.headers.get("x-user-id") || "guest";

    const updatedCart = removeFromCart(userId, productId);

    return NextResponse.json(
      { message: "Produit retiré du panier", cart: updatedCart },
      { headers: getCorsHeaders(origin) }
    );
  } catch (error) {
    console.error("Erreur DELETE /api/cart/[productId]:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du produit" },
      { status: 400, headers: getCorsHeaders(request.headers.get("origin")) }
    );
  }
}
