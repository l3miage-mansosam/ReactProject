import { NextResponse } from "next/server";
import { getCorsHeaders } from "@/lib/cors";

export async function OPTIONS(request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

export async function GET(request) {
  const origin = request.headers.get('origin');
  return NextResponse.json(
    {
      message: "Users API",
      endpoints: {
        login: "POST /api/users/login",
        register: "POST /api/users/register",
        profile: "GET /api/users/profile (Authorization Bearer <token>)"
      }
    },
    { headers: getCorsHeaders(origin) }
  );
}

