import { updateCartItem, removeFromCart } from "@/data/cart";
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

export async function PUT(request, { params }) {
  try {
    const userId = request.headers.get("x-user-id") || "guest";
    const { quantity } = await request.json();
    const productId = parseInt(params.productId);
    
    const cart = updateCartItem(userId, productId, quantity);
    
    return NextResponse.json(
      { message: "Quantité mise à jour", cart },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function DELETE(request, { params }) {
  const userId = request.headers.get("x-user-id") || "guest";
  const productId = parseInt(params.productId);
  
  const cart = removeFromCart(userId, productId);
  
  return NextResponse.json(
    { message: "Produit retiré du panier", cart },
    { headers: corsHeaders }
  );
}
