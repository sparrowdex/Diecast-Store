import { NextResponse } from "next/server";

export async function POST(request) {
  return new NextResponse(
    "Stripe integration is deprecated. Please use Razorpay for payment processing.",
    {
      status: 400,
    }
  );
}
