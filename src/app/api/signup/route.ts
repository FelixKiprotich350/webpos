// app/api/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../../lib/password";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
// const prisma = new PrismaClient();

//interfaces
type LoginCredentials = {
  email: string;
  password: string;
};

export async function POST(request: Request) {
  try {
    const { email, password, firstname, lastname } = await request.json();

    // Check if the email is already taken
    let person = await prisma.person.findUnique({ where: { email } });
    // Create Person first to get the UUID if not existing
    if (!person) {
      person = await prisma.person.create({
        data: {
          firstName: firstname,
          lastName: lastname,
          email: email,
        },
      });
    }

    // Create TrtUser with the person's UUID
    const user = await prisma.trtUser.create({
      data: {
        username: email,
        personUuid: person.uuid, // Referencing the created person via uuid
        email: email,
        passwordHash: await hashPassword(password),
        roleId: 0, // Default role ID
      },
    });

    // Return success response
    return NextResponse.json({
      message: "Signup successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        person: {
          firstName: person.firstName,
          lastName: person.lastName,
        },
      },
    });
  } catch (error: any) {
    console.error("Error during signup:", error);

    // Return error response
    return NextResponse.json(
      { error: error.message || "An unknown error occurred." },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}
