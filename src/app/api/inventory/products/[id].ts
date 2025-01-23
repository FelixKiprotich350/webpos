import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      // Get a single product
      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: {
          Category: true, // Include related category
        },
      });
      if (!product) return res.status(404).json({ error: "Product not found" });
      return res.status(200).json(product);
    }

    if (req.method === "PUT") {
      // Update a product
      const { name, description, basicUnit, uuid } = req.body;
      const updatedProduct = await prisma.product.update({
        where: { uuid: Array.isArray(id) ? id[0] : id },
        data: {
          name,
          description,
          basicUnit,
          categoryUuid: uuid,
        },
      });
      return res.status(200).json(updatedProduct);
    }

    if (req.method === "DELETE") {
      // Delete a product
      await prisma.product.delete({ where: { id: Number(id) } });
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
