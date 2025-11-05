import { verifyToken, extractTokenFromHeader } from "@/lib/jwt";
import { getUsers } from "@/lib/db";
import { getCorsHeaders } from "@/lib/cors";
import { NextResponse } from "next/server";

// ✅ OPTIONS — pour les requêtes préflight (CORS)
export async function OPTIONS(request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

// ✅ GET — récupérer le profil utilisateur connecté
export async function GET(request) {
  try {
    const origin = request.headers.get("origin");

    // Vérifie la présence du token
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return NextResponse.json(
        { error: "Token manquant" },
        { status: 401, headers: getCorsHeaders(origin) }
      );
    }

    // Vérifie la validité du token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Token invalide" },
        { status: 401, headers: getCorsHeaders(origin) }
      );
    }

    // Recherche de l'utilisateur correspondant
    const users = getUsers();
    const user = users.find((u) => u.id === decoded.id);
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404, headers: getCorsHeaders(origin) }
      );
    }

    // Supprime le mot de passe du retour
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "Profil récupéré avec succès", user: userWithoutPassword },
      { headers: getCorsHeaders(origin) }
    );
  } catch (error) {
    console.error("Erreur GET /api/users :", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération du profil" },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}
