'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';

//================================================================================
// MOCK SHIPROCKET API - Can be replaced with actual SDK
//================================================================================

const _private_createShipment = async (orderData: any) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    success: true,
    order_id: orderData.id,
    shipment_id: Math.floor(Math.random() * 10000000),
    status: "NEW",
    on_mock: true
  };
};

const _private_generateAWB = async (shipmentId: number) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    success: true,
    awb_code: `SR${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    courier_name: "BlueDart",
    courier_id: 24
  };
};

export const generateLabel = async (shipmentId: number) => {
  return {
    success: true,
    label_url: "https://shiprocket.co/mock-label.pdf"
  };
};

export const manifestPickup = async (shipmentId: string | number) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    success: true,
    courier_agent: "Vikram Singh (+91 98765 43210)",
    pickup_window: "14:00 - 18:00 Today"
  };
};

export const getTrackingStatus = async (status: string) => {
  const mapping: Record<string, string> = {
    "NEW": "PENDING",
    "AWB ASSIGNED": "SHIPPED",
    "IN TRANSIT": "IN_TRANSIT",
    "DELIVERED": "DELIVERED"
  };
  return mapping[status] || "PENDING";
};


//================================================================================
// SERVER ACTIONS
//================================================================================

import { calculateShipmentDetails } from '@/lib/shipping-presets';


//================================================================================
// SERVER ACTIONS
//================================================================================

export async function createShipment(orderId: string) {
  try {
    // 1. Fetch Order with Items and Product scale
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { 
        items: {
          include: {
            product: {
              select: { scale: true }
            }
          }
        } 
      },
    });

    if (!order) {
      return { success: false, error: "Order not found." };
    }
    if (order.paymentStatus !== 'PAID') {
      return { success: false, error: "Cannot create shipment for an unpaid order." };
    }
    if (order.shipmentId) {
      return { success: false, error: "Shipment already exists for this order." };
    }

    // 2. Calculate dimensions and weight from presets
    const { weight, length, breadth, height } = calculateShipmentDetails(order.items);
    
    const shiprocketOrderPayload = {
      ...order,
      weight,
      length,
      breadth,
      height
    };

    // 3. API Call (using mock)
    const shipment = await _private_createShipment(shiprocketOrderPayload);
    const awb = await _private_generateAWB(shipment.shipment_id);

    // 4. Persist to Database
    await prisma.order.update({
      where: { id: orderId },
      data: {
        shipmentId: shipment.shipment_id.toString(),
        trackingNumber: awb.awb_code,
        status: 'SHIPPED', // Or a more granular status like 'PROCESSING'
      },
    });

    return { 
      success: true, 
      data: {
        shipmentId: shipment.shipment_id,
        awbCode: awb.awb_code,
      }
    };
  } catch (err) {
    console.error("Fulfillment Error:", err);
    return { success: false, error: "An unexpected error occurred while creating the shipment." };
  }
}
