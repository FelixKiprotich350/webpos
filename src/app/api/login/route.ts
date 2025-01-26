// app/api/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateToken, verifyToken } from "../../../lib/jwt";
import { hashPassword, verifyPassword } from "../../../lib/password";

const prisma = new PrismaClient();

//interfaces
type LoginCredentials = {
  email: string;
  password: string;
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Find the user by email
    const user = await prisma.trtUser.findUnique({
      where: { email },
      include: { Person: true },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify the password
    const isPasswordValid = await verifyPassword(
      password,
      user.passwordHash ?? ""
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate a JWT token
    const token = generateToken({ id: user.uuid, email: user.email });
    let userDetails = { name: user.Person?.firstName, email: user.email };

    // Send the token in a secure HTTP-only cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: userDetails,
    });
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 100 * 60, // give in seconds
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  } finally {
    prisma.$disconnect();
  }
}
