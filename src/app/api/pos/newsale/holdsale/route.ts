import { NextResponse } from "next/server";
import { PrismaClient, Product } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

interface SellingItem extends Product {
  quantity: number;
  tax: number;
  total: number;
}

export function generateSaleNumber(): string {
  const timestamp = Math.floor(Date.now() / 1000); // Get current Unix timestamp in seconds
  return `S-${timestamp}`;
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { products, description } = body;

    const allProducts = products as Array<SellingItem>;
    // Validate required fields
    if (allProducts?.length <= 0) {
      return NextResponse.json(
        {
          error: "You have no Items to Hold!",
        },
        { status: 400 }
      );
    }

    // Start a transaction to save data
    const basket = await prisma.$transaction(async (transaction) => {
      // Save products
      await Promise.all(
        allProducts.map((product) =>
          transaction.basketSale.create({
            data: {
              productUuid: product.uuid,
              quantity: product.quantity,
              price: product.sellingPrice,
              taxPercentage: product.tax,
              userUuid: "Felix",
              description: description,
              packingUnitUuid: product.basicUnitUuid,
            },
          })
        )
      );
    });

    // Return the created sale
    return NextResponse.json( { status: 200 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
