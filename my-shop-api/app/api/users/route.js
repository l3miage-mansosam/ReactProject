import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";

export async function GET() {
  return NextResponse.json(
    {
      message: "Users API",
      endpoints: {
        "POST /api/users/login": "Connexion utilisateur",
        "POST /api/users/register": "Inscription utilisateur",
        "GET /api/users/profile": "Profil utilisateur (authentifié)"
      }
    },
    { headers: corsHeaders }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
