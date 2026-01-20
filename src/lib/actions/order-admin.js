"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId, newStatus) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    });

    // Refresh the admin dashboard and the user's vault page
    revalidatePath("/admin/orders");
    revalidatePath("/access");
    return { success: true };
  } catch (error) {
    console.error("❌ Status Update Error:", error);
    return { success: false, error: "Failed to update status." };
  }
}