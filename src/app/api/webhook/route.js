
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return new NextResponse(`Webhook Error: ${error.message}`, {
      status: 400,
    });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    try {
      await prisma.order.updateMany({
        where: {
          paymentId: paymentIntent.id,
        },
        data: {
          paymentStatus: "paid",
        },
      });
    } catch (error) {
      return new NextResponse(`Database Error: ${error.message}`, {
        status: 500,
      });
    }
  }

  return NextResponse.json({ received: true });
}
