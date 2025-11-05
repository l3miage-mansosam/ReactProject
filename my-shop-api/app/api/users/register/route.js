import { getUsers, saveUsers, findUserByEmail } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import { getCorsHeaders } from "@/lib/cors";
import { NextResponse } from "next/server";

export async function OPTIONS(request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

export async function POST(request) {
  try {
    const origin = request.headers.get('origin');
    const { email, password, name } = await request.json();
    if (!email || !password || !name) return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400, headers: getCorsHeaders(origin) });

    if (findUserByEmail(email)) return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409, headers: getCorsHeaders(origin) });

    const users = getUsers();
    const newUser = { id: users.length + 1, email, password, name, role: "user", createdAt: new Date().toISOString() };
    users.push(newUser);
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    const token = generateToken({ id: userWithoutPassword.id, email: userWithoutPassword.email, name: userWithoutPassword.name, role: userWithoutPassword.role });

    return NextResponse.json({ message: "Inscription réussie", user: userWithoutPassword, token }, { status: 201, headers: getCorsHeaders(origin) });
  } catch (e) {
    const origin = request.headers.get('origin');
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: getCorsHeaders(origin) });
  }
}
