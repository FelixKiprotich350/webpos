// app/api/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateToken, verifyToken } from "../../../lib/jwt";
import { hashPassword, verifyPassword } from "../../../lib/password";

const prisma = new PrismaClient();

//interfaces
interface LoginCredentials {
  email: string;
  password: string;
}

 


export async function POST(request: Request) {
  const response = NextResponse.json({ message: 'Logout successful' });

  // Clear the token cookie
  response.cookies.set('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1, // Expire the cookie immediately
    path: '/',
  });

  return response;
}
