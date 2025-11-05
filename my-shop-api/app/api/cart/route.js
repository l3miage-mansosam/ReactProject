import { getCartByUser, addToCart } from "@/lib/db";
import { getCorsHeaders } from "@/lib/cors";
import { NextResponse } from "next/server";

export async function OPTIONS(request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

export async function GET(request) {
  const origin = request.headers.get('origin');
  const userId = request.headers.get('x-user-id') || 'guest';
  const items = getCartByUser(userId);
  return NextResponse.json(items, { headers: getCorsHeaders(origin) });
}

export async function POST(request) {
  try {
    const origin = request.headers.get('origin');
    const userId = request.headers.get('x-user-id') || 'guest';
    const { productId, quantity } = await request.json();
    if (!productId) return NextResponse.json({ error: "productId requis" }, { status: 400, headers: getCorsHeaders(origin) });

    const items = addToCart(userId, productId, quantity || 1);
    return NextResponse.json({ message: "Ajouté", cart: items }, { status: 201, headers: getCorsHeaders(origin) });
  } catch (e) {
    const origin = request.headers.get('origin');
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: getCorsHeaders(origin) });
  }
}

export async function DELETE(request) {
  const userId = request.headers.get("x-user-id") || "guest";
  clearCart(userId);
  
  return NextResponse.json(
    { message: "Panier vidé" },
    { headers: getCorsHeaders(userId) }
  );
}
