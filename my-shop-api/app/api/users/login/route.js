import { authenticateUser } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import { getCorsHeaders } from "@/lib/cors";
import { NextResponse } from "next/server";

export async function OPTIONS(request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

//  connexion utilisateur
export async function POST(request) {
  try {
    const origin = request.headers.get("origin");
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    const user = authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401, headers: getCorsHeaders(origin) }
      );
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json(
      { message: "Connexion réussie", user, token },
      { headers: getCorsHeaders(origin) }
    );
  } catch (error) {
    console.error("Erreur POST /api/users :", error);
    const origin = request.headers.get("origin");
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}
