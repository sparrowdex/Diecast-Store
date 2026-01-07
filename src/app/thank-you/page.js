"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-2xl font-black italic uppercase">
        Thank You For Your Order!
      </h1>
      <p className="text-sm text-gray-600 mt-2">
        Your order ID is:{" "}
        <span className="font-mono text-black">{orderId}</span>
      </p>
      <p className="text-sm text-gray-600 mt-2">
        You will receive an email confirmation shortly.
      </p>
      <Link href="/" className="mt-8 text-xs font-mono underline">
        Continue Shopping
      </Link>
    </div>
  );
}
