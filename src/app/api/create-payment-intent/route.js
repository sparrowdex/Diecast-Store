
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const { amount } = await request.json();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return new NextResponse(error, {
      status: 400,
    });
  }
}
