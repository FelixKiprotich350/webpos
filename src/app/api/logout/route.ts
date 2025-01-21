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

//Functions
//get all rows
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching users" });
  } finally {
    await prisma.$disconnect();
  }
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
