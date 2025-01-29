import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uuid, quantity, unitUuuid } = body;

    const product = await prisma.product.update({
      where: {
        uuid,
      },
      data:
      
    });

    return res.status(201).json(newCategory);

    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    prisma.$disconnect();
  }
}
