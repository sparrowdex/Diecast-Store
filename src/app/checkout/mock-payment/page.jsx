"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function MockPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [status, setStatus] = useState("pending");

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  const handleAuthorize = async () => {
    setStatus("authorizing");
    // Simulate bank processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const mockPaymentId = `pay_mock_${Math.random().toString(36).substring(7)}`;
      
      const response = await fetch('/api/webhook/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-mock-request': 'true', // Header to bypass signature verification
        },
        body: JSON.stringify({
          event: 'payment.captured',
          payload: {
            payment: {
              entity: {
                order_id: orderId, // The razorpayOrderId
                id: mockPaymentId,
              },
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Webhook simulation failed');
      }

      // If webhook is successful, then clear cart and redirect
      if (typeof clearCart === 'function') clearCart();
      router.push(`/checkout/order-success?payment_id=${mockPaymentId}`);

    } catch (error) {
      console.error("Failed to authorize mock payment:", error);
      setStatus("failed"); // You might want to show an error state to the user
      alert("Payment authorization failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-xl font-black uppercase italic tracking-tighter text-black">Secure_Gateway</h1>
          <div className="text-[10px] font-mono bg-black text-white px-2 py-1">TEST_MODE</div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between border-b border-black/5 pb-2">
            <span className="text-[10px] uppercase font-bold text-gray-400">Merchant</span>
            <span className="text-xs font-bold uppercase text-black">Diecast_Store_International</span>
          </div>
          <div className="flex justify-between border-b border-black/5 pb-2">
            <span className="text-[10px] uppercase font-bold text-gray-400">Order_Ref</span>
            <span className="text-xs font-mono text-black">{orderId}</span>
          </div>
          <div className="flex justify-between border-b border-black/5 pb-2">
            <span className="text-[10px] uppercase font-bold text-gray-400">Amount</span>
            <span className="text-lg font-black italic text-black">₹{amount}</span>
          </div>
        </div>

        <button
          onClick={handleAuthorize}
          disabled={status === "authorizing"}
          className="w-full bg-black text-white py-4 font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 transition-colors disabled:bg-gray-400"
        >
          {status === "authorizing" ? "AUTHORIZING..." : "AUTHORIZE_PAYMENT"}
        </button>
      </div>
    </div>
  );
}
