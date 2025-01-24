import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET: Fetch all packaging units
export async function GET() {
  try {
    const units = await prisma.packagingUnit.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(units);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" });
  }
}

 
export async function POST(req: NextApiRequest) {
  try {
    const body = await req.body; // Parse the JSON body explicitly
    const { name, countable } = body;
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const newUnit = await prisma.packagingUnit.create({
      data: {
        name,
        countable: Boolean(countable),
      },
    });

    return NextResponse.json(newUnit, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT: Update a packaging unit
export async function PUT(req: NextApiRequest) {
  try {
    const { id, name, countable } = req.body;
    if (!id) {
      return NextResponse.json({ error: "ID is required" });
    }

    const updatedUnit = await prisma.packagingUnit.update({
      where: { uuid: id },
      data: {
        ...(name && { name }),
        ...(countable !== undefined && { countable }),
      },
    });

    return NextResponse.json(updatedUnit);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" });
  }
}

// DELETE: Delete a packaging unit
export async function DELETE(req: NextApiRequest) {
  try {
    const { id } = req.body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" });
    }

    const deletedUnit = await prisma.packagingUnit.delete({
      where: { uuid: id },
    });

    return NextResponse.json(deletedUnit);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" });
  }
}
