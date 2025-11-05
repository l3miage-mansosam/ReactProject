import { users } from "@/data/users";
import { findUserByEmail } from "@/data/users";
import { generateToken } from "@/lib/jwt";
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

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();
    
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 4 caractères" },
        { status: 400, headers: corsHeaders }
      );
    }

    const existingUser = findUserByEmail(email);
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409, headers: corsHeaders }
      );
    }
    
    const newUser = {
      id: users.length + 1,
      email,
      password,
      name,
      role: "user",
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    const token = generateToken({
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
      name: userWithoutPassword.name,
      role: userWithoutPassword.role
    });
    
    return NextResponse.json(
      { 
        message: "Inscription réussie",
        user: userWithoutPassword,
        token
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500, headers: corsHeaders }
    );
  }
}
