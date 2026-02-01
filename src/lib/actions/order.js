"use server";

import prisma from "@/lib/prisma";

export async function createOrderAction(orderData) {
  try {
    const order = await prisma.order.create({
      data: {
        firstName: orderData.firstName,
        lastName: orderData.lastName,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
        postalCode: orderData.postalCode,
        country: orderData.country,
        shippingMethod: orderData.shippingMethod || "Standard",
        total: parseFloat(orderData.total),
        status: "PENDING",
        paymentStatus: "UNPAID",
        items: {
          create: orderData.items.map((item) => ({
            name: item.name,
            price: parseFloat(item.price),
            quantity: parseInt(item.quantity),
            image: item.image || (item.images && item.images[0]) || "",
          })),
        },
      },
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("❌ Prisma Error:", error);
    return { success: false, error: "Could not save order to database." };
  }
}