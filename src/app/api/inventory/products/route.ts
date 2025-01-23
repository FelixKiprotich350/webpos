import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      // Get all categories
      const categories = await prisma.category.findMany({
        include: {
          Products: true, // Include related products
        },
      });
      return res.status(200).json(categories);
    }

    if (req.method === "POST") {
      // Create a new category
      const { name, description } = req.body;
      const newCategory = await prisma.category.create({
        data: {
          name,
          description,
        },
      });
      return res.status(201).json(newCategory);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
