import { authenticateUser } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import { corsHeaders } from "@/lib/cors";
import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const user = authenticateUser(email, password);
    
    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
    
    return NextResponse.json(
      { 
        message: "Connexion réussie",
        user,
        token
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la connexion" },
      { status: 500, headers: corsHeaders }
    );
  }
}
