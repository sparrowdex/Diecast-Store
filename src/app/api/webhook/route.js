import { NextResponse } from "next/server";

export async function POST(request) {
  return new NextResponse(
    "Stripe webhooks are deprecated. Please use Razorpay webhooks at /api/webhook/razorpay for payment processing.",
    {
      status: 400,
    }
  );
}

