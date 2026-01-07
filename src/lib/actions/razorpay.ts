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
  image: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Initialize Razorpay client
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

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

export async function createOrder(items: CartItem[], rawFormData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: 'User is not authenticated.' };
  }

  const formData = Object.fromEntries(rawFormData.entries());

  // Validate form data
  const validation = formSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: 'Invalid form data.', details: validation.error.flatten() };
  }
  const validatedData = validation.data;

  // Calculate total amount on the server to prevent client-side manipulation
  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the main Order record
      const order = await tx.order.create({
        data: {
          userId,
          ...validatedData,
          total: totalAmount,
          status: 'PENDING',
          paymentStatus: 'UNPAID',
          items: {
            create: items.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })),
          },
        },
        include: {
          items: true, // Include the created items in the result
        },
      });

      // 2. Create the Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100, // Amount in paise
        currency: 'INR',
        receipt: order.id, // Use our internal order ID as the receipt
      });

      // 3. Update our order with the Razorpay order ID
      await tx.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: razorpayOrder.id },
      });

      return { success: true, order: razorpayOrder };
    });

    return result;

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
    await prisma.order.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        paymentStatus: 'PAID',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error verifying payment and updating order:', error);
    return { success: false, error: 'Failed to update order status.' };
  }
}
