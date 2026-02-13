'use server';

import prisma from '@/lib/prisma';
import Razorpay from 'razorpay';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import crypto from 'crypto';

// Define the shape of cart items for validation and typing
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  images?: string[];
  sku?: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Initialize Razorpay client lazily to avoid crash in mock mode
const getRazorpay = () => {
  if (process.env.NEXT_PUBLIC_PAYMENT_MODE === 'mock') return null;
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'missing',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'missing',
  });
};

// Zod schema for validating form data
const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  shippingMethod: z.string(),
});

export async function createOrder(items: CartItem[], rawFormData: FormData, passedUserId?: string | null) {
  const authData = await auth();
  const userId = passedUserId || authData?.userId || null;

  const formData = Object.fromEntries(rawFormData.entries());

  const validation = formSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: 'Invalid form data.', details: validation.error.flatten() };
  }
  const validatedData = validation.data;

  const totalAmount = items.reduce((acc, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    return acc + (price * item.quantity);
  }, 0);

  try {
    // 1. Create the Razorpay order FIRST
    let razorpayOrder;
    const tempOrderIdForReceipt = `receipt_${crypto.randomBytes(8).toString('hex')}`;

    if (process.env.NEXT_PUBLIC_PAYMENT_MODE === 'mock') {
      razorpayOrder = { id: `order_mock_${crypto.randomBytes(4).toString('hex')}` };
    } else {
      const rzp = getRazorpay();
      if (!rzp) throw new Error("Razorpay keys are missing in non-mock mode.");
      
      razorpayOrder = await rzp.orders.create({
        amount: totalAmount * 100,
        currency: 'INR',
        receipt: tempOrderIdForReceipt,
      });
    }

    if (!razorpayOrder) {
      throw new Error("Failed to create Razorpay order.");
    }

    // 2. If Razorpay order is successful, create the order in our DB.
    // This is a single atomic operation thanks to Prisma's nested create.
    await prisma.order.create({
      data: {
        userId,
        ...validatedData,
        total: totalAmount,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        razorpayOrderId: razorpayOrder.id, // Add the razorpay ID
        items: {
          create: items.map((item) => ({
            name: item.name,
            price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
            quantity: item.quantity,
            image: item.image || (Array.isArray(item.images) ? item.images[0] : "/placeholder-car.png"),
            sku: item.sku || null,
            product: { 
              connect: { id: item.id }
            },
          })),
        },
      },
    });

    return { success: true, order: razorpayOrder };

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return { success: false, error: 'Failed to create order.' };
  }
}

export async function verifyPayment(response: RazorpayResponse) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
  const secret = process.env.RAZORPAY_KEY_SECRET!;

  const generated_signature = crypto
    .createHmac('sha256', secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generated_signature !== razorpay_signature) {
    return { success: false, error: 'Invalid signature.' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Update the order status
      const order = await tx.order.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: {
          paymentStatus: 'PAID',
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        include: { items: true }
      });

      // 2. Deduct stock for each item purchased
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Error verifying payment and updating order:', error);
    return { success: false, error: 'Failed to update order status.' };
  }
}
