"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { processPayment } from '@/lib/payment-utils';
import { createOrderAction } from '@/actions/order';

export default function CheckoutSummary({ items, subtotal, shipping, customer }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const total = subtotal + shipping;

  useEffect(() => {
    console.log("Summary Items Data:", items);
  }, [items]);

  const handlePayNow = async () => {
    setLoading(true);
    try {
      // 1. Save order to Prisma first (Status: PENDING)
      const orderResult = await createOrderAction({
        ...customer,
        total,
        items
      });

      if (!orderResult.success) {
        throw new Error(orderResult.error);
      }

      // 2. Trigger Payment (Mock or Razorpay)
      const paymentResult = await processPayment({
        amount: total,
        orderId: orderResult.orderId,
        customer: {
          name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email,
          phone: customer.phone
        }
      });

      if (paymentResult.success) {
        // 3. Redirect to success page
        router.push(`/checkout/order-success?payment_id=${paymentResult.razorpay_payment_id}`);
      } else {
        alert(paymentResult.error || "Payment Cancelled");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 text-sm">
            <div className="w-12 h-12 bg-gray-50 border border-black/5 rounded flex-shrink-0 p-1">
              <img
                src={item.image}
                className="w-full h-full object-contain mix-blend-multiply"
                alt={item.name}
              />
            </div>
            <span className="flex-1">{item.name} <span className="text-gray-400 text-xs">x{item.quantity}</span></span>
            <span className="font-bold">₹{(parseFloat(item.price) * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>
      <button
        onClick={handlePayNow}
        disabled={loading}
        className="w-full mt-6 py-4 bg-black text-white font-bold rounded-md hover:bg-gray-800 disabled:bg-gray-400"
      >
        {loading ? "PROCESSING..." : "PAY NOW"}
      </button>
    </div>
  );
}