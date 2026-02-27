'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Updates an order with Shiprocket fulfillment data.
 * Moves status from PAID -> SHIPPED.
 */
export async function updateOrderFulfillment(orderId, trackingNumber, shipmentId) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        trackingNumber,
        shipmentId: String(shipmentId),
        status: 'SHIPPED'
      }
    });

    // Revalidate paths to ensure UI updates immediately
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/orders/${orderId}`); // Customer side

    return { success: true };
  } catch (error) {
    console.error('Fulfillment Update Failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Helper to calculate SLA Priority Score for sorting the Admin List.
 */
export async function getPriorityScore(createdAt) {
  const hours = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60));
  if (hours > 48) return 3; // Critical
  if (hours > 12) return 2; // Urgent
  return 1; // New/Standard
}