import { getUsers, saveUsers, findUserByEmail } from "@/lib/db";
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
    
    const users = getUsers();
    const newUser = {
      id: users.length + 1,
      email,
      password,
      name,
      role: "user",
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    const { password: _, ...userWithoutPassword } = newUser;
    const token = generateToken(userWithoutPassword);
    
    return NextResponse.json(
      { message: "Inscription réussie", user: userWithoutPassword, token },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500, headers: corsHeaders }
    );
  }
}
