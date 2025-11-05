import { getCart, addToCart, clearCart } from "@/data/cart";
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

export async function GET(request) {
  const userId = request.headers.get("x-user-id") || "guest";
  const cart = getCart(userId);
  
  return NextResponse.json(cart, {
    headers: corsHeaders,
  });
}

export async function POST(request) {
  try {
    const userId = request.headers.get("x-user-id") || "guest";
    const { productId, quantity } = await request.json();
    
    const cart = addToCart(userId, productId, quantity);
    
    return NextResponse.json(
      { message: "Produit ajouté au panier", cart },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de l'ajout au panier" },
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function DELETE(request) {
  const userId = request.headers.get("x-user-id") || "guest";
  clearCart(userId);
  
  return NextResponse.json(
    { message: "Panier vidé" },
    { headers: corsHeaders }
  );
}
