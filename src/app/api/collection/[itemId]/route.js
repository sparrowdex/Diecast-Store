import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  try {
    const { userId } = await auth();
    const { itemId } = await params;
    const { nickname } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify the item belongs to the user by checking the associated Order
    const item = await prisma.orderItem.findFirst({
      where: {
        id: itemId,
        order: {
          userId: userId,
        },
      },
    });

    if (!item) {
      return new NextResponse("Item not found in your collection", { status: 404 });
    }

    const updatedItem = await prisma.orderItem.update({
      where: { id: itemId },
      data: { nickname },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("[COLLECTION_ITEM_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}