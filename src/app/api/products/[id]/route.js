import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    await prisma.product.delete({
      where: {
        id: id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return new NextResponse("Error deleting product", { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
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

  // Enum Validation for genre
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
    const updatedProduct = await prisma.product.update({
      where: {
        id: id,
      },
      data: data,
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return new NextResponse("Error updating product", { status: 500 });
  }
}
