import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request,
  { params }: { params: { uuid: string } }
) {
  const { uuid } = params;

  try {
    const body = await req.json();
    const {  quantity, productPackUnitUuid } = body;
    console.log(body);
    // Validate required fields
    if (!uuid || !quantity || !productPackUnitUuid ) {
      return NextResponse.json(
        { error: "Missing required fields: productUuid, quantity, userUuid" },
        { status: 400 }
      );
    }

    // Create stock received entry
    const transaction = await prisma.stockReceived.create({
      data: {
        productUuid:uuid,
        quantity,
        productPackUnitUuid: productPackUnitUuid,
      },
    });

    return NextResponse.json(transaction, { status: 200 });
  } catch (error) {
    console.error("Error creating stock received entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}
