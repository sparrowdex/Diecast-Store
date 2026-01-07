
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const order = await prisma.order.findUnique({
    where: {
      id: params.id,
    },
    include: {
      items: true,
    },
  });
  return NextResponse.json(order);
}
