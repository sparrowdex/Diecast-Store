import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured');
  const genre = searchParams.get('genre');
  const collectionStatus = searchParams.get('collectionStatus');
  const modelYear = searchParams.get('modelYear');
  const query = searchParams.get('q');

  const parsedYear = modelYear ? parseInt(modelYear, 10) : undefined;

  try {
    const products = await prisma.product.findMany({
      where: {
        // Redundancy Fix: The 'featured' boolean is now only used to sub-filter New Arrivals.
        // Homepage exhibits are determined by collectionStatus: "FEATURED_EXHIBIT".
        featured: (collectionStatus === 'NEW_ARRIVAL' && featured === 'true') ? true : undefined,
        genre: genre || undefined,
        collectionStatus: collectionStatus || undefined,
        modelYear: isNaN(parsedYear) ? undefined : parsedYear,
        OR: query ? [
          { name: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ] : undefined,
      },
      orderBy: {
        createdAt: 'desc',
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

  if (data.modelYear) {
    data.modelYear = parseInt(data.modelYear, 10);
    if (isNaN(data.modelYear)) {
      return new NextResponse("Invalid modelYear: must be a number", { status: 400 });
    }
  }

  // Enum Validation for collectionStatus
  const VALID_STATUSES = ['ARCHIVE_CATALOG', 'NEW_ARRIVAL', 'FEATURED_EXHIBIT'];
  if (data.collectionStatus && !VALID_STATUSES.includes(data.collectionStatus)) {
    return new NextResponse(`Invalid collectionStatus. Expected one of: ${VALID_STATUSES.join(', ')}`, { status: 400 });
  }

  // Data Integrity: 'featured' boolean is only relevant for NEW_ARRIVAL
  if (data.collectionStatus !== 'NEW_ARRIVAL') {
    data.featured = false;
  }

  // Enum Validation for genre (Identity System)
  const VALID_GENRES = [
    'CLASSIC_VINTAGE',
    'RACE_COURSE',
    'CITY_LIFE',
    'SUPERPOWERS',
    'LUXURY_REDEFINED',
    'OFF_ROAD',
    'FUTURE_PROOF'
  ];
  if (data.genre && !VALID_GENRES.includes(data.genre)) {
    return new NextResponse(`Invalid genre. Expected one of: ${VALID_GENRES.join(', ')}`, { status: 400 });
  }

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
