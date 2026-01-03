import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured');

  try {
    const products = await prisma.product.findMany({
      where: {
        featured: featured ? true : undefined,
      },
    });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new NextResponse("Error fetching products", { status: 500 });
  }
}

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
