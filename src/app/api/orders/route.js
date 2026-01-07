
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  const { cart, formData, total } = await request.json();

  const createdOrder = await prisma.order.create({
    data: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      country: formData.country,
      shippingMethod: formData.shippingMethod,
      total: total,
      items: {
        create: cart.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images[0],
        })),
      },
    },
    include: {
      items: true,
    },
  });

  return NextResponse.json(createdOrder);
}

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(orders);
}
