import { verifyToken, extractTokenFromHeader } from "@/lib/jwt";
import { users } from "@/data/users";
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
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { error: "Token manquant" },
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
    
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404, headers: corsHeaders }
      );
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { 
        message: "Profil récupéré avec succès",
        user: userWithoutPassword
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération du profil" },
      { status: 500, headers: corsHeaders }
    );
  }
}
