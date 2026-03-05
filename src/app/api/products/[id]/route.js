import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const isPermanent = searchParams.get("permanent") === "true";

  try {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (isPermanent) {
      await prisma.product.delete({
        where: { id: id },
      });
      revalidatePath('/admin/inventory');
      return NextResponse.json({ success: true, message: "Exhibit permanently deleted" });
    }

    await prisma.product.update({
      where: { id: id },
      data: { collectionStatus: 'ARCHIVED' },
    });

    // Purge caches
    revalidatePath('/admin/inventory');
    revalidatePath('/catalog');
    revalidatePath('/');
    revalidatePath(`/products/${id}`);

    // Returning 200 with JSON to ensure frontend fetch "resolves" cleanly
    return NextResponse.json({ success: true, message: "Exhibit archived" }, { status: 200 });
  } catch (error) {
    console.error("Error archiving product:", error);
    return NextResponse.json({ error: "Error archiving product" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const data = await request.json();

  // Basic Validation & Parsing
  if (data.modelYear) data.modelYear = parseInt(data.modelYear, 10);
  if (data.stock) data.stock = parseInt(data.stock, 10);
  if (data.price) data.price = parseFloat(data.price);

  // Enum Validation
  const VALID_STATUSES = ['CATALOG', 'NEW_ARRIVAL', 'FEATURED_EXHIBIT', 'ARCHIVED'];
  if (data.collectionStatus && !VALID_STATUSES.includes(data.collectionStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: data,
    });

    revalidatePath('/admin/inventory');
    revalidatePath('/catalog');
    revalidatePath('/');
    revalidatePath(`/products/${id}`);
    
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Error updating product" }, { status: 500 });
  }
}