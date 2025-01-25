import { NextResponse } from "next/server";
import { PrismaClient, Product } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
interface paymentItem {
  paymentMode: string;
  amount: number;
  reference: string;
}
interface SellingItem extends Product {
  quantity: number;
  tax: number;
  total: number;
}

// export async function PUT(req: Request) {
//   try {
//     // Parse request body
//     const body = await req.json();
//     const { uuid, name, description, basicUnitUuid, categoryUuid,sellingPrice } = body;

//     // Validate required fields
//     if (!uuid || !name || !categoryUuid) {
//       return NextResponse.json(
//         { error: "Missing required fields: uuid, name, or categoryUuid" },
//         { status: 400 }
//       );
//     }

//     // Update the product
//     const updatedProduct = await prisma.product.update({
//       where: { uuid }, // Ensure uuid is unique in the database schema
//       data: {
//         name,
//         description,
//         basicUnitUuid,
//         categoryUuid,
//         sellingPrice: parseFloat(sellingPrice),
//       },
//       include: {
//         Category: true, // Include related category
//         PackagingUnit: true, // Include related unit
//       },
//     });

//     return NextResponse.json(updatedProduct, { status: 200 });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
//   finally{
//       prisma.$disconnect();
//     }
// }

// export async function DELETE() {
//   try {
//     // await prisma.product.delete({ where: { id: Number(id) } });
//     return NextResponse.json({ message: "Product deleted" });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
//   finally{
//       prisma.$disconnect();
//     }
// }

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { products, payments } = body;
    const allProducts = products as unknown as Array<Product>;
    const allPayments = payments as unknown as Array<paymentItem>;
    // Validate required fields
    if (allPayments.length <= 0 || allProducts.length <= 0) {
      return NextResponse.json(
        { error: "Missing required fields: Payments and Items required!" },
        { status: 400 }
      );
    }

    // Create a new sale
    const newsale = await prisma.productSale.create({
      data: {
        name,
        description: description || null, // Optional field
        sellingPrice: Number(sellingPrice) || 1,
        Category: {
          connect: {
            uuid: categoryUuid, // Match your `categoryUuid` field with the unique identifier
          },
        },
        PackagingUnit: {
          connect: {
            uuid: basicUnitUuid, // Match your `basicUnitUuid` field with the unique identifier
          },
        },
      },
    });

    // Return the created product
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}
