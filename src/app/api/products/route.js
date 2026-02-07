import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre");
    const status = searchParams.get("status");
    const query = searchParams.get("q");

    const where = {};
    if (genre && genre !== "ALL") where.genre = genre;
    if (status && status !== "ALL") where.collectionStatus = status;
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("PRODUCTS_FETCH_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();
    
    // Data Normalization
    if (data.modelYear) data.modelYear = parseInt(data.modelYear);
    if (data.stock) data.stock = parseInt(data.stock);

    const product = await prisma.product.create({
      data,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("PRODUCT_CREATE_ERROR:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}