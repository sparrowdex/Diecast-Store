'use server';

import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function createOrder(amount, orderDetails) {
  try {
    // 1. Create a preliminary order in your own database
    const preliminaryOrder = await prisma.order.create({
      data: {
        ...orderDetails,
        amount: amount,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
      },
    });

    // 2. Create a Razorpay order
    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: preliminaryOrder.id, // Use your internal order ID as the receipt
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 3. Update your order with the Razorpay order ID
    await prisma.order.update({
      where: { id: preliminaryOrder.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    return { success: true, order: razorpayOrder };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return { success: false, error: error.message };
  }
}
