import { NextResponse } from 'next/server';

// This is a simple in-memory cart for demonstration
// In a real application, you'd use a database and session management
let carts: { [sessionId: string]: any[] } = {};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId') || 'default';
  
  return NextResponse.json({
    items: carts[sessionId] || [],
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { sessionId = 'default', productId, quantity } = body;
  
  if (!carts[sessionId]) {
    carts[sessionId] = [];
  }
  
  const existingItem = carts[sessionId].find(
    (item) => item.productId === productId
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[sessionId].push({ productId, quantity });
  }
  
  return NextResponse.json({
    success: true,
    items: carts[sessionId],
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId') || 'default';
  const productId = searchParams.get('productId');
  
  if (carts[sessionId] && productId) {
    carts[sessionId] = carts[sessionId].filter(
      (item) => item.productId !== Number(productId)
    );
  }
  
  return NextResponse.json({
    success: true,
    items: carts[sessionId] || [],
  });
}
