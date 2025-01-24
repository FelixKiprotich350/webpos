import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uuid } = req.query;

  if (!uuid || Array.isArray(uuid)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    switch (req.method) {
      // GET: Fetch a single packaging unit
      case "GET": {
        const unit = await prisma.packagingUnit.findUnique({
          where: { uuid: uuid },
        });

        if (!unit) {
          return res.status(404).json({ error: "Packaging unit not found" });
        }

        return res.status(200).json(unit);
      }

      // PUT: Update a packaging unit
      case "PUT": {
        const { name, countable } = req.body;

        if (!name) {
          return res.status(400).json({ error: "Name is required" });
        }

        const updatedUnit = await prisma.packagingUnit.update({
          where: { uuid: uuid },
          data: {
            name,
            countable: Boolean(countable),
          },
        });

        return res.status(200).json(updatedUnit);
      }

      // DELETE: Remove a packaging unit
      case "DELETE": {
        await prisma.packagingUnit.delete({
          where: { uuid: uuid },
        });

        return res.status(204).end();
      }

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res
          .status(405)
          .json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
