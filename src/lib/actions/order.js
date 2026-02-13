"use server";

import prisma from "@/lib/prisma";

export async function createOrderAction(orderData) {
  try {
    // Use a transaction to ensure Order creation and Stock decrement happen together
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Order and nested OrderItems
      const order = await tx.order.create({
        data: {
          userId: orderData.userId,
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
              productId: item.id, // Required by schema
              name: item.name,
              price: parseFloat(item.price),
              quantity: parseInt(item.quantity),
              image: item.image || (item.images && item.images[0]) || "",
              sku: item.sku || null, // Capture the SKU snapshot
            })),
          },
        },
      });

      // 2. Decrement stock for each product
      for (const item of orderData.items) {
        const updatedProduct = await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: parseInt(item.quantity) } }
        });

        // 3. Prevent overselling
        if (updatedProduct.stock < 0) {
          throw new Error(`Insufficient stock for ${updatedProduct.name}.`);
        }
      }

      return order;
    });

    return { success: true, orderId: result.id };
  } catch (error) {
    console.error("❌ Checkout Error:", error);
    return { success: false, error: error.message || "Could not save order to database." };
  }
}