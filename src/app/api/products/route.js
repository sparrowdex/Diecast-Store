import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();

  try {
    const newProduct = await prisma.product.create({
      data: data,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return new NextResponse("Error creating product", { status: 500 });
  }
}
